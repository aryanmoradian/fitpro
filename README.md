
# Fit Pro Subscription Module Deployment Guide

This guide covers the steps to deploy the backend services and database for the Fit Pro subscription system.

## Prerequisites
- Google Cloud Platform (GCP) Account
- Node.js 18+ installed
- PostgreSQL Database (Cloud SQL or local)

## 1. Database Setup
1.  Create a PostgreSQL database.
2.  Run the migration script located at `sql/migrations/001_init_subscriptions.sql`.
    ```bash
    psql -h YOUR_DB_HOST -U YOUR_DB_USER -d YOUR_DB_NAME -f sql/migrations/001_init_subscriptions.sql
    ```

## 2. Environment Variables
Create a `.env` file for local development or set these secrets in Google Cloud Functions:

```env
# Database
DB_CONNECTION_STRING=postgresql://user:password@host:5432/dbname

# Payment
PLATFORM_USDT_ADDRESS=TYkGprD7ADrGxLsG1BAGvY1H5XnsrQbhxG
TRONGRID_API_KEY=your_trongrid_api_key_here

# Services
SENDGRID_API_KEY=your_sendgrid_key_here
```

## 3. Cloud Function Deployment (VerifyTether)
Navigate to `cloud-functions/verifyTetherPayment` and deploy:

```bash
gcloud functions deploy verifyTetherPayment \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars DB_CONNECTION_STRING=...,PLATFORM_USDT_ADDRESS=...
```

## 4. Frontend Integration
1.  Ensure the `api/routes` are hooked up to your Next.js API handler or Express server.
2.  The frontend expects API endpoints at `/api/payments/...`.
3.  Update `services/pricingService.ts` if your backend URL differs from the relative path.

## 5. Scheduler (Cron Jobs)
To set up the daily exchange rate fetcher:
1.  Create a Cloud Scheduler job.
2.  Target: HTTP (Your `getUSDTToIRR` cloud function).
3.  Frequency: `0 8 * * *` (Every day at 8 AM).

## 6. Admin Panel
Access the admin panel at `/admin` (ensure route protection logic is enabled in your middleware).
