const pkg = require('../../package.json')
const promconfig = {
  includeMethod: true,
  includeStatusCode: true,
  includePath: true,
  customLabels: { version: pkg.version },
}

module.exports = promconfig
