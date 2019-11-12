/**
 * Generates a single JSON-LD document containing the full model information, vocabularies and schema.
 */
const utils = require("./utils");
const fs = require("fs");

const GLOBAL_TARGET_FILE = "../dist/model.jsonld";

// configuration and base context
const cfg = require("../cfg.js");

// load the context
const context = utils.loadJsonFile("../src/context.jsonld");

const cleanContext = function(data) {
    delete data["@context"];
    return data;
};

// add subject areas to the context
const subjectAreas = cfg.subjectAreas = utils.walkSync("../src/subjectAreas", function(path) {
    return path.endsWith("about.jsonld");
}).map((f) => {
    console.log(f);
    return cleanContext(utils.loadJsonFile(f));
});

// load all the entity groups (concepts)
const entityGroupsConcepts = utils.walkSync("../src/subjectAreas", function(path) {
    return path.endsWith("concepts.jsonld");
}).map((f) => {
    console.log(f);
    return cleanContext(utils.loadJsonFile(f));
});

// load all the entity groups (schemas)
const entityGroupsSchemas = utils.walkSync("../src/subjectAreas", function(path) {
    return path.endsWith("schema.jsonld");
}).map((f) => {
    console.log(f);
    return cleanContext(utils.loadJsonFile(f));
});

// load all the property groups (concepts)
const propertyGroupsConcepts = utils.walkSync("../src/propertyGroups", function(path) {
    return path.endsWith("concepts.jsonld");
}).map((f) => {
    console.log(f);
    return cleanContext(utils.loadJsonFile(f));
});

const foldSubjectAreas = function(concepts, schemas) {
    let acc = {};

    concepts.forEach((c) => {
        let id = c["@id"];
        acc[id] = c
    });

    schemas.forEach((s) => {
        let id = s["@id"];
        if (acc[id] == null) {
            acc[id] = s
        } else {
            for (let p in s) {
                if (s.hasOwnProperty(p)) {
                    acc[id][p] = s[p];
                }
            }
        }
    });

    subjectAreas.map(function(sa) {
        let egs = (sa["entityGroups"] || []).map(function(eg) {
            let id = eg['@id'];
            return acc[id] || eg
        })
        if (egs.length > 0) {
            sa["entityGroups"] = egs;
        } else {
            sa
        }
    });

    return subjectAreas;
};

const model = {
    "@context": context,
    subjectAreas: foldSubjectAreas(entityGroupsConcepts, entityGroupsSchemas),
    propertyGroups: propertyGroupsConcepts
};

fs.writeFileSync(GLOBAL_TARGET_FILE, JSON.stringify(model, null, 2));