
# Fit Pro Subscription Module Specification

## Overview
This module enables `Free`, `Elite`, and `ElitePlus` subscription tiers using USDT (TRC20) payments on the Tron network.

## Feature Access Matrix

| Feature | Free | Elite | Elite Plus |
| :--- | :---: | :---: | :---: |
| Workout Logging | ✅ | ✅ | ✅ |
| AI Coach Chat | Limited | Unlimited | Unlimited |
| **AI Meal Scanner** | ❌ | ✅ | ✅ |
| **Recovery Analysis** | ❌ | ✅ | ✅ |
| **Theme Customization**| ❌ | Gold | Neon + Gold |
| **Human Coach Review** | ❌ | ❌ | ✅ |

## Database Schema
- `subscriptions`: Tracks user plan status and expiry.
- `payments`: Records payment attempts (TxID or Manual Receipt).
- `tx_verifications`: Logs raw responses from TronGrid for audit.

## API Endpoints
- `POST /api/payments/submit-tx`: Validates TxID against platform wallet.
- `GET /api/rate/usdt-irr`: Returns current exchange rate (Cached).

## Admin Workflow
1. Users submit TxID (Auto-verify) or Upload Receipt (Manual).
2. Auto-verified txs activate subscription immediately.
3. Manual receipts appear in `pending_payments` table.
4. Admin approves/rejects via Admin Panel.

## Environment Variables
```
PLATFORM_USDT_ADDRESS=TYkGprD7ADrGxLsG1BAGvY1H5XnsrQbhxG
TRONGRID_API_KEY=...
DB_CONNECTION_STRING=postgres://...
SENDGRID_API_KEY=...
```

## Deployment
1. Run SQL migrations.
2. Deploy Cloud Function `verifyTetherPayment`.
3. Set up Cloud Scheduler for daily exchange rate fetch.
