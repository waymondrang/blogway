"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import GoogleFontsLink from "components/GoogleFontsLink";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import "scss/index.scss";

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

const authenticatorComponents = {
    Header() {
        return (
            <header>
                <Image
                    width={48}
                    height={48}
                    src="/static/img/blog_logo_dither_48x48.png"
                    alt="8 Ball Logo"
                />
            </header>
        );
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>admin page</title>

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
                    rel="stylesheet"
                />

                {/* material symbols */}
                <GoogleFontsLink
                    font_family="Material+Symbols+Outlined"
                    icons={[
                        "clear_all",
                        "code",
                        "code_blocks",
                        "format_bold",
                        "format_clear",
                        "format_h1",
                        "format_h2",
                        "format_h3",
                        "format_h4",
                        "format_h5",
                        "format_h6",
                        "format_italic",
                        "format_list_bulleted",
                        "format_list_numbered",
                        "format_paragraph",
                        "format_quote",
                        "format_strikethrough",
                        "horizontal_rule",
                        "ink_pen",
                        "keyboard_return",
                        "logout",
                        "redo",
                        "undo",
                        "upload",
                        "close",
                        "home",
                    ]}
                />
            </head>

            <body>
                <React.StrictMode>
                    {/* wrap everything (including authenticator) */}
                    <div id="everything">
                        {/* see more here: https://ui.docs.amplify.aws/react/connected-components/authenticator */}
                        <Authenticator
                            hideSignUp={true}
                            components={authenticatorComponents}
                        >
                            {({ signOut }) => (
                                <>
                                    <header>
                                        <Image
                                            width={48}
                                            height={48}
                                            src="/static/img/blog_logo_dither_48x48.png"
                                            alt="8 Ball Logo"
                                        />

                                        <div className="actions">
                                            <Link
                                                href="/editor"
                                                className="button flexButton"
                                            >
                                                <span>Editor</span>
                                                <span className="material-symbols-outlined symbol">
                                                    ink_pen
                                                </span>
                                            </Link>

                                            <button
                                                onClick={signOut}
                                                className="squareButton"
                                            >
                                                <span className="material-symbols-outlined symbol">
                                                    logout
                                                </span>
                                            </button>
                                        </div>
                                    </header>

                                    <main>{children}</main>
                                </>
                            )}
                        </Authenticator>
                    </div>
                </React.StrictMode>
            </body>
        </html>
    );
}
