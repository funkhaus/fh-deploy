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
        !config ||
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

    // 1.2.0+: find the environment matching the user input
    if (config.environments) {
        // get user-requested env
        // node fh-deploy env-name
        // 0    1         2
        const targetEnv = process.argv[2]
        const targetResult = targetEnv
            ? config.environments.find(e => e.name == targetEnv)
            : false

        // exit early if specified env not found
        if (targetEnv && !targetResult) {
            console.log(
                `Can\'t find target environment "${targetEnv}"! No action taken.`
                    .red.bold
            )
            return false
        }

        // if there is no env name or if we can't find the env in the deployrc...
        if (targetEnv === undefined || !targetResult) {
            // ...and fall back to the first env
            console.log(
                'Using default deploy target ' +
                    config.environments[0].name.green +
                    '...'
            )
            config = config.environments[0]
        } else {
            // otherwise, get the desired env
            console.log(`Using deploy target ` + `${targetEnv}`.green + `...`)
            config = targetResult
        }
    }

    if (config.target === undefined) {
        console.warn('No deploy target specified! No action taken.'.red)
        return false
    }

    let queue = config.queue

    if (!config.hasOwnProperty('queue') || !config.queue.length) {
        console.log(
            'No queue in config file. Defaulting to package.json "files"...'
        )
        const package = require(path.resolve('./', 'package.json'))
        queue = package.files
    }

    if (!queue || !queue.length) {
        console.warn('No files in upload queue! No action taken.'.red.bold)
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
