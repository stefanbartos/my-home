import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { HtmlBasePlugin } from "@11ty/eleventy";


/** @param {import("@11ty/eleventy").Eleventy} eleventyConfig */
export default function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        // output image formats
        formats: ["avif", "webp", "jpeg"],

        // output image widths
        widths: ["auto"],

        // optional, attributes assigned on <img> nodes override these values
        htmlOptions: {
            imgAttributes: {
                loading: "lazy",
                decoding: "async",
            },
            pictureAttributes: {}
        },
    });
    eleventyConfig.addPlugin(HtmlBasePlugin);

    eleventyConfig.addShortcode("youtube", (videoURL, title) => {
        const url = new URL(videoURL);
        const id = url.searchParams.get("v");
        return `
<iframe class="yt-shortcode" src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video player${title ? ` for ${title}` : ""
            }" width="700px" frameborder="0" allowfullscreen style="height: 500px"></iframe>
`;
    });
}

export const config = {
    dir: {
        input: "src",
        output: "public",
    }
};