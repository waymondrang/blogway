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

        const content = body.content;
        const customUploadDate = body.uploadDate; // override auto-generated date

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

        // validate and sanitize optional fields
        let guestWriter = null;
        let coWriters = null;

        if (body.guestWriter) {
            const sanitizedGuestWriter = body.guestWriter.trim();

            if (sanitizedGuestWriter.length > 0) {
                guestWriter = sanitizedGuestWriter;
            }
        }

        if (body.coWriters) {
            const coWritersArray = body.coWriters
                .split(",")
                .map((writer) => writer.trim())
                .filter((writer) => writer != "");

            if (coWritersArray.length > 0) {
                // convert to dynamodb string set
                coWriters = new Set(coWritersArray);
            }
        }

        // generate a unique blog ID
        const generatedId = crypto.randomUUID();
        const uploadDate = customUploadDate || new Date().toISOString();

        // create blog object with required fields
        const blogPost = {
            id: generatedId,
            content,
            uploadDate: uploadDate,
        };

        // add optional fields if they exist
        if (guestWriter) {
            blogPost.guestWriter = guestWriter;
        }

        if (coWriters) {
            blogPost.coWriters = coWriters;
        }

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
