"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";

export default function Page() {
    const { user } = useAuthenticator();

    return (
        <>
            <h1>Admin Home</h1>
            {user && (
                <p>
                    Hello, <b>{user.username}</b> ({user.signInDetails?.loginId}
                    )
                </p>
            )}
        </>
    );
}
