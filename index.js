const path = require('path')
const fs = require('fs')
const glob = require('glob')
const Client = require('ssh2-sftp-client')
const flatten = require('./src/utils').flatten
const colors = require('colors')
const sftp = new Client()
const deploy = require('./src/deploy').default

module.exports = config => {

    // if config is a path, load the path
    if( typeof config == 'string' || config instanceof String ){
        config = JSON.parse( fs.readFileSync(config) )
    }

    if( config.target === undefined ){
        console.warn('No deploy target specified! No action taken.'.red)
        return false
    }

    // Get all files from readable queue
    const queue = flatten(config.queue.map(entry => {
        return glob.sync(entry)
    }))

    deploy(sftp, config, queue)
}
