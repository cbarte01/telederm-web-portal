# Medena Care Payment Integration

This document describes the Stripe payment integration for consultation billing.

---

## Table of Contents

1. [Overview](#overview)
2. [Pricing Tiers](#pricing-tiers)
3. [Payment Flow](#payment-flow)
4. [Edge Functions](#edge-functions)
5. [Database Fields](#database-fields)
6. [Frontend Integration](#frontend-integration)
7. [Error Handling](#error-handling)
8. [Testing](#testing)

---

## Overview

Medena Care uses Stripe Checkout for one-time payments. Each consultation requires payment before submission to doctors.

### Key Components

| Component | Purpose |
|-----------|---------|
| Stripe Checkout | Hosted payment page |
| `create-checkout` | Creates Stripe session |
| `verify-payment` | Confirms payment completion |
| `generate-honorarnote` | Creates fee note PDF |

### Payment Mode

- **Mode**: One-time payment (`mode: "payment"`)
- **No subscriptions**: Each consultation is billed separately
- **No webhooks**: Uses redirect-based verification

---

## Pricing Tiers

### Consultation Types

| Tier | Default Price | Description |
|------|---------------|-------------|
| Standard | €49 | Regular consultation, 48h response |
| Urgent | €74 | Priority consultation, 24h response |
| Prescription | €29 | Medication renewal only |

### Pricing Hierarchy

```
1. Doctor-specific pricing (if set)
   └── profiles.standard_price / urgent_price / prescription_price
   
2. Global defaults (fallback)
   └── admin_settings.group_pricing
   
3. Hardcoded defaults (last resort)
   └── €49 / €74 / €29
```

### Fetching Pricing

```typescript
// Frontend fetches pricing
const { data } = await supabase.functions.invoke('get-current-pricing', {
  body: { doctorId: referralDoctorId || undefined }
});

// Returns: { standard: 49, urgent: 74, prescription: 29 }
```

---

## Payment Flow

### Sequence Diagram

```
Patient          Frontend         create-checkout       Stripe         verify-payment
   │                 │                  │                  │                  │
   │─── Select Plan ─▶                  │                  │                  │
   │                 │                  │                  │                  │
   │                 │── POST ──────────▶                  │                  │
   │                 │   consultationId │                  │                  │
   │                 │   pricingPlan    │                  │                  │
   │                 │                  │                  │                  │
   │                 │                  │── Create Session ▶                  │
   │                 │                  │                  │                  │
   │                 │◀─ Checkout URL ──│◀─ Session ───────│                  │
   │                 │                  │                  │                  │
   │◀── Redirect ────│                  │                  │                  │
   │                 │                  │                  │                  │
   │──────────────── Enter Payment Details ────────────────▶                  │
   │                 │                  │                  │                  │
   │◀───────────────── Redirect to Success URL ────────────│                  │
   │                 │                  │                  │                  │
   │                 │── POST (sessionId) ─────────────────────────────────────▶
   │                 │                  │                  │                  │
   │                 │                  │                  │◀─ Verify ────────│
   │                 │                  │                  │                  │
   │                 │◀───────────────── Success ──────────────────────────────│
   │                 │                  │                  │                  │
   │◀── Show Success │                  │                  │                  │
```

### Step-by-Step Flow

1. **Plan Selection** (Step 9 of consultation)
   - Patient selects Standard, Urgent, or Prescription
   - Pricing displayed based on referral doctor or global defaults

2. **Checkout Creation**
   - Frontend calls `create-checkout` edge function
   - Function creates Stripe Checkout session
   - Returns checkout URL

3. **Stripe Checkout**
   - Patient redirected to Stripe-hosted page
   - Enters payment details
   - Stripe processes payment

4. **Payment Verification**
   - Stripe redirects to `/payment-success?session_id=...`
   - Frontend calls `verify-payment` with session ID
   - Function verifies payment and updates consultation

5. **Submission Complete**
   - Consultation status → 'submitted'
   - Payment status → 'paid'
   - Consultation enters doctor queue

---

## Edge Functions

### create-checkout

Creates a Stripe Checkout session.

```typescript
// Request
POST /functions/v1/create-checkout
{
  "consultationId": "uuid",
  "pricingPlan": "standard" | "urgent" | "prescription"
}

// Response
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

#### Implementation Details

```typescript
// Determine price
let price: number;
if (referralDoctorId) {
  // Get doctor-specific pricing
  const { data: doctor } = await supabase
    .from('profiles')
    .select('standard_price, urgent_price, prescription_price')
    .eq('id', referralDoctorId)
    .single();
  
  price = doctor[`${pricingPlan}_price`];
} else {
  // Get global defaults
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('setting_value')
    .eq('setting_key', 'group_pricing')
    .single();
  
  price = settings.setting_value[pricingPlan];
}

// Create Stripe session
const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      currency: 'eur',
      unit_amount: price * 100, // Stripe uses cents
      product_data: {
        name: `Dermatological ${pricingPlan} Consultation`,
        description: 'Online dermatology consultation'
      }
    },
    quantity: 1
  }],
  mode: 'payment',
  success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/consultation`,
  customer_email: userEmail
});

// Update consultation with payment intent
await supabase
  .from('consultations')
  .update({
    stripe_payment_intent_id: session.payment_intent,
    consultation_price: price,
    pricing_plan: pricingPlan
  })
  .eq('id', consultationId);
```

### verify-payment

Verifies payment completion.

```typescript
// Request
POST /functions/v1/verify-payment
{
  "sessionId": "cs_..."
}

// Response
{
  "success": true,
  "consultationId": "uuid"
}
```

#### Implementation Details

```typescript
// Retrieve session from Stripe
const session = await stripe.checkout.sessions.retrieve(sessionId);

if (session.payment_status !== 'paid') {
  throw new Error('Payment not completed');
}

// Find consultation by payment intent
const { data: consultation } = await supabase
  .from('consultations')
  .select('id')
  .eq('stripe_payment_intent_id', session.payment_intent)
  .single();

// Update consultation status
await supabase
  .from('consultations')
  .update({
    status: 'submitted',
    payment_status: 'paid',
    submitted_at: new Date().toISOString()
  })
  .eq('id', consultation.id);
```

---

## Database Fields

### consultations table

| Field | Type | Description |
|-------|------|-------------|
| `pricing_plan` | text | 'standard', 'urgent', or 'prescription' |
| `consultation_price` | numeric | Amount charged (in EUR) |
| `payment_status` | text | 'pending', 'paid', 'failed', 'refunded' |
| `stripe_payment_intent_id` | text | Stripe PaymentIntent ID |
| `stripe_invoice_id` | text | Stripe Invoice ID (if applicable) |

### profiles table (doctors)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `standard_price` | numeric | 49.00 | Doctor's standard price |
| `urgent_price` | numeric | 74.00 | Doctor's urgent price |
| `prescription_price` | numeric | 29.00 | Doctor's prescription price |

### admin_settings table

```json
{
  "setting_key": "group_pricing",
  "setting_value": {
    "standard": 49,
    "urgent": 74,
    "prescription": 29
  }
}
```

---

## Frontend Integration

### Plan Selection Component

```typescript
const PlanSelection = () => {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const { referralDoctorId } = useReferralDoctor();

  useEffect(() => {
    const fetchPricing = async () => {
      const { data } = await supabase.functions.invoke('get-current-pricing', {
        body: { doctorId: referralDoctorId }
      });
      setPricing(data);
    };
    fetchPricing();
  }, [referralDoctorId]);

  const handleSelectPlan = async (plan: 'standard' | 'urgent' | 'prescription') => {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { consultationId, pricingPlan: plan }
    });
    
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div>
      <PlanCard 
        title="Standard"
        price={pricing?.standard}
        onClick={() => handleSelectPlan('standard')}
      />
      {/* ... other plans */}
    </div>
  );
};
```

### Payment Success Page

```typescript
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });
      
      if (error) {
        toast.error('Payment verification failed');
      } else {
        toast.success('Payment successful!');
        // Clear consultation draft
        sessionStorage.removeItem('consultation_draft');
      }
      
      setVerifying(false);
    };
    
    verifyPayment();
  }, [sessionId]);

  if (verifying) {
    return <LoadingSpinner message="Verifying payment..." />;
  }

  return <SuccessMessage />;
};
```

---

## Error Handling

### Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| Payment declined | Card issue | User should try different card |
| Session expired | Checkout took too long | Restart payment flow |
| Consultation not found | Invalid consultation ID | Check consultation exists |
| Already paid | Duplicate payment attempt | Redirect to dashboard |

### Error Handling Pattern

```typescript
try {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { consultationId, pricingPlan }
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data?.url) {
    throw new Error('No checkout URL received');
  }
  
  window.location.href = data.url;
} catch (error) {
  toast.error(`Payment error: ${error.message}`);
  console.error('Checkout error:', error);
}
```

---

## Testing

### Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |
| 4000 0000 0000 9995 | Insufficient funds |

### Test Mode

Stripe test mode is active when using test API keys (sk_test_...). No real charges are made.

### Verify Test Payment

1. Start a consultation
2. Select a pricing plan
3. Use test card 4242 4242 4242 4242
4. Any future date, any CVC
5. Verify redirect to success page
6. Check consultation status in database

---

## Honorarnote Generation

After payment, doctors can generate fee notes for patient insurance claims.

### Trigger

Generated when doctor completes a consultation (requires ICD-10 code).

### Content

- Doctor practice details
- Patient information
- Consultation date
- ICD-10 diagnosis code
- Amount charged
- Bank payment details

### Storage

- Bucket: `honorarnoten` (private)
- Path: `{year}/{honorarnote_number}.pdf`
- Access: Doctor and patient only

---

*Last updated: February 2026*
