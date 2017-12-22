#!/usr/bin/env node

const path = require("path");
const fs = require('fs');

// Local version replace global one
// taken from webpack: https://github.com/webpack/webpack/blob/master/bin/webpack.js#L10
try {
	const localDeploy = require.resolve(path.join(process.cwd(), "node_modules", "fh-deploy", "bin", "fh-deploy.js"));
	if(__filename !== localWebpack) {
		return require(localWebpack);
	}
} catch(e) {}

// get deploy command
const deploy = require('../')

// get config from .deploy.config.js, fallback to .deployrc.json
const config = fs.existsSync(path.join(process.cwd(), '.deploy.config.js')) ?
	path.join(process.cwd(), '.deploy.config.js') :
	path.join(process.cwd(), '.deployrc.json')

// run on default config
deploy(path.resolve(config))
