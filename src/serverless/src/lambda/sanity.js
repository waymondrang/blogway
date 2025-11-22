export async function handler(event) {
    console.log("lambda function invoked");

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello from Cloudfront, API Gateway, and Lambda!",
        }),
    };
}
