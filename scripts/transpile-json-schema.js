const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { resolveRefsAt } = require('json-refs');

async function transpileSchema (filePath) {
  const pathElems = filePath.split('/');
  const fileName = pathElems.at(-1);
  const jsonFileName = fileName.replace('.yml', '.json');
  const refResolvedSchema = await resolveRefsAt(path.resolve(filePath),  {
    loaderOptions : {
      processContent: (res, callback) => {
        callback(null, yaml.load(res.text));
      }
    }
  });

  fs.writeFileSync(`dist/json-schemas/${jsonFileName}`, JSON.stringify(refResolvedSchema.resolved, null, 2));
}

async function transpileJsonSchemas () {
  const schemas = [
    'src/schemas/yaml-provider.yml',
    'src/schemas/yaml-widget.yml',
    'src/schemas/yaml-dashboard.yml',
    'src/schemas/config.yml'
  ];
  
  fs.mkdirSync('dist/json-schemas', { recursive: true });
  for (const schema of schemas) {
    await transpileSchema(schema);
  }

  const refResolvedSchema = await resolveRefsAt(path.resolve('src/schemas/config.yml'),  {
    loaderOptions : {
      processContent: (res, callback) => {
        callback(null, yaml.load(res.text));
      }
    }
  });

  fs.writeFileSync(`dist/json-schemas/index.json`, JSON.stringify(refResolvedSchema.resolved.Config, null, 2));
}
transpileJsonSchemas();