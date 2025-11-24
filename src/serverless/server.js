import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import { mockBlogs } from "./mock-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use("/static", express.static(path.join(__dirname, "static")));

// template path (same as lambda function)
const templatePath = path.join(
    __dirname,
    "src",
    "lambda",
    "templates",
    "home.ejs"
);

app.get("/", async (req, res) => {
    try {
        // sort by upload date (like in lambda)
        const blogs = mockBlogs.sort(
            (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
        );

        const html = await ejs.renderFile(templatePath, {
            blogs,
        });

        res.set("Content-Type", "text/html; charset=utf-8");
        res.send(html);
    } catch (error) {
        console.error("error rendering page:", error);
        res.status(500).send("unable to fetch blog posts");
    }
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
