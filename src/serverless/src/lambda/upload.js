/**
 * lambda function to handle blog post uploads and generating static pages
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dynamoClient);

// environment variables
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event, context) => {
    try {
        const body = JSON.parse(event.body);
        const { content, uploadDate } = body;

        // validate required fields
        if (!content) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Missing required fields: content",
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            };
        }

        // generate a unique blog ID
        const generatedId = crypto.randomUUID();
        const currentDate = uploadDate || new Date().toISOString();

        // upload blog object
        const blogPost = {
            id: generatedId,
            content,
            uploadDate: currentDate,
        };

        // save blog into table
        const putCommand = new PutCommand({
            TableName: TABLE_NAME,
            Item: blogPost,
            // see more here: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html
            ConditionExpression: "attribute_not_exists(id)",
        });

        await dynamo.send(putCommand);

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Successfully uploaded the post",
                id: generatedId,
            }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        };
    } catch (error) {
        console.error("error creating blog post:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Something went wrong on the server",
            }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        };
    }
};

/**
 * generate blog id from title
 * @param {string} title
 * @returns {string}
 */
function generateId(title) {
    const res = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // remove special characters
        .replace(/\s+/g, "-") // replace groups of spaces with dash
        .replace(/^-+|-+$/g, ""); // remove groups of leading/trailing dashes

    return `${res}`;
}
