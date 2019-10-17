import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
    }
  };

  // var stripe = require('stripe')('sk_test_KFZXlDCk4Yazdjn7fjdkAJHaA00QlhtfFlX');

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      // Return the retrieved item

      // let customerObject = await stripe.customers.retrieve(
      //   result.Item.content.user.customerId
      // );

      // if(customerObject.subscriptions.data[0].items.data[0].active) {
      //   result.Item.content.user.active = true;
      // }  else {
      //   result.Item.content.user.active = false;
      // }

      // result.Item.test = customerObject.subscriptions;

      return success(result.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    return failure({ status: false });
  }
}
