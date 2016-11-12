#!/usr/bin/env node

const changeLog = require('../index');
var options = require('minimist')(process.argv.slice(2));
const args = options._;
delete options._;
const task = args[0];
const instructions = `
  change-log init
     - Intialize a new CHANGELOG.md file
     - Reports an error if CHANGELOG.md already exists
`;

if (args.length === 0){
  return console.log(instructions);
}

changeLog(task, options, (err) => {
  if (err) {
    throw err
  }
});