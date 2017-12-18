#!/usr/bin/env node

const changeLog = require('../index');
var options = require('minimist')(process.argv.slice(2));
const fs = require('fs');
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

changeLog(args, options, (err, version) => {
  if (err) {
    if (err.message) {
      console.log('ERROR: ' + err.message);
      return process.exit(1);
    }
    throw err;
  }
  const command = args[0];
  const cmdArgs = [];
  const message = command === 'release' ? version : args[1];
  if (command === 'major' || command === 'minor' || command === 'patch' || command === 'release') {
    console.log(message);

    if (options.commit) {
      cmdArgs.push('commit', '-m');
    } else if (options['commit-all']) {
      cmdArgs.push('commit', '-am');
    }
  }

  if (cmdArgs.length > 0) {
    const child = require('child_process');
    cmdArgs.push(message);
    if (options.commit) {
      const commitArgs = ['add', 'CHANGELOG.md'];
      if (command === 'release') {
        commitArgs.push('package.json');
        if (fileExists('npm-shrinkwrap.json')) {
          commitArgs.push('npm-shrinkwrap.json');
        }
        if (fileExists('package-lock.json')) {
          commitArgs.push('package-lock.json');
        }
      }
      child.spawnSync('git', commitArgs);
    }
    const result = child.spawnSync('git', cmdArgs);
    if (result.error) process.exit(1);
  }
});

function fileExists (filePath) {
  try {
    fs.statSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
}
