# ─── Stage 1: Build the React/Vite frontend ──────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Copy dependency manifests first to leverage Docker layer caching
COPY frontend/package*.json ./

# Install all dependencies (including devDependencies needed for the build)
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build the production bundle — outputs to /app/frontend/dist
RUN npm run build

# ─── Stage 2: Run the Express application ─────────────────────────────────────
FROM node:20-alpine AS runtime

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Copy backend dependency manifests
COPY backend-health/package*.json ./backend-health/

# Install only production dependencies (skip devDependencies like nodemon)
RUN cd backend-health && npm ci --omit=dev

# Copy the entire backend-health source
COPY backend-health/ ./backend-health/

# Copy the Vite production build from Stage 1 into the expected location
# Express looks for: path.resolve(__dirname, '..', 'frontend', 'dist')
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose the application port
EXPOSE 5000

# Start the Express server
CMD ["node", "backend-health/server.js"]
