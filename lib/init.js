const ac = require('./appConstants');
const waterfall = require('async/waterfall');
const apply = require('async/apply');
const fs = require('fs');

const initTemplate = (name, organization)=>`\
# ${name} Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

${ac.unreleasedHeading}

${ac.semVerMajorPrefix}

${ac.semVerMinorPrefix}

${ac.semVerPatchPrefix}

${ac.unreleasedUriPrefix} ${ac.startUriTemplate('1.0.0', organization, name)}
`;

function verifyFileDoesNotExist(filePath, next) {
  fs.stat(filePath, (err)=>{
    if (!err) return next(new Error(`${ac.fileName} already exists`));
    next();
  })
}

function createChangeLog (filePath, pkg, next) {
  fs.writeFile(filePath, initTemplate(pkg.name, pkg.organization), next)
}

function init(options, pkg, next) {
  waterfall([
    apply(verifyFileDoesNotExist, ac.fileName),
    apply(createChangeLog, ac.fileName, pkg)
  ], next);
}

module.exports = init;
