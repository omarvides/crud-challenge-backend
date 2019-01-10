const jsonTransformer = require('json-transformer-node')
const transformSingle = {
  mapping: {
    item: {
      id: '_id',
      email: 'email',
    },
  },
}

function transformSingleElement(docs, callback) {
  let jsonDocs
  try {
    jsonDocs = JSON.parse(JSON.stringify(docs))
  } catch (e) {
    return callback(e)
  }
  const result = jsonTransformer.transform(jsonDocs, transformSingle)
  return callback(null, result)
}

module.exports = {
  transformSingleElement,
}
