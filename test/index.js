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
console.log("sftpd server listening on port 8022");

function removeConfigFile(){
    // remove existing .deployrc
    if( fs.existsSync(path.resolve('.deployrc.json')) ){
        fs.unlinkSync(path.resolve('.deployrc.json'))
    }
}

// start the tests
describe('fh-deploy', function() {

    describe('Automatic config creation', function(){
        it('automatically creates a config file', function(done) {

            this.timeout(0)

            fhDeploy()

            const configCreated = fs.existsSync(path.resolve(__dirname, '../.deployrc.json'))
            removeConfigFile()

            if( configCreated ){
                done()
            } else {
                done(new Error())
            }
        })
    })

    describe('Server connection', function(){

    })

})

srv.close()
