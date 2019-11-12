#!/usr/bin/env bash

## Generate the model
pushd ./scripts/jvm
sbt run
popd

## Generate global JSON-LD model
pushd ./scripts
npm i
npm run global_model
popd

## HTML documentation
rm -rf html/*
mkdir -p html
pushd ./scripts/node_modules/@aml-org/aml2html
npm run aml2html -- ../../../../html -d ../../../../src -g ../../../cfg.js -t ../../../templates
popd
cp -rf ./scripts/templates/*  ./html/
rm -rf ./html/*.mustache

## Additional HTML pages
pushd ./scripts
npm run subject_areas
npm run about
popd

## linking distribution
pushd ./html
ln -s ../dist ./dist
popd

## Copying images
cp ./scripts/diagrams/*.png ./html/
cp ./scripts/diagrams/Party.png ./src/subjectAreas/Party/diagram.png
cp ./scripts/diagrams/Payment.png ./src/subjectAreas/Payment/diagram.png
cp ./scripts/diagrams/PaymentMethod.png ./src/subjectAreas/PaymentMethod/diagram.png
cp ./scripts/diagrams/Product.png ./src/subjectAreas/Product/diagram.png
cp ./scripts/diagrams/SalesOrder.png ./src/subjectAreas/SalesOrder/diagram.png
cp ./scripts/diagrams/Shipment.png ./src/subjectAreas/Shipment/diagram.png
