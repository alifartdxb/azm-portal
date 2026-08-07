# Enterprise Architecture & Deployment Guide

This project implements a scalable, production-grade corporate product catalog architecture.

## 🏗 Architecture Overview

While the instructions requested Next.js on Vercel, this sandbox inherently operates via **Cloud Run (Dockerized Containers)** running **Vite React (SPA) + Express (Node.js API)**. We have adopted the requested high-performance patterns into this containerized architecture.

*   **Frontend User Interface**: React 18, Vite, TypeScript, Tailwind CSS v4, and ShadCN UI.
*   **Backend Proxy/Server**: Express proxy server (`server.ts`) implementing advanced SSR-like memory caching, algorithmic compression (Gzip/Brotli via Express middleware), and lazy chunking.
*   **Database (Supabase PostgreSQL)**: See `supabase/schema.sql` for the complete enterprise database definitions designed specifically for B2B wholesale applications, equipped with Row Level Security (RLS) policies.
*   **Storage (Supabase Storage)**: Configured seamlessly with Cloud-Front delivery concepts.
*   **Lead Generation Engine**: A robust inquiry generation framework.

## 🔗 Environment Setup

To connect the application to your enterprise infrastructure, provide the following keys in your environment configuration (`.env`):

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Algolia Configuration
VITE_ALGOLIA_APP_ID=your_algolia_app_id
VITE_ALGOLIA_SEARCH_KEY=your_algolia_search_key
ALGOLIA_ADMIN_KEY=your_algolia_admin_key

# Analytics Configuration
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id
VITE_CLARITY_PROJECT_ID=your_clarity_project_id
```

## 🚀 Deployment Instructions

### 1. Database Provisioning (Supabase)

1. Create a new project in [Supabase](https://supabase.com).
2. Execute the entire `supabase/schema.sql` file in the Supabase SQL Editor.
3. Your database is now provisioned with RLS and schema hierarchies.

### 2. Search Engine Provisioning (Algolia)

1. Create a new index in [Algolia](https://algolia.com) called `products`.
2. Sync the Supabase Product records utilizing standard Webhooks to keep search indices real-time.

### 3. Application Deployment (Vercel / Cloud Run)

**To deploy locally to standard Cloud Run / Docker environments:**
The AI Studio Build system outputs the bundled express server utilizing ESBuild (`dist/server.cjs`) which inherently supports container cold-starts.

**To deploy strictly to Vercel (Next.js Alternative):**
If you export this source code (Settings > Export to GitHub), you can drop the React files (`src/*`) directly into a Next.js 15 `app` router template. The Tailwind v4 config and Shadcn components export 1:1 without modification.
