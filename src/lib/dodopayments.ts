import DodoPayments from 'dodopayments';

if (!process.env.DODO_PAYMENTS_API_KEY) {
  throw new Error('DODO_PAYMENTS_API_KEY is not defined in environment variables');
}

export const dodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  // Using test_mode as per user's test API key
  environment: 'test_mode', 
});
