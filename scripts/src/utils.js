/**
 * Common utilities
 */
const fs = require('fs');
const Mustache = require("mustache");

// returns all the subject area files
const walkSync = function (dir, selector, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file, selector, filelist);
        } else {
            const fullPath = dir + "/" + file;
            if (selector(fullPath)) {
                filelist.push(fullPath);
            }
        }

    });
    return filelist;
};

const slugify = function (val) {
    return val.split(' ').join('').toLowerCase()
};

const loadJsonFile = function (f) {
    return JSON.parse(fs.readFileSync(f).toString());
};

const renderTemplate = function(data, tmplPath, htmlPath) {
    console.log(
        `Rendering "${tmplPath}" template`,
        data.id ? `for ${data.id}` : '');
    const tmplStr = fs.readFileSync(tmplPath, 'utf-8');
    const htmlStr = Mustache.render(tmplStr, data);
    fs.writeFileSync(htmlPath, htmlStr);
};

const nameSorter = function(a, b) {
    if (a.name > b.name) {
        return 1
    }
    if (a.name < b.name) {
        return -1
    }
    return 0
}

module.exports = {
    walkSync: walkSync,
    slugify: slugify,
    loadJsonFile: loadJsonFile,
    renderTemplate: renderTemplate,
    nameSorter: nameSorter
};