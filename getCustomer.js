// import stripePackage from "stripe";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  // const { source } = JSON.parse(event.body);
  // const { data } = JSON.parse(event.body);
  // const amount = 1500;
  // const description = "Riser Sizer Monthly Subscription - Basic";
  // Load our secret key from the  environment variables
  // const stripe = stripePackage(process.env.stripeSecretKey);

  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys

  // const stripe = require('stripe')('sk_test_KFZXlDCk4Yazdjn7fjkAJHaA00QlhtfFlX');

  try {
    // let customerObject = await stripe.customers.retrieve(
    //   event.customerId
    // );

    // let flag = false;

    // if(customerObject.subscriptions.data.length > 0) {
    //   flag = true;
    // }

    // let message = (flag) ? "Subscribed" : "Not subscribed";

    return success( event );
  } catch (e) {
    return failure({ message: e.message });
  }

}