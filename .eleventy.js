import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
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

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}