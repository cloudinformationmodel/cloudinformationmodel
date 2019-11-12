/**
 * This script generates the JSON file with the mappings for the different entity groups (dialects)
 * and the links to the downloadable documents for each entity group in different formats
 */

const utils = require("./utils");
const fs = require("fs");

// Target file
const GLOBAL_TARGET_FILE = "global_format_links.json";
const TARGET_FILE = "format_links.json";

const GLOBAL_FORMATS = {
    "JSON-LD (vocabulary & schema)": "model.jsonld",
    "AML (vocabulary)": "concepts.yaml",
    "AML (dialect)": "schema.yaml",
    "SQL DDL": "schema.sql",
    "R2RML": "schema.r2rml",
    "RAML Types": "schema.raml",
    "JSON Schema": "scham.json"
};

// List of supported formats
const FORMATS = {
    "JSON-LD (vocabulary)": "concepts.jsonld",
    "JSON-LD (schema)": "schema.jsonld",
    "AML (vocabulary)": "concepts.yaml",
    "AML (dialect)": "schema.yaml",
    "SQL DDL": "database.sql",
    "R2RML": "database.r2rml",
    "RAML Types": "schema.raml",
    "JSON Schema": "schema.json"
};

// Parses the concepts.jsonld and extracts the ID of the entity group
const findEntityGroupId = function(path) {
    const jsonld = utils.loadJsonFile(path);
    const id = jsonld["@id"];
    if (id == null) {
        throw new Error("Cannot find entity group @id in file " + path);
    }
    return "http://cloudinformationmodel.org/model/" + id;
};

const globalFiles = function() {
    const dir = "../dist";
    let files = fs.readdirSync(dir);
    let filelist = [];
    files.forEach(function (file) {
        if (!fs.statSync(dir + '/' + file).isDirectory()) {
            let foundFormat;
            for (let format in GLOBAL_FORMATS) {
                if (GLOBAL_FORMATS.hasOwnProperty(format) && file === GLOBAL_FORMATS[format]) {
                    const fullPath = dir + "/" + file;
                    filelist.push({
                        text: format,
                        href: fullPath,
                        position: "global"
                    });
                }
            }
        }
    });
    return filelist;
};

const filesPerEntityGroup = function() {
    const selector = function(path) {
        return path.endsWith("concepts.jsonld");
    };
    const entityGroupFiles = utils.walkSync("../src", selector);
    let mappings = {};
    entityGroupFiles.forEach(function(f) {
        const id = findEntityGroupId(f);
        const prefix = f.replace("concepts.jsonld", "");
        let acc = [];
        for (const format in FORMATS) {
            if (FORMATS.hasOwnProperty(format)) {
                const formatFile = FORMATS[format];
                let anchor = {
                    text: format,
                    href: prefix + formatFile
                };
                if (format === "JSON-LD (vocabulary)" || format === "JSON-LD (schema)") {
                    anchor["position"] = "primary";
                } else {
                    anchor["position"] = "secondary";
                }
                acc.push(anchor);
            }
        }
        mappings[id] = acc;
    });
    return mappings;
};

const generateMapping = function() {
    const mapped = filesPerEntityGroup();
    fs.writeFileSync(TARGET_FILE, JSON.stringify(mapped, null, 2));
    const global = globalFiles()
    fs.writeFileSync(GLOBAL_TARGET_FILE, JSON.stringify(global, null, 2));
};


generateMapping();