import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

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
    eleventyConfig.addPassthroughCopy("src/images");
    // eleventyConfig.setInputDir('src')
    // eleventyConfig.outputDir('public')

    return {
        dir: {
            input: "src",
            output: "public",
        }
    }
}