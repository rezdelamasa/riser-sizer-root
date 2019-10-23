// import stripePackage from "stripe";
// import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  // const { source } = JSON.parse(event.body);
  const { data } = JSON.parse(event.body);
  // const amount = 1500;
  // const description = "Riser Sizer Monthly Subscription - Basic";
  // Load our secret key from the  environment variables
  // const stripe = stripePackage(process.env.stripeSecretKey);

  const Taxjar = require('taxjar');

  const client = new Taxjar({
    apiKey: '988c002a729d9b91c9cbaceeb5b094b5'
  });

  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys

  // const stripe = require('stripe')('sk_test_KFZXlDCk4Yazdjn7fjkAJHaA00QlhtfFlX');

  // const params = {
  //   TableName: process.env.tableName,
  //   // 'Key' defines the partition key and sort key of the item to be updated
  //   // - 'userId': Identity Pool identity id of the authenticated user
  //   // - 'noteId': path parameter
  //   Key: {
  //     userId: event.requestContext.identity.cognitoIdentityId,
  //   },
  //   // 'UpdateExpression' defines the attributes to be updated
  //   // 'ExpressionAttributeValues' defines the value in the update expression
  //   UpdateExpression: "SET content = :content",
  //   ExpressionAttributeValues: {
  //     ":content": data.content || null
  //   },
  //   // 'ReturnValues' specifies if and how to return the item's attributes,
  //   // where ALL_NEW returns all attributes of the item after the update; you
  //   // can inspect 'result' below to see how it works with different settings
  //   ReturnValues: "ALL_NEW"
  // };

  try {
    let tax = client.taxForOrder({
      from_country: 'US',
      from_zip: '65806',
      from_state: 'MO',
      from_city: 'Springfield',
      from_street: '521 N Jefferson Avenue',
      to_country: "US",
      to_zip: data.content.user.billingAddress.zip,
      to_state: data.content.user.billingAddress.state,
      to_city: data.content.user.billingAddress.city,
      to_street: data.content.user.billingAddress.address,
      amount: 40,
      shipping: 0,
      nexus_addresses: [
        {
          id: 'Main Location',
          country: 'US',
          zip: '65806',
          state: 'MO',
          city: 'Springfield',
          street: '521 N Jefferson Avenue'
        }
      ],
      line_items: [
        {
          id: '1',
          quantity: 1,
          product_tax_code: '30070',
          unit_price: 40,
          discount: 0
        }
      ]
    }).then(res => {
      // res.tax; // Tax object
      return success(res.tax);
      return success('hello');
      // res.tax.amount_to_collect; // Amount to collect
    });
    // await stripe.charges.create({
    //   source,
    //   amount,
    //   description,
    //   currency: "usd"
    // });
    // const customer = await stripe.customers.create({
    //   email: data.content.user.email,
    //   source
    // });
    // await stripe.subscriptions.create({
    //   customer: customer.id,
    //   items: [{plan: 'plan_FuOakFPk6mzHzx'}],
    // });
    // params["ExpressionAttributeValues"][":content"].user.customerId = customer.id;
    // await dynamoDbLib.call("update", params);
    // return success(tax);
  } catch (e) {
    return failure({ message: e.message });
  }

}