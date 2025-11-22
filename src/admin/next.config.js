// see more here: https://nextjs.org/docs/pages/guides/static-exports (modified)

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: "export",

    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
    trailingSlash: true,

    // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
    // skipTrailingSlashRedirect: true,

    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',

    // see more here: https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
    basePath: "/admin",

    images: {
        unoptimized: true,
    },
};

export default nextConfig;
