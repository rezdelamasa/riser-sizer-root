import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  console.log(event);
  const data = JSON.parse(event.body);
  console.log(data);

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
    let customerObject = await stripe.customers.retrieve(
      data.content.customer.id
    );
    if(customerObject.subscriptions.data[0].items.data[0].plan.active) {
      params.UpdateExpression.ExpressionAttributeValues[":content"].data.content.subscription = true;
    } else {
      params.UpdateExpression.ExpressionAttributeValues[":content"].data.content.subscription = false;
    }
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
