/**
 * Generates the HTML document for the different subject areas using the template at `templates/html/subject_areas.mustache`.
 * It goes through the different subject areas JSON-LD documents, process them and generates the HTML document with
 * the right links.
 * We need to do this in a different step because aml2html does not support the notion of a subject area grouping
 * multiple dialects (entity groups).
 * Generates the HTML document for each subject area including the list of entity groups and the listing
 * of the entities per entity group.
 */
const utils = require("./utils");

// Parses subject area JSON-LD and adds slugs;
const parseSubjectArea = function (data) {
    data.slug = utils.slugify(data.name)
    data.camelCased = data.name.replace(" ", "")
    data.entityGroups = data.entityGroups.map(function (eg) {
        eg.slug = eg["@id"].split("/").pop();
        eg.id = eg["@id"]
        return eg;
    });
    return data;
};

// let's list the entity groups
let entityGroupsAcc = {};

utils.walkSync("../src/subjectAreas", function(path) {
    return path.endsWith("concepts.jsonld");
}).forEach((f) => {
    console.log(f);
    let data = utils.loadJsonFile(f);
    let egName = data["name"];
    let sa = {
        link: utils.slugify(egName) + 'entitygroup',
        id: data["@id"],
        name: egName,
        subjectArea: data["subjectArea"],
        description: data["description"],
        entities: (data["classConcepts"]|| []).map(function(entity) {
            return {
                link: "schema_" + utils.slugify(egName) + "entitygroup_"+ utils.slugify(entity["name"]),
                name: entity["name"],
                description: entity["description"]
            }
        })
    };

    entityGroupsAcc[sa.id] = sa;
});

// configuration and base context
const cfg = require("../cfg.js");

// add subject areas to the context
cfg.subjectAreas = utils.walkSync("../src/subjectAreas", function(path) {
    return path.endsWith("about.jsonld");
}).map((f) => {
    console.log(f);
    let data = utils.loadJsonFile(f);
    let subjectArea = parseSubjectArea(data);
    subjectArea.entityGroups = subjectArea.entityGroups.map(eg => {
        return entityGroupsAcc[eg["@id"]]
    }).sort(utils.nameSorter);
    let acc = [];
    subjectArea.entityGroups.forEach(eg => {
        eg.entities.forEach(e => acc.push(e));
    });
    subjectArea.entities = acc.sort(utils.nameSorter);
    return subjectArea;
});
cfg.subjectAreas = cfg.subjectAreas.sort(utils.nameSorter);

// render all the subject areas
utils.renderTemplate(cfg, "./templates/html/subject_areas.mustache", "../html/subject_areas.html");

// render the individual subject areas
cfg.subjectAreas.forEach((sa) => {
    utils.renderTemplate(sa, "./templates/html/individual_subject_areas.mustache", "../html/" + sa.slug + ".html");
});