'use strict';
const init = require('./lib/init');
const waterfall = require('async/waterfall');
const apply = require('async/apply');
const asyncify = require('async/asyncify');
const fs = require('fs');
const AsyncArgs = require('async-args');
const appConstants = require('./lib/appConstants');
const insertSemVerMsg = require('./lib/insertSemVerMsg');
const release = require('./lib/release');
const path = require('path');
const defaultOrg = '$' + '{organization}';
const whitespacePaddingRE = /^\s+|\s+$/g;
const rcfile = require('rcfile')('change-log', {configFileName: '.changelog'});
const parallel = require('async/parallel');

function parsePkgRepo (repo) {
  let result = {};
  if (repo && repo.url && repo.url.indexOf('github.com') > 0) {
    let split = repo.url.split('/');
    result.organization = split[3];
    result.name = split[4].split('.')[0];
  }
  return result;
}

function loadPkg (next) {
  const dirName = path.basename(process.cwd());

  fs.readFile('package.json', (err, data) => {
    let pkg;
    if (err) {
      pkg = {
        name: dirName
      };
    } else {
      let packageJson = JSON.parse(data);
      let repo = parsePkgRepo(packageJson.repository);
      pkg = {
        name: repo.name || packageJson.name || dirName,
        organization: repo.organization || defaultOrg
      };
    }
    next(null, pkg);
  });
}

function loadFileLinesToArray (filePath, next) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (data) data = data.replace(whitespacePaddingRE, '').split('\n');
    next(err, data);
  });
}

function writeLinesToFile (filePath, lines, next) {
  const data = lines.join('\n') + '\n';
  fs.writeFile(filePath, data, next);
}
function safeReadFile (name, next) {
  fs.readFile(name, (error, value) => {
    if (error) return next();
    try {
      if (value) value = JSON.parse(value);
    } catch (e) {
      value = null;
    }

    next(null, value);
  });
}

function doNothing () {
  return null;
}

function writeVersion (fullVersion, next) {
  fullVersion = fullVersion.replace('v', '');
  parallel({
    package: apply(safeReadFile, 'package.json'),
    shrinkwrap: apply(safeReadFile, 'npm-shrinkwrap.json'),
    lock: apply(safeReadFile, 'package-lock.json')
  }, (error, response) => {
    if (error && !response) return next();
    if (response.shrinkwrap) {
      response.shrinkwrap.version = fullVersion;
      fs.writeFile('npm-shrinkwrap.json', JSON.stringify(response.shrinkwrap, null, 2)+'\n', doNothing);
    }

    if (response.package) {
      response.package.version = fullVersion;
      fs.writeFile('package.json', JSON.stringify(response.package, null, 2)+'\n', doNothing);
    }

    if (response.lock) {
      response.lock.version = fullVersion;
      fs.writeFile('package-lock.json', JSON.stringify(response.lock, null, 2)+'\n', doNothing);
    }
  });
}

function executeTask (args, options, next) {
  const task = args[0];
  const value = args[1];
  const asyncArgs = AsyncArgs();

  if (task === 'init') {
    return init(options, next);
  }

  const semVerName = options.semVerMatch[task];
  if (semVerName) {
    return waterfall([
      apply(loadFileLinesToArray, options.fileName),
      AsyncArgs.appendConstants(semVerName, value, options),
      asyncify(insertSemVerMsg),
      AsyncArgs.prependConstants(options.fileName),
      writeLinesToFile
    ], next);
  }

  if (task === 'release') {
    return waterfall([
      apply(loadFileLinesToArray, options.fileName),
      AsyncArgs.appendConstants(options),
      asyncify(release),
      asyncArgs.store('release'),
      asyncArgs.select('/lines'),
      AsyncArgs.prependConstants(options.fileName),
      writeLinesToFile,
      asyncArgs.values('release'),
      asyncArgs.select('/fullVersion'),
      asyncify(console.log),
      asyncArgs.values('release'),
      asyncArgs.select('/fullVersion'),
      writeVersion
    ], next);
  }

  next(new Error('The command was not recognized.'));
}

function uriTemplateFactory (template) {
  return (fromVersion, toVersion, organization, name) => {
    return template
      .replace(/\$\{fromVersion}/g, fromVersion)
      .replace(/\$\{toVersion}/g, toVersion)
      .replace(/\$\{organization}/g, organization)
      .replace(/\$\{name}/g, name);
  };
}

function updateOptions (options) {
  if (options.unreleasedUriTemplate) {
    options.unreleasedUriTemplate =
      uriTemplateFactory(options.unreleasedUriTemplate);
  }
  if (options.startUriTemplate) {
    options.startUriTemplate = uriTemplateFactory(options.startUriTemplate);
  }
  if (options.uriTemplate) {
    options.uriTemplate = uriTemplateFactory(options.uriTemplate);
  }

  return Object.assign({}, appConstants, options);
}

function changeLog (args, cliOptions, next) {
  let options = updateOptions(Object.assign(rcfile, cliOptions));
  waterfall([
    loadPkg,
    AsyncArgs.appendConstants(options),
    asyncify(Object.assign),
    apply(executeTask, args)
  ], next);
}

module.exports = changeLog;
