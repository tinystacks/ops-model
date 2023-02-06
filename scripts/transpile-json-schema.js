const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { resolveRefsAt } = require('json-refs');

async function transpileJsonSchema () {
  const yamlSchema = fs.readFileSync('src/schemas/config.yml');

  const refResolvedSchema = await resolveRefsAt(path.resolve('src/schemas/config.yml'),  {
    loaderOptions : {
      processContent: (res, callback) => {
        callback(null, yaml.load(res.text));
      }
    }
  });

  // console.debug('')

  fs.writeFileSync('dist/config-schema.json', JSON.stringify(refResolvedSchema.resolved.Config, null, 2));
}
transpileJsonSchema();