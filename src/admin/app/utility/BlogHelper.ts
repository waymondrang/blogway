import { AuthHelper } from "./AuthHelper";

export class BlogHelper {
    static async uploadBlog(
        content: string,
        guestWriter?: string,
        coWriters?: string
    ): Promise<Response | null> {
        try {
            const requestBody: {
                content: string;
                guestWriter?: string;
                coWriters?: string;
            } = {
                content: content,
            };

            // sanitize optional inputs
            if (guestWriter) {
                requestBody.guestWriter = guestWriter.trim();
            }

            if (coWriters) {
                requestBody.coWriters = coWriters
                    .split(",")
                    .map((writer) => writer.trim())
                    .filter((writer) => writer !== "")
                    .join(", ");
            }

            const options: RequestInit = {
                method: "POST",
                body: JSON.stringify(requestBody),
            };

            const response = await AuthHelper.fetch("/api/upload", options);

            console.log(response);

            return response;
        } catch (error) {
            console.error("blog could not be uploaded:", error);
            return null;
        }
    }
}
