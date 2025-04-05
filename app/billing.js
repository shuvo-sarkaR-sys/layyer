import { BillingInterval } from '@shopify/shopify-api';

const billingConfig = {
  required: true, // Prompt billing right after install
  plans: [
    {
      name: 'Basic Plan',
      amount: 15.0,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
      trialDays: 30,
    },
  ],
};

export default billingConfig;
