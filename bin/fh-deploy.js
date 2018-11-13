#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const cosmiconfig = require('cosmiconfig')

// get deploy command
const deploy = require('../')

// get config using cosmiconfig
const explorer = cosmiconfig('deploy')
const result = explorer.searchSync()

// run on default config
deploy(result && result.config ? result.config : null)
