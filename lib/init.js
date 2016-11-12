const appConstants = require('./appConstants');
const waterfall = require('async/waterfall');
const apply = require('async/apply');
const fs = require('fs');

const initTemplate = (name)=>`\
# ${name} Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

${appConstants.unreleasedHeading}
${appConstants.semVerMajorPrefix}
${appConstants.semVerMinorPrefix}
${appConstants.semVerPatchPrefix}

[Unreleased]:
`;

function verifyFileDoesNotExist(filePath, next) {
  fs.stat(filePath, (err)=>{
    if (!err) return next(new Error(`${appConstants.fileName} already exists`));
    next();
  })
}

function createChangeLog (filePath, pkg, next) {
  fs.writeFile(filePath, initTemplate(pkg.name))
}

function init(options, pkg, next) {
  waterfall([
    apply(verifyFileDoesNotExist, appConstants.fileName),
    apply(createChangeLog, appConstants.fileName, pkg)
  ], next);
}

module.exports = init;
