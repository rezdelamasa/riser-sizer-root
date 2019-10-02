// import stripePackage from "stripe";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const { source } = JSON.parse(event.body);
  const { data } = JSON.parse(event.body);
  // const amount = 1500;
  // const description = "Riser Sizer Monthly Subscription - Basic";
  // Load our secret key from the  environment variables
  // const stripe = stripePackage(process.env.stripeSecretKey);

  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys

  const stripe = require('stripe')('sk_test_KFZXlDCk4Yazdjn7fjkAJHaA00QlhtfFlX');

  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content",
    ExpressionAttributeValues: {
      ":content": data.content || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    // await stripe.charges.create({
    //   source,
    //   amount,
    //   description,
    //   currency: "usd"
    // });
    const customer = await stripe.customers.create({
      email: data.content.user.email,
      source
    });
    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{plan: 'plan_FuOakFPk6mzHzx'}],
    });
    params["ExpressionAttributeValues"][":content"].user.customerId = customer.id;
    return success({ message: params["ExpressionAttributeValues"][":content"].user });
  } catch (e) {
    return failure({ message: e.message });
  }

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ message: e.message });
  }
}