
# Fit Pro API Documentation

This document provides examples for interacting with the Fit Pro Payment and Subscription API.

## Base URL
Assuming the backend is deployed at `https://your-cloud-function-url.com` or `http://localhost:3000`.

## 1. Verify Tether Transaction
Check if a USDT (TRC20) transaction is valid.

**Endpoint:** `POST /verifyTetherPayment`

**Request Body:**
```json
{
  "txid": "8f343a...", 
  "expected_amount_usdt": 15.00
}
```

**cURL Example:**
```bash
curl -X POST https://your-api-url.com/verifyTetherPayment \
  -H "Content-Type: application/json" \
  -d '{"txid": "8f343abc...", "expected_amount_usdt": 15}'
```

**Response (Success):**
```json
{
  "verified": true,
  "details": {
    "amount": 15000000 // In sun (micro-USDT)
  }
}
```

---

## 2. Submit Payment (Frontend Trigger)
Records a payment attempt in the database.

**Endpoint:** `POST /api/payments/submit-tx`

**Request Body:**
```json
{
  "userId": "user_123",
  "plan": "Elite",
  "duration": 3,
  "txid": "8f343a...",
  "amountUsd": 9.00
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/payments/submit-tx \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "plan": "Elite",
    "duration": 3,
    "txid": "8f343a...",
    "amountUsd": 9.00
  }'
```

---

## 3. Submit Manual Receipt
For users uploading a bank receipt.

**Endpoint:** `POST /api/payments/manual-receipt`

**Request Body:**
```json
{
  "userId": "user_123",
  "plan": "ElitePlus",
  "duration": 6,
  "receiptUrl": "https://storage.googleapis.com/...",
  "amountUsd": 24.00
}
```

---

## 4. Get Current Exchange Rate
Fetches the cached USDT to IRR rate.

**Endpoint:** `GET /api/rate/usdt-irr`

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/rate/usdt-irr
```

**Response:**
```json
{
  "rate": 61500,
  "updated_at": "2024-05-20T10:00:00Z"
}
```
