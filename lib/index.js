'use strict'

const glob = require('glob')
const castArray = require('cast-array')

exports.plugin = {
  register: (server, options) => {
    const globOptions = {
      nodir: true,
      strict: true,
      cwd: options.cwd || process.cwd(),
      ignore: options.ignore
    }

    castArray(options.routes).forEach(function (pattern) {
      const files = glob.sync(pattern, globOptions)

      files.forEach(function (file) {
        const route = require(globOptions.cwd + '/' + file)
        server.route(route.default || route)
      })
    })
  },

  pkg: require('../package.json')
}
