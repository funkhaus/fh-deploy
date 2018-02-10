const glob = require('glob')
const flatten = require('./utils').flatten
const fs = require('fs')
const path = require('path')
const git = require('nodegit-kit')

module.exports = async (queue, config) => {
    const output = flatten(queue.map(entry => {
        return glob.sync(entry)
    }))

    // is this a repo?
    if( fs.existsSync(path.resolve('./.git')) && config.hasOwnProperty('lastCommitSha') ){
        const repo = await git.Repository.open(path.resolve('.git'))

        // get head SHA
        const headCommit = await repo.getHeadCommit()
        // const headSha = headCommit.sha()
        // const headId = headCommit.id()

        // get starting point
        const startSha = config.lastCommitSha
        const startId = git.Oid.fromString(startSha)
        const startCommit = await git.Repository.getCommit(startId)

        // get diff
        const diff = await git.diff(repo, startCommit, headCommit)
        console.log(diff)

        // const diff = await git.diff([{'--name-only': `${headHash} ${start}`}])
        // console.log(diff)
        // console.log('test')


    }



    return output
}
