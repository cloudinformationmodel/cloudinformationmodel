const id = function(id) {
    if (id.indexOf("schema.yaml") !== -1) {
	let name = id.replace("/schema.yaml", "").split("/").pop();
	return "http://cloudinformationmodel.org/model/" + name + "EntityGroup";
    } else {
	let parts = id.split("#");
	let path = parts.pop();
	let name = path.split("/").pop();
	return "http://cloudinformationmodel.org/model/" + name;
    }
};

const label = function(name) {
    let toTransform = name;
    if (toTransform.indexOf("EntityGroup") !== -1) {
	toTransform = toTransform.replace("EntityGroup", "");
    }
    return toTransform.replace(/([A-Z])/g, ' $1')
};

module.exports = {
    idMapping: id,
    labelMapping: label,
    downloadLinks: "format_links.json",
    dialectsHeader: "Entity Groups",
    schemasHeader: "Entities",
    indexHeader: "Cloud Information Model",
    indexVersion: "0.1",
    mainHeader: "Cloud Information Model 0.1",
    indexDescription: "Cloud Information Model"
};
