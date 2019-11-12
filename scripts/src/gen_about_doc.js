/**
 * Generates the HTML document for the About page.
 */
const utils = require("./utils");
const fs = require("fs");

const globalLinks = function() {
    return { globalLinks: JSON.parse(fs.readFileSync("./global_format_links.json").toString()) };
};

// render the about template

utils.renderTemplate(globalLinks(), "./templates/about.mustache", "../html/about.html");
utils.renderTemplate(globalLinks(), "./templates/documentation.mustache", "../html/documentation.html");