import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

import { document } from "../utils/dynamoDBClient";

interface ICreateTodo {
  id: string;
  userid: string;
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  const id = uuidv4();
  await document
    .put({
      TableName: "ignite-todos",
      Item: {
        id,
        userid,
        title,
        done: false,
        deadline: dayjs(deadline).toJSON(),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "todo created!",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
