'use strict';
const init = require('./lib/init');
const waterfall = require('async/waterfall');
const apply = require('async/apply');
const fs = require('fs');
const AsyncArgs = require('async-args');
const appConstants = require('./lib/appConstants');
const insertSemVerMsg = require('./lib/insertSemVerMsg');
const release = require('./lib/release');
const path = require('path');

function loadPkg(next) {
  fs.readFile('package.json', (err, data)=> {
    let pkg;
    if (err) {
      pkg = {
        name: path.basename(process.cwd())
      }
    } else {
      pkg = JSON.parse(data)
    }

    next(null, pkg)
  })
}

function loadFileLinesToArray(filePath, next) {
  fs.readFile(filePath, 'utf8', (err, data)=> {
    if (data) data = data.split('\n');
    next(err, data);
  })
}

function writeLinesToFile(filePath, lines, next) {
  const data = lines.join('\n') + '\n';
  fs.writeFile(filePath, data, next);
}

function executeTask(args, options, pkg, next) {
  const task = args[0];
  const value = args[1];

  if (task === 'init') {
    return init(options, pkg, next)
  }

  const semVerName = appConstants.semVerMatch[task];
  if (semVerName) {
    return waterfall([
      apply(loadFileLinesToArray, appConstants.fileName),
      AsyncArgs.appendConstants(semVerName, value),
      insertSemVerMsg,
      AsyncArgs.prependConstants(appConstants.fileName),
      writeLinesToFile
    ], next);
  }

  if (task === 'release'){
    return waterfall([
      apply(loadFileLinesToArray, appConstants.fileName),
      release,
      AsyncArgs.prependConstants(appConstants.fileName),
      writeLinesToFile
    ], next)
  }
}

function changeLog(args, options, next) {
  waterfall([
    loadPkg,
    AsyncArgs.prependConstants(args, options),
    executeTask
  ], next);
}

module.exports = changeLog;