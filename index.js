const init = require('./lib/init');
const waterfall = require('async/waterfall');
const fs = require('fs');
const AsyncArgs = require('async-args');

function loadPkg(next) {
  fs.readFile('package.json', (err, data)=>{
    if (err) return next(err);
    next(null, JSON.parse(data))
  })
}

function executeTask(task, options, pkg, next){
  if (task === 'init') {
    return init(options, pkg, next)
  }
}

function changeLog(task, options, next) {
  waterfall([
    loadPkg,
    AsyncArgs.prependConstants(task, options),
    executeTask
  ], next);
}

module.exports = changeLog;