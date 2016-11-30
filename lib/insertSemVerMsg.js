'use strict';

/**
 * Insert a bulleted item under the correct SemVer heading
 *
 * @param lines       An array of change log lines
 * @param semVerName  The SemVer name, Major, Minor or Patch
 * @param msg         The bulleted item to add
 * @param options     options.semVerPrefixTemplate and options.bullet are used
 * @param next        A continuation function
 */
function insertSemVerMsg (lines, semVerName, msg, options) {
  const linesCopy = lines.slice();
  const semVerPrefix = options.semVerPrefixTemplate(semVerName);

  linesCopy.some((line, index) => {
    if (line.indexOf(semVerPrefix) === 0) {
      linesCopy.splice(index + 1, 0, options.bullet + msg);
      return true;
    }
  });
  return linesCopy;
}

module.exports = insertSemVerMsg;
