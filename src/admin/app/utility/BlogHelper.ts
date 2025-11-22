import { AuthHelper } from "./AuthHelper";

export class BlogHelper {
    // TODO: include other fields such as title (maybe optional?)
    static async uploadBlog(content: string): Promise<Response | null> {
        try {
            const requestBody = {
                content: content,
            };

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
