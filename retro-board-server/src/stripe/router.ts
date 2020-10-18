import express, { Router } from 'express';
import config from '../db/config';
import bodyParser from 'body-parser';
import { Store } from '../types';
import Stripe from 'stripe';
import { getUser } from '../utils';

const stripe = new Stripe(config.STRIPE_SECRET, {} as Stripe.StripeConfig);

console.log('Stripe secret: ', config.STRIPE_SECRET);

function stripeRouter(store: Store): Router {
  const router = express.Router();

  router.post(
    '/stripe-webhook',
    bodyParser.raw({ type: 'application/json' }),
    async (req, res) => {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          req.headers['stripe-signature']!,
          process.env.STRIPE_WEBHOOK_SECRET! // TODO
        );
      } catch (err) {
        console.log(err);
        console.log(`⚠️  Webhook signature verification failed.`);
        console.log(
          `⚠️  Check the env file and enter the correct webhook secret.`
        );
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      const dataObject = event.data.object;

      // Handle the event
      // Review important events for Billing webhooks
      // https://stripe.com/docs/billing/webhooks
      // Remove comment to see the various objects sent for this sample
      switch (event.type) {
        case 'invoice.paid':
          // Used to provision services after the trial has ended.
          // The status of the invoice will show up as paid. Store the status in your
          // database to reference when a user accesses your service to avoid hitting rate limits.
          break;
        case 'invoice.payment_failed':
          // If the payment fails or the customer does not have a valid payment method,
          //  an invoice.payment_failed event is sent, the subscription becomes past_due.
          // Use this webhook to notify your user that their payment has
          // failed and to retrieve new card details.
          break;
        case 'customer.subscription.deleted':
          if (event.request != null) {
            // handle a subscription cancelled by your request
            // from above.
          } else {
            // handle subscription cancelled automatically based
            // upon your subscription settings.
          }
          break;
        default:
        // Unexpected event type
      }
      res.sendStatus(200);
    }
  );

  router.post('/create-customer', async (req, res) => {
    if (!req.user) {
      res.status(403).send();
      return;
    }
    const user = await getUser(store, req);

    if (
      user &&
      !user.stripeId &&
      user.accountType !== 'anonymous' &&
      user.username
    ) {
      // Create a new customer object
      const customer = await stripe.customers.create({
        email: user.username,
        name: user.name,
      });

      const updatedUser = await store.updateUser(user.id, {
        stripeId: customer.id,
      });

      // save the customer.id as stripeCustomerId
      // in your database.
      if (updatedUser) {
        res.send(updatedUser?.toFullUser());
        return;
      }
    }
    res.status(500).send();
  });
  return router;
}

export default stripeRouter;
