/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (_) {
    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}