const waterfall = require('async/waterfall');
const apply = require('async/apply');
const fs = require('fs');

const initTemplate = (options)=>`\
# ${options.name} Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

${options.unreleasedHeading}

${options.semVerMajorPrefix}

${options.semVerMinorPrefix}

${options.semVerPatchPrefix}

${options.unreleasedUriPrefix} ${options.startUriTemplate('', '1.0.0', options.organization, options.name)}
`;

function verifyFileDoesNotExist(filePath, next) {
  fs.stat(filePath, (err)=>{
    if (!err) return next(new Error(`${filePath} already exists`));
    next();
  })
}

function createChangeLog (options, next) {
  fs.writeFile(options.fileName, initTemplate(options), next)
}

function init(options, next) {
  waterfall([
    apply(verifyFileDoesNotExist, options.fileName),
    apply(createChangeLog, options)
  ], next);
}

module.exports = init;
