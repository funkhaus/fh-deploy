Deploy files to a server via SFTP. Built as an addition to [Vuepress](https://github.com/funkhaus/vuepress).

**Note!** Running fh-deploy will automatically overwrite any files of the same name on your server WITHOUT prompting. Assume your files are going to be overwritten as soon as you run fh-deploy!

## Usage
Automatic:

```bash
npm i fh-deploy --save
fh-deploy # automatically creates a config file with user input
```

Manual:
```js
const deploy = require('fh-deploy')

// either:
deploy({
    settings: {
        host: 'your sftp host',
        port: 'your port',
        username: 'username',
        password: 'password' // optional - if blank, you'll be asked for your password on each deploy
    },
    // If this queue is empty or null, fh-deploy will deploy the files in package.json's "files" array
    queue: [
        'filename.js',
        'all-files-one-level-deep/*.*',
        'all-files-in-all-subdirectories/**/*.*'
    ],
    target: '/absolute/path/to/deploy/target'
})

// or a path to a JSON file with the above configuration:
deploy('./path-to-config-file')
```

Upload a queue of files to the specified server via SFTP. Uses [glob](https://www.npmjs.com/package/glob) to find files to upload.

--------

__fh-deploy__

http://funkhaus.us

Version: 1.1.4
