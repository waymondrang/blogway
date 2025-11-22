import { Amplify } from "aws-amplify";
import {
    fetchAuthSession,
    getCurrentUser,
    signIn,
    signOut,
} from "aws-amplify/auth";
import { OutgoingHttpHeaders } from "http";
import { LoginResult, User } from "types";

// see more here: https://docs.amplify.aws/react/build-a-backend/auth/use-existing-cognito-resources/
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
            userPoolClientId:
                process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
        },
    },
});

console.log(
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID
);

export class AuthHelper {
    static async getUser(): Promise<User | null> {
        try {
            // see more here: https://docs.amplify.aws/react/build-a-backend/auth/reference/#getCurrentUser-30525
            const { signInDetails, userId, username } = await getCurrentUser();

            return {
                userId,
                username,
                loginId: signInDetails.loginId,
            };
        } catch (error) {
            console.error("could not get user:", error);
            return null;
        }
    }

    static async login(
        username: string,
        password: string
    ): Promise<LoginResult> {
        try {
            const { isSignedIn, nextStep } = await signIn({
                username,
                password,
                options: { authFlowType: "USER_PASSWORD_AUTH" },
            });

            if (nextStep.signInStep !== "DONE") {
                // see more here: https://docs.amplify.aws/react/build-a-backend/auth/connect-your-frontend/sign-in/
                switch (nextStep.signInStep) {
                    // the user was created with a temporary password and must set a new one. complete the process with confirmsignin
                    case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
                        console.error(
                            "user needs to confirm sign in with new password"
                        );
                        return;
                    default:
                        console.warn(
                            "next sign in step not supported:",
                            nextStep.signInStep
                        );
                }
            }

            // issignedin determines success of login
            return {
                success: isSignedIn,
            };
        } catch (error) {
            console.error("error during login", error);

            // do not throw error, but return failed message
            return {
                success: false,
                error: error instanceof Error ? error.message : "unknown error",
            };
        }
    }

    static async logout(): Promise<void> {
        try {
            await signOut();
        } catch (error) {
            console.log("sign out failed:", error);
        }
    }

    static async getAccessToken(): Promise<string | null> {
        try {
            const authSession = await fetchAuthSession();
            return authSession.tokens.accessToken.toString();
        } catch (error) {
            console.log("could not get access token:", error);
            return null;
        }
    }

    static async fetch(url: string, init?: RequestInit) {
        const accessToken = await this.getAccessToken();

        if (!accessToken) {
            throw new Error("could not get access token");
        }

        const headers: HeadersInit = {
            authorization: `Bearer ${accessToken}`,
            ...init.headers,
        };

        return await fetch(url, { ...init, headers });
    }
}
