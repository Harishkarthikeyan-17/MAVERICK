const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    const { email, password, role, name } = req.body;

    try {
        // Validate input exists
        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password and role are required' });
        }

        const emailNormalized = email.toLowerCase().trim();

        // Check if user already exists
        const existing = await pool.query(
            'SELECT user_id FROM users WHERE email_normalized = $1',
            [emailNormalized]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Validate role
        const validRoles = ['solo', 'ward', 'guardian'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be solo, ward, or guardian' });
        }

        // Hash password — never store plain text
        const passwordHash = await bcrypt.hash(password, 12);

        // Insert user into DB
        const result = await pool.query(
            `INSERT INTO users (email, email_normalized, password_hash, role, full_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, email, role, full_name, created_at`,
            [email, emailNormalized, passwordHash, role, name || null]
        );

        // Log the action
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, ip_address)
       VALUES ($1, 'register', $2)`,
            [result.rows[0].user_id, req.ip]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0]
        });

    } catch (err) {
        console.error('[REGISTER ERROR]', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input exists
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const emailNormalized = email.toLowerCase().trim();

        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE email_normalized = $1 AND deleted_at IS NULL',
            [emailNormalized]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check if account is locked
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return res.status(403).json({ error: 'Account temporarily locked. Try again later.' });
        }

        // Compare password against hash
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            // Increment failed attempts, lock after 5 failures
            await pool.query(
                `UPDATE users SET
           failed_attempts = failed_attempts + 1,
           locked_until = CASE
             WHEN failed_attempts >= 4
             THEN NOW() + INTERVAL '15 minutes'
             ELSE locked_until
           END
         WHERE user_id = $1`,
                [user.user_id]
            );
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Reset failed attempts on successful login
        await pool.query(
            `UPDATE users SET
         failed_attempts = 0,
         locked_until = NULL,
         last_login_at = NOW()
       WHERE user_id = $1`,
            [user.user_id]
        );

        // Create JWT token
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Log the action
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, ip_address)
       VALUES ($1, 'login', $2)`,
            [user.user_id, req.ip]
        );

        res.json({
    message: 'Login successful',
    token,
    role: user.role,
    user_id: user.user_id,
    full_name: user.full_name || 'User'
    });

    } catch (err) {
        console.error('[LOGIN ERROR]', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../config/mailer');

// FORGOT PASSWORD — send reset email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const emailNormalized = email.toLowerCase().trim();

    const result = await pool.query(
      'SELECT user_id, email FROM users WHERE email_normalized = $1 AND deleted_at IS NULL',
      [emailNormalized]
    );

    // Always return success even if email not found — prevents user enumeration attack
    if (result.rows.length === 0) {
      return res.json({ message: 'If this email exists, a reset link has been sent.' });
    }

    const user = result.rows[0];

    // Invalidate any existing unused reset tokens for this user
    await pool.query(
      `UPDATE one_time_tokens SET used_at = NOW()
       WHERE user_id = $1 AND purpose = 'password_reset' AND used_at IS NULL`,
      [user.user_id]
    );

    // Generate a cryptographically secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Store hashed token in DB
    await pool.query(
      `INSERT INTO one_time_tokens (user_id, token_hash, purpose, expires_at)
       VALUES ($1, $2, 'password_reset', NOW() + INTERVAL '15 minutes')`,
      [user.user_id, tokenHash]
    );

    // Send email with raw token
    await sendPasswordResetEmail(user.email, rawToken);

    // Log the action
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, ip_address)
       VALUES ($1, 'password_reset_requested', $2)`,
      [user.user_id, req.ip]
    );

    res.json({ message: 'If this email exists, a reset link has been sent.' });

  } catch (err) {
    console.error('[FORGOT PASSWORD ERROR]', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// RESET PASSWORD — verify token and set new password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    // Hash the incoming token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid unused unexpired token
    const result = await pool.query(
      `SELECT t.token_id, t.user_id FROM one_time_tokens t
       WHERE t.token_hash = $1
         AND t.purpose = 'password_reset'
         AND t.used_at IS NULL
         AND t.expires_at > NOW()`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' });
    }

    const { token_id, user_id } = result.rows[0];

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await pool.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW(),
       failed_attempts = 0, locked_until = NULL
       WHERE user_id = $2`,
      [passwordHash, user_id]
    );

    // Mark token as used — can never be reused
    await pool.query(
      `UPDATE one_time_tokens SET used_at = NOW() WHERE token_id = $1`,
      [token_id]
    );

    // Revoke all active sessions — force re-login everywhere
    await pool.query(
      `UPDATE sessions SET revoked = TRUE, revoke_reason = 'password_reset'
       WHERE user_id = $1 AND revoked = FALSE`,
      [user_id]
    );

    // Log the action
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, ip_address)
       VALUES ($1, 'password_reset_completed', $2)`,
      [user_id, req.ip]
    );

    res.json({ message: 'Password reset successful. Please login with your new password.' });

  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;