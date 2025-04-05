import express from 'express';
import dotenv from 'dotenv';
import { shopifyApp } from '@shopify/shopify-app-express';
import billingConfig from './billing.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SCOPES.split(','),
    hostName: process.env.HOST,
    billing: billingConfig,
  },
  auth: {
    path: '/auth',
    callbackPath: '/auth/callback',
  },
});

app.use(express.json());
app.use(shopify.auth.middleware());      
app.use(shopify.webhooks.middleware());  
app.get('/', (req, res) => {
  res.send('✅ Shopify App is running!');
});

app.post('/callback', async (req, res) => {
  const { shop, charge_id } = req.query;

  const session = await shopify.api.sessionStorage.loadSession(req, res);
  const charge = await shopify.api.rest.RecurringApplicationCharge.find({
    session,
    id: charge_id,
  });

  if (charge.status === 'active') {
    console.log(`✅ Shop ${shop} has activated the subscription.`);
    // Add custom logic here
  }

  res.status(200).send('Subscription successful!');
});

app.listen(PORT, () => {
  console.log(`🚀 App running on http://localhost:${PORT}`);
});
