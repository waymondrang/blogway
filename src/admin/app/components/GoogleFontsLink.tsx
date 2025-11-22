const BASE_URL = "https://fonts.googleapis.com/css2";

interface GoogleFontsLinkProps {
    font_family: string;
    icons?: string[];
}

export default function GoogleFontsLink({
    font_family,
    icons,
}: GoogleFontsLinkProps) {
    let queryString = `family=${font_family}`;

    if (icons) {
        queryString += `&icon_names=${icons.sort().join(",")}`;
    }

    const href = `${BASE_URL}?${queryString}`;

    return <link rel="stylesheet" href={href} />;
}
