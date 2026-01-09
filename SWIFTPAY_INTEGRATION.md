# SwiftPay Integration Guide for NaivasMpya

## 1. Overview
This guide details the integration of the SwiftPay payment system into the NaivasMpya web application for processing M-Pesa payments for job applications.

## 2. SwiftPay Credentials
- **API Key:** `sp_25c79c9c-5980-410e-b8e6-b223796c55a6`
- **Till ID:** `dbdedaea-11d8-4bbe-b94f-84bbe4206d3c`
- **Backend URL:** `https://swiftpay-backend-uvv9.onrender.com/api`

## 3. API Endpoints

### Initiate Payment
- **Endpoint:** `POST /api/initiate-payment`
- **Description:** Starts the STK push payment process.
- **Request Body:**
  ```json
  {
    "phoneNumber": "0712345678",
    "amount": 129,
    "description": "Job Application Processing Fee"
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "message": "Payment initiated successfully",
    "data": {
      "externalReference": "NAIVASMPYA-1702566000000",
      "checkoutRequestId": "NAIVASMPYA-1702566000000"
    }
  }
  ```

### Check Payment Status
- **Endpoint:** `GET /api/payment-status?reference=<reference>`
- **Description:** Polls for the status of a pending transaction.
- **Success Response:**
  ```json
  {
    "success": true,
    "payment": {
      "status": "SUCCESS", // PENDING, SUCCESS, or FAILED
      "amount": 129,
      "phoneNumber": "254712345678",
      "mpesaReceiptNumber": "RCI...",
      "provider": "swiftpay"
    }
  }
  ```

### Submit Application
- **Endpoint:** `POST /api/submit-application`
- **Description:** Submits the final application after successful payment.
- **Request Body:**
  ```json
  {
    "phone": "0712345678",
    "userId": "user123",
    "paymentReference": "NAIVASMPYA-1702566000000"
  }
  ```

## 4. Phone Number Normalization
The `initiate-payment` endpoint automatically handles phone number formatting. It accepts numbers in both `07...` and `254...` formats and converts them to the required `254...` format for the M-Pesa API.

## 5. Frontend Payment Flow
1.  The user fills out the application form.
2.  The user clicks the "Pay" button, triggering a call to `/api/initiate-payment`.
3.  The frontend receives a `checkoutRequestId` and begins polling the `/api/payment-status` endpoint every few seconds.
4.  The user receives an STK push prompt on their phone and enters their M-Pesa PIN.
5.  Once the polling endpoint returns a `SUCCESS` status, the frontend automatically calls `/api/submit-application` with the payment reference.
6.  The user is shown a success message.

## 6. Database Schema
The integration uses the existing `transactions` and `applications` tables in Supabase. A `payment_provider` column has been added to the `transactions` table to label payments made via SwiftPay.

## 7. Deployment
The updated API routes are deployed as serverless functions on Vercel. Any push to the designated GitHub repository will trigger an automatic redeployment.
