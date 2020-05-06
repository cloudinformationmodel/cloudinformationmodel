# Cloud Information Model
This project is licensed under the terms of the Apache 2.0 license

## Structure

Main directories:
- `dist`: distribution of the full model as a single file in each of the supported formats
- `src`: model metadata structured by subject area, entity group and property group
- `html`: model documentation (HTML)

A common JSON-LD context that is used by every single JSON-LD file can be found at `src/context.jsonld`.
This is the context referred from `http://cloudinformationmodel.org/context.jsonld`.

The model metadata is structured in subject areas under `src/subjectAreas/{subjectArea}`. A `about.jsonld` file contains a small description of the subject area itself.

Each subject area is divided into entity groups stored in nested directories: `src/subjectAreas/{subjectArea}/{entityGroup}`.

Each entity group has the following [JSON-LD](https://json-ld.org/) main files:

- `concepts.jsonld`: conceptual ontology describing the business model for that entity group
- `schema.jsonld`: canonical schema for data following the semantics of the business model

Additionally, reusable conceptual properties are stored in the `src/propertyGroups/{propertyGroup}` directories.
Each property group has a single JSON-LD file:

- `concepts.jsonld`: conceptual ontology describing the business model properties in the property group.

A relational mapping for the canonical schema is provided in the following files in each entity group:

- `database.sql`: SQL DDL statements for the canonical schema
- `database.r2rml`: [Relational to RDF](https://www.w3.org/TR/r2rml/) mapping for the schema that can be generated from the SQL DDL statements

Additionally, each entity group has the following mappings:

- `concepts.yaml`: YAML file describing the business model ontology for that entity group using [AML](https://a.ml)
- `schema.yaml`: YAML file describing the canonical schema for the information in that business model using [AML](https://a.ml)
- `schema.json`: [JSON schema](https://json-schema.org/) generated from the canonical schema
- `schema.raml`: [RAML datatypes](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#defining-types) generated from teh canonical schema

## Global files

- The full model can be downloaded as a single JSON-LD file at `dist/model.jsonld`.
- Two stand-alone [AML](https://a.ml) files with the conceptual model and canonical schema can be found at `dist/concepts.yaml` and `dist/schema.yaml`.
- Global SQL DDL statements file for the full model and R2RML mappings can be found at `dist/schema.sql` and `dist/schema.r2rml`.
- Global RAML types and JSON Schema files can be found at: `dist/schema.raml` and `dist/schema.json`.
