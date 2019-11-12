var fs = require('fs');

/// Subclasses missing:

// PriceAdjustmentGroup
// Attribute
// Tax

const unlinked = [
    "AccountBalanceUnitofMeasure",
    "Address",
    "Attribute",
    "BillingTreatment",
    "Business",
    "City",
    "ContentDocumentVersion",
    "Contract",
    "Country",
    "CountryRegion",
    "CreditMemo",
    "Currency",
    "Device",
    "DeviceEndPoint",
    "FulfillmentOrder",
    "FulfillmentOrderProduct",
    "FulfillmentType",
    "Image",
    "ImageGroup",
    "Industry",
    "Invoice",
    "Language",
    "LegalEntity",
    "Locale",
    "Location",
    "LocationType",
    "OperatingHours",
    "Opportunity",
    "PaymentAuthorizationInternalResultCode",
    "PaymentTermCode",
    "PostalCode",
    "PriceAdjustmentTier",
    "PriceBook",
    "Promotion",
    "PrivacyConsentStatus",
    "PurchaseOrder",
    "Quote",
    "QuoteLine",
    "SalesOrderProductRelationshipType",
    "SaleesOrderType",
    "SalesStore",
    "ShipmentMethod(wasshipping)",
    "ShoppingCart",
    "SoftwareApplication",
    "StateProvince",
    "TaxClass",
    "TaxType",
    "TaxationPolicy",
    "Timezone",
    "User",
    "WebSite"
];



var walkSync = function(dir, filelist) {

    var	files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
	if (fs.statSync(dir + '/' + file).isDirectory()) {
	    filelist = walkSync(dir + '/' + file, filelist);
	}
	else {
	    if(file.endsWith(".jsonld")) {
		filelist.push(dir + "/" + file);
	    }
	}

    });
    return filelist;
};


var files = walkSync("../src/propertyGroups");
var externalLinks = []
for (var i=0; i<files.length; i++) {
    var f = files[i];
    cleanAttributeGroup(f, externalLinks);
}

var files = walkSync("../src/subjectAreas");
for (var i=0; i<files.length; i++) {
    var f = files[i];
    cleanEntityGroup(f, externalLinks);
}



function cleanAttributeGroup(f, externalLinks) {
    console.log("\n\n CLEANING " + f + "\n\n");
    var json = JSON.parse(fs.readFileSync(f).toString());
    var props = json["propertyConcepts"] || [];
    var filteredProps = props.filter(function(p) {
	var range = p["range"]
	var valid = unlinked.find(r => r == range) == null
	if (!valid) {
	    externalLinks.push(p["@id"]);
	    console.log("FILTERING " + p["@id"] + " WITH RANGE " + range + " IN " + f);
	}
	return valid;
    });
    json["propertyConcepts"] = filteredProps;
    fs.writeFileSync(f, JSON.stringify(json, null, 2))
}


function cleanEntityGroup(f) {
    console.log("\n\n CLEANING " + f + "\n\n");
    var json = JSON.parse(fs.readFileSync(f).toString());
    if (json["propertyConcepts"] != null) {
	var props = json["propertyConcepts"] || [];
	var filteredProps = props.filter(function(p) {
	    var id = p["@id"]
	    var valid = externalLinks.find(el => el == id) == null
	    if (!valid) {
		console.log("REMOVING PROPERTY " + id + " IN " + f);
	    }
	    return valid;
	});
	json["propertyConcepts"] = filteredProps;
    }

    if (json["schemas"] != null) {
	var schemas = json["schemas"] || [];
	var filteredSchemas = schemas.map(function(s) {
	    if (s["properties"]) {
		var props = s["properties"] || [];
		var filteredProps = cleanProperties(s, props);
		s["properties"] = filteredProps;
	    }

	    if (s["and"]) {
		var base = s["and"].pop();
		var props = base["properties"];
		var filteredProps = cleanProperties(s, props);
		s["and"].push({ "properties": filteredProps});
	    }

	    return s;
	});
	json["schemas"] = filteredSchemas;
    }

    fs.writeFileSync(f, JSON.stringify(json, null, 2))
}

function cleanProperties(s, props) {
    return props.filter(function(p){
	var path = p["path"]
	var node = p["node"]
	var inExternalLinks = externalLinks.find(el => el == path) != null
	var inExternalNodes = unlinked.find(el => el == node) != null
	if (inExternalNodes || inExternalLinks ) {
	    console.log("REMOVING PROPERTY " + path + "/" + node +  " IN SCHEMA " + s["@id"]);
	    return false;
	} else {
	    return true;
	}
    });
}
