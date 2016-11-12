const init = require('./lib/init');
const waterfall = require('async/waterfall');
const apply = require('async/apply');
const fs = require('fs');
const AsyncArgs = require('async-args');
const appConstants = require('./lib/appConstants');
const insertSemVerMsg = require('./lib/insertSemVerMsg');

function loadPkg(next) {
  fs.readFile('package.json', (err, data)=> {
    if (err) return next(err);
    next(null, JSON.parse(data))
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
}

function changeLog(args, options, next) {
  waterfall([
    loadPkg,
    AsyncArgs.prependConstants(args, options),
    executeTask
  ], next);
}

module.exports = changeLog;