import stripePackage from "stripe";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const { source } = JSON.parse(event.body);
  const amount = 1500;
  const description = "Riser Sizer Monthly Subscription";

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    await stripe.charges.create({
      source,
      amount,
      description,
      currency: "usd"
    });
    return success({ status: true });
  } catch (e) {
    return failure({ message: e.message });
  }
}
