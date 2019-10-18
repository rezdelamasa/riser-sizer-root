// import stripePackage from "stripe";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  // const amount = 1500;
  // const description = "Riser Sizer Monthly Subscription - Basic";
  // Load our secret key from the  environment variables
  // const stripe = stripePackage(process.env.stripeSecretKey);

  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  // let customerObject = await stripe.customers.retrieve(
  //   event.customerId
  // );

  // let flag = false;

  // if(customerObject.subscriptions.data.length > 0) {
  //   flag = true;
  // }

  // let message = (flag) ? "Subscribed" : "Not subscribed";

  try {
    return success(event.body);
  } catch (e) {
    return failure({ message: e.message });
  }

}