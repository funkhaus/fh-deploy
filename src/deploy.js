const colors = require('colors')
const path = require('path')

// Main function
module.exports.default = async function (sftp, config, queue) {
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
            console.log(`Uploading ${ item }...`)

            // Does the item include a directory? If so, we'll need to create the directory
            if( item.includes('/') ){
                // Strip out the filename from the string
                const dirPath = item.replace(/[^\/]*$/, '')
                // create the desired path
                await sftp.mkdir(path.resolve(config.target, dirPath), true).catch(err => { throw new Error(err) })
            }

            // upload the file
            await sftp.put(path.resolve('./', item), path.resolve(config.target, item))
                .catch(err => { throw new Error(err) })
        }
    } catch(err) {
        console.log(err)
        console.log('Error during uploading. Not all files may be uploaded.'.yellow)
    }

    console.log('Files uploaded successfully!'.green)

    // close the connection
    await sftp.end()
}
