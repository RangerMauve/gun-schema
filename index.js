"use strict";
var globalVar = require("global");
var makeValidator = require("is-my-json-valid");
var Gun = globalVar.Gun || require("gun");

module.exports = makeSchema;

if (!Gun)
	throw new Error("gun-schema: Gun was not found globally or via the bundle!");

makeSchema(Gun.chain);

function makeSchema(gun) {
	gun.schema = addSchema;
	gun.schemas = addSchemas;
	gun.save = putValid;
}

function addSchemas(map, options) {
	var gun = this;

	var schemas = getSchemas(gun);

	for (var key in schemas) {
		var schema = schemas[key];
		gun.schema(key, schema, options);
	}

	return gun;
}

function addSchema(name, schema, options) {
	var gun = this;

	var schemas = getSchemas(gun);

	var validate = makeValidator(schema, options);

	schemas[name] = validate;

	return gun;
}

function putValid(name, value) {
	var gun = this;

	var schemas = getSchemas(gun);

	var validate = schemas[name];

	if (!validate)
		throw new TypeError(name + " has not been registered as a type");

	var valid = validate(value);

	if (valid)
		return gun.put(value);

	var err = new TypeError("Value doesn't match schema for " + name);
	err.errors = validate.errors;
	throw err;
}

function getSchemas(gun) {
	if (!gun._schemas)
		gun._schemas = {};
	return gun._schemas;
}
