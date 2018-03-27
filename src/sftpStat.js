// Promise wrapper for ssh2-streams `stat` (https://github.com/mscdex/ssh2-streams/blob/master/lib/sftp.js#L1666)
module.exports = function(sftp, path){

    return new Promise((resolve, reject) => {
        if( !sftp || !sftp.sftp ){
            return reject('No SFTP object provided.')
        }
        sftp.sftp.stat(path, (err, list) => {
            if( err ){
                return reject(err)
            }
            return resolve(list)
        })
    })
}
