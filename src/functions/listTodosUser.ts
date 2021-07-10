import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamoDBClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await document
    .scan({
      TableName: "ignite-todos",
      FilterExpression: "userid = :userid",
      ExpressionAttributeValues: {
        ":userid": userid,
      },
    })
    .promise();

  const userTodos = response.Items;

  if (userTodos) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        todos: userTodos,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "usuário inválido",
    }),
  };
};
