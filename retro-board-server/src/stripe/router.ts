import express, { Router } from 'express';
import { CreateSubscriptionPayload } from 'retro-board-common';
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

  router.post('/create-checkout-session', async (req, res) => {
    const payload = req.body as CreateSubscriptionPayload;
    console.log('Payload: ', payload);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // Replace `price_...` with the actual price ID for your subscription
          // you created in step 2 of this guide.
          price: payload.priceId,
          quantity: payload.quantity,
          // currency: 'GBP',
          // amount: 49.9,
          price_data: {
            product: 'prod_IDyLtfQN9lZddu',
            currency: 'GBP',
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
            // unit_amount: 49.9,
            unit_amount: 49,
          },
          // name: 'Pro sub',
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'https://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  });

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

  router.post('/create-subscription', async (req, res) => {
    const payload = req.body as CreateSubscriptionPayload;
    // Set the default payment method on the customer
    console.log('Payload', payload);

    //stripe.

    try {
      console.log('Attach payment method');
      const pm = await stripe.paymentMethods.attach(payload.paymentMethodId, {
        customer: payload.customerId,
      });
      console.log('Attach payment method success', pm);
    } catch (error) {
      console.log('Attach payment error', error);
      return res.status(402).send({ error: { message: error.message } });
    }

    console.log('Customer update');
    let updateCustomerDefaultPaymentMethod = await stripe.customers.update(
      payload.customerId,
      {
        invoice_settings: {
          default_payment_method: payload.paymentMethodId,
        },
      }
    );
    console.log('Customer update success', updateCustomerDefaultPaymentMethod);

    // Create the subscription
    console.log('Create sub');
    try {
      const subscription = await stripe.subscriptions.create({
        customer: payload.customerId,
        items: [{ price: payload.priceId, quantity: payload.quantity }],
        // expand: ['latest_invoice.payment_intent', 'plan.product'],
      });
      console.log('Create sub success', subscription);

      console.log('before json');
      const json = JSON.stringify(subscription);
      console.log('after json');

      res.status(200).send(json);
    } catch (e) {
      console.log('Caught error on sub', e);
      res.status(200).send(e);
    }
  });
  return router;
}

export default stripeRouter;
