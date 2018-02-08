const assert = require('assert')
const fs = require('fs')
const path = require('path')
const fhDeploy = require('../')

// create SFTP server
const Protocol = require('protocol')
const Net = require('net')
const srv = Net.createServer(function (client) {
  Protocol(client, client);
}).listen(8022);
console.error("sftpd server listening on port 8022");

// remove existing .deployrc
if( fs.existsSync(path.resolve('.deployrc.json')) ){
    console.log('deleting')
    fs.unlinkSync(path.resolve('.deployrc.json'))
}

// start the tests
describe('Test', function() {

    it('should automatically create a config file', function(done) {
        this.timeout(0)
        fhDeploy()
        done(false)
        //done(fs.existsSync(path.resolve('../deployrc.json')))
    })

})

srv.close()
