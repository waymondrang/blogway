/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import ejs from "ejs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// use table name set by sam (see template.yml)
const TABLE_NAME = process.env.TABLE_NAME;

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

// get the current file path and template directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatePath = join(__dirname, "templates", "home.ejs");

export const handler = async (event, context) => {
    try {
        // fetch all blog posts
        const scanCommmand = new ScanCommand({
            TableName: TABLE_NAME,
        });

        const result = await dynamo.send(scanCommmand);

        // sort by upload date (newest first)
        const blogs = result.Items.sort(
            (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
        );

        // render ejs template
        const html = await ejs.renderFile(templatePath, {
            blogs,
        });

        const response = {
            statusCode: 200,
            body: html,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
            },
        };

        return response;
    } catch (error) {
        console.error("error fetching blogs", error);

        const response = {
            statusCode: 500,
            body: "Unable to fetch blog posts",
            headers: {
                "Content-Type": "text/html; charset=utf-8",
            },
        };

        return response;
    }
};
