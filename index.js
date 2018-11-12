const path = require('path')
const fs = require('fs')
const glob = require('glob')
const flatten = require('./src/utils').flatten
const colors = require('colors')
const deploy = require('./src/deploy').default
const buildConfig = require('./src/buildConfig')

module.exports = config => {
    // something's wrong with the config, so let's rebuild it and exit
    if (
        (typeof config == 'string' && !fs.existsSync(config)) ||
        (typeof config == 'object' && Object.keys(config).length === 0)
    ) {
        buildConfig()
        return
    }

    // if config is a path, load the path
    if (typeof config == 'string' || config instanceof String) {
        config = require(config)
    }

    if (config.target === undefined) {
        console.warn('No deploy target specified! No action taken.'.red)
        return false
    }

    let queue = config.queue

    if (!config.hasOwnProperty('queue') || !config.queue.length) {
        console.log(
            'No queue in config file. Defaulting to package.json "files"...'
                .yellow
        )
        const package = require(path.resolve('./', 'package.json'))
        queue = package.files
    }

    if (!queue || !queue.length) {
        console.warn('No files in upload queue! No action taken.'.red)
        return
    }

    // Get all files from readable queue
    queue = flatten(
        queue.map(entry => {
            return glob.sync(entry)
        })
    )

    deploy(config, queue)
}
