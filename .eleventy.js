module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      if (data.page.inputPath.endsWith(".html")) {
        return `${data.page.filePathStem}.html`;
      }
      return undefined;
    },
  });

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("llms.txt");
  eleventyConfig.addPassthroughCopy("monospace");
  eleventyConfig.addPassthroughCopy("terminal");
  eleventyConfig.addPassthroughCopy("cyberpunk");
  eleventyConfig.addPassthroughCopy("mix");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
  };
};
