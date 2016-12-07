#!/usr/bin/env node

const changeLog = require('../index');
var options = require('minimist')(process.argv.slice(2));
const args = options._;
delete options._;
const instructions = `
  change-log init
     - Intialize a new CHANGELOG.md file
     - Reports an error if CHANGELOG.md already exists
     - Reports an error if package.json does not exist
     
  change-log major "What was changed"
     - Adds a new entry under Major in the Unreleased section
     
  change-log minor "What was added"
     - Adds a new entry under Minor in the Unreleased section
     
  change-log patch "What was changed"
     - Adds a new entry under Patch in the Unreleased section
     
  change-log release
     - Marks the current unreleased section as a release
     - Adds an empty unreleased section
     - Writes release version to the console
`;

if (args.length === 0) {
  console.log(instructions);
  process.exit();
}

changeLog(args, options, (err) => {
  if (err) {
    if (err.message) {
      console.log('ERROR: ' + err.message);
      return process.exit(1);
    }
    throw err;
  }
});
