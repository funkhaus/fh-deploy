#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const cosmiconfig = require('cosmiconfig')

// Local version replace global one
// taken from webpack: https://github.com/webpack/webpack/blob/master/bin/webpack.js#L10
try {
    const localDeploy = require.resolve(
        path.join(
            process.cwd(),
            'node_modules',
            'fh-deploy',
            'bin',
            'fh-deploy.js'
        )
    )
    if (__filename !== localWebpack) {
        return require(localWebpack)
    }
} catch (e) {}

// get deploy command
const deploy = require('../')

// get config using cosmiconfig
const explorer = cosmiconfig('deploy')
const result = explorer.searchSync()

// run on default config
deploy(result && result.config ? result.config : null)
