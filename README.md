# gun-schema
Validate [Gun](http://gun.js.org/) data with JSON-Schema.

Validation is done by [is-my-json-valid](https://github.com/mafintosh/is-my-json-valid)

**Note: This has been moved over to the [gundb organization](https://github.com/gundb/gun-schema)

## Getting started
### Browser
Download the js bundle from the [releases page](https://github.com/RangerMauve/gun-schema/releases) and add it to the page. As well as attaching the required methods to Gun, it will create a GunSchema global.

### Server
Install from NPM

```bash
npm install --save gun-schema
```

Require the module to have it attach itself to GUN

```JavaScript
var Gun = require("gun");
require("gun-schema");
```

### Example

```JavaScript
// Get a reference to your schema from wherever
// This one was taken from the is-my-json-valid page
var schema = {
    required: true,
    type: 'object',
    properties: {
        hello: {
            required: true,
            type: 'string'
        }
    }
};

var gun = Gun();

gun.schema("example", schema);

// This is valid so it'll get put into the graph
gun.save("example", {
    hello: "World!"
});

// This will throw an error because `hello` was set as `required`
gun.save("example", {
    goodbye: "World!"
});
```

## API
After the plugin has been properly initialized, it adds the following methods on gun instances

### `gun.schema(name, schema, options)`
Adds a new type that will be recognized by `gun.save()`
- `name` : The unique name for this type of node
- `schema` : The JSON Schema definition to use for validating this type
- `options` : Optional argument which gets passed down to [is-my-json-valid](https://github.com/mafintosh/is-my-json-valid)

### `gun.schemas(map, options)`
Adds a bunch of schemas in one go.
- `map` : A map of `name`-`schema` pairs that get passed on to `gun.schema()`
- `options` : Optional argument which gets passed down to `gun.schema()` to configure [is-my-json-valid](https://github.com/mafintosh/is-my-json-valid)

### `gun.save(name, value)`
Similar to `gun.put()`, but uses the schema associated with `name` to ensure that `value` is valid.
- `name` : The name of the schema that `value` should match
- `value` : The value that should be validated before being `put()` into the DB.

If `name` does not point to a schema name that has been registered, then an error will be thrown. If `value` doesn't validate against the schema, then an error will be thrown with a `errors` property which contains the list of things that are wrong with `value`.

### `GunSchema(gun)`
This is what gets exported by the module in CommonJS and what is added as the `GunSchema` global in the bundle. It takes a gun instance and adds schema functionality to it.
- `gun` The gun instance to attach to. Not, this isn't the `Gun` constructor, but an actual instance or `Gun.chain`.

## Building
You can build the browser bundle yourself by cloning the repo and executing:

```bash
`npm install`
`npm install gun`
`npm run bundle`
```

You will then have a file called `bundle.js` which you can embed in a webpage. The building is facilitated by [Browserify](http://browserify.org/)
