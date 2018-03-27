const colors = require('colors')
const path = require('path')
const prompt = require('prompt-sync')()
const fs = require('fs')
const _get = require('lodash/get')
const Client = require('ssh2-sftp-client')
const sftp = new Client()
const sftpStat = require('./sftpStat')

// Main function
module.exports.default = async function (config, queue) {

    let hasError = false

    // ask for password if we need it
    if( !config.settings || !config.settings.password || !config.settings.password.length ) {
        config.settings = config.settings || {}
        config.settings.password = prompt('Password: ', { echo: '*' })
    }

    const connection = await sftp.connect(config.settings).catch(err => new Error(err))

    // make sure the connection is working
    if( connection instanceof Error ){
        console.log(connection)
        console.log('Login failed. No action taken.'.red)
        await sftp.end()
        return
    }

    // make sure the target path is valid
    const targetPathCheck = await sftp.list(config.target).catch(err => new Error(err))
    if( targetPathCheck instanceof Error ){
        console.log(targetPathCheck)
        console.log('Target directory is invalid. No action taken.'.red)
        await sftp.end()
        return
    }

    // Each item is a string containing the path

    try {
        for( let item of queue ){

            // Does the item include a directory? If so, we'll need to create the directory
            if( item.includes('/') ){
                // Strip out the filename from the string
                const dirPath = item.replace(/[^\/]*$/, '')
                // create the desired path (adds a trailing slash so we're sure to create a directory)
                await sftp.mkdir(path.resolve(config.target, dirPath) + '/', true).catch(err => { throw new Error(err) })
            }

            // is the deployer going to ignore unchanged files?
            if( config.lazy ){
                // Get local file mtime
                // Default to 1 so that the default value is always higher than the remote (and therefore we upload!)
                const lastModifiedLocalMs = _get( fs.statSync(path.resolve('./', item)), 'mtimeMs', 1 )
                const lastModifiedLocal = lastModifiedLocalMs / 1000

                // Get remote file mtime
                const remoteStats = await sftpStat(sftp, path.resolve(config.target, item)).catch(() => {
                    // TODO: can put "file no longer exists" action here
                })
                const lastModifiedRemote = _get(remoteStats, 'mtime', 0)

                // ignore if we haven't modified locally since we last uploaded
                if( lastModifiedLocal < lastModifiedRemote ){
                    console.log(`${ item } unchanged, ignoring...`.yellow)
                    continue
                }
            }

            console.log(`Uploading ${ item }...`.green)

            // upload the file
            await sftp.put(path.resolve('./', item), path.resolve(config.target, item))
                .catch(err => { throw new Error(err) })
        }
    } catch(err) {
        console.log(err)
        console.log('Error during uploading. Not all files may be uploaded.'.yellow)
        hasError = true
    }

    if( !hasError ){
        console.log('Files uploaded successfully!'.green)
    }

    // close the connection
    await sftp.end()
}
