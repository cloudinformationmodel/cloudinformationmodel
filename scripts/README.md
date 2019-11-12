# CIM Scripts

## Generate Subject Areas HTML documentation

Generates the HTML documentation from the JSON-LD `about.jsonld` files located in each subject area directory.

The template for the subject area documentation is in `templates/subject_areas.mustache`.

Execute the provided NPM task:

```shell script
$ npm run subject_areas
```

The file will be generated directly in the `html` directory of the distribution.

## Generate ABOUT HTML page

Generates the 'About CIM' HTML documentation page.

The template for the subject area documentation is in `templates/about.mustache`.

Execute the provided NPM task:

```shell script
$ npm run about
```

The file will be generated directly in the `html` directory of the distribution.

## Generate link_formats information for AML2HTML

In order to render download links in the documentation for AML2HTML the source files
must be processed and a `format_links.json` file generated that then must be passed to
the configuration file for AML2THML.

The following script will process the files and generate the download links metadata:

```shell script
$ npm run formats_links_mapping
```

This will generate the download links file in the same `scripts` directory of the CIM distribution.

## Generate global JSON-LD model

Generates a single JSON-LD global file with all the information about concepts and schema for subject areas and property groups.

Execute the provided NPM task:

```shell script
$ npm run global_model
```

The file will be generated directly in the `html` directory of the distribution.

## Configuration files

The `scripts` directory also contains different files important to generate the documentation for the distribution:

- `cfg.js`: Configuration file for AML2HTML. It must be passed as an input parameter to generate the right HTML documentation.