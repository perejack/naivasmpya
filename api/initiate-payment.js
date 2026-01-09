import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

// SwiftPay Configuration
const SWIFTPAY_API_KEY = process.env.SWIFTPAY_API_KEY;
const SWIFTPAY_TILL_ID = process.env.SWIFTPAY_TILL_ID;
const SWIFTPAY_BACKEND_URL = process.env.SWIFTPAY_BACKEND_URL || 'https://swiftpay-backend-uvv9.onrender.com';
const MPESA_PROXY_URL = process.env.MPESA_PROXY_URL || 'https://swiftpay-backend-uvv9.onrender.com/api/mpesa-verification-proxy';
const MPESA_PROXY_API_KEY = process.env.MPESA_PROXY_API_KEY || '';

// Normalize phone number to 254 format
function normalizePhoneNumber(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  if (cleaned.length !== 12 || !/^\d+$/.test(cleaned)) {
    return null; // Basic validation for Kenyan numbers
  }
  return cleaned;
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let { phoneNumber, amount = 129, description = 'Job Application Processing Fee' } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format. Use 07XXXXXXXX or 254XXXXXXXXX' });
    }

    const externalReference = `NAIVASMPYA-${Date.now()}`;

    const swiftpayPayload = {
      phone_number: normalizedPhone,
      amount: amount,
      till_id: SWIFTPAY_TILL_ID,
      reference: externalReference,
      description: description
    };

    const response = await fetch(`${SWIFTPAY_BACKEND_URL}/api/mpesa/stk-push-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SWIFTPAY_API_KEY}`,
      },
      body: JSON.stringify(swiftpayPayload),
    });

    const responseText = await response.text();
    console.log('SwiftPay response status:', response.status);
    console.log('SwiftPay response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse SwiftPay response:', responseText);
      return res.status(502).json({
        success: false,
        message: 'Invalid response from payment service'
      });
    }

    if (response.ok && (responseData.success === true || responseData.status === 'success')) {
      const checkoutId = responseData.data?.checkout_id || responseData.data?.request_id || responseData.CheckoutRequestID || externalReference;
      
      const { error: dbError } = await supabase
        .from('transactions')
        .insert({
          transaction_request_id: checkoutId,
          amount: parseFloat(amount)
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Continue even if DB fails, as payment was initiated
      }

      return res.status(200).json({
        success: true,
        message: 'Payment initiated successfully',
        data: {
          requestId: checkoutId,
          checkoutRequestId: checkoutId,
          transactionRequestId: checkoutId
        }
      });
    } else {
      console.error('SwiftPay error:', responseData);
      return res.status(response.status || 400).json({
        success: false,
        message: responseData.message || 'Payment initiation failed',
        error: responseData
      });
    }
  } catch (error) {
    console.error('Global error in initiate-payment:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred',
      error: error.message || String(error)
    });
  }
};
