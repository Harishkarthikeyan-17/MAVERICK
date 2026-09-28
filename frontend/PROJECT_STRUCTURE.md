# Project Structure: MAVERICK AI

This document outlines the reorganized structure of the MAVERICK AI React project. The project follows a modular, feature-based architecture to improve maintainability and scalability.

## Directory Overview

```text
frontend/
├── src/
│   ├── core/               # Core application logic and types
│   │   ├── types.ts        # Centralized TypeScript definitions
│   │   └── services/       # Global services (e.g., API clients)
│   ├── features/           # Feature-specific modules
│   │   ├── auth/           # Authentication (Login, Forgot Password)
│   │   ├── dashboard/      # Main Dashboard
│   │   ├── health/         # Health & Vitals Monitoring
│   │   ├── finance/        # Financial Tracking
│   │   ├── planner/        # Daily & Recurring Task Planner
│   │   ├── food/           # Meal Planning & Nutrition
│   │   ├── travel/         # Travel Planning
│   │   ├── learning/       # Skill Tracking & Analytics
│   │   ├── collaborative/  # Team & Space Collaboration
│   │   └── landing/        # Futuristic Landing Page
│   ├── shared/             # Reusable UI components and hooks
│   │   ├── components/     # Shared widgets (Sidebar, MatrixBackground, etc.)
│   │   └── hooks/          # Shared React hooks
│   ├── assets/             # Static assets (images, fonts)
│   ├── App.tsx             # Main routing and layout
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind directives
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Feature Structure

Each feature folder is self-contained and follows this internal structure:

```text
features/[feature-name]/
├── components/             # Components specific to this feature
├── hooks/                  # Feature-specific React hooks
├── services/               # Feature-specific API or logic services
└── [FeatureName]Page.tsx   # Main entry point for the feature view
```

## Design Principles

1.  **Feature Isolation**: Features should only depend on `core/` and `shared/` modules. Cross-feature dependencies are minimized.
2.  **Centralized Types**: All domain-specific types are managed in `src/core/types.ts` to ensure consistency.
3.  **Shared UI**: Widgets used across multiple features (e.g., `HydrationTracker`, `NotificationCenter`) are located in `src/shared/components/`.
4.  **Clean Entry Points**: `index.html` points to `src/main.tsx`, which serves as the lean entry point for the application.
