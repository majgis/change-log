const appConstants = require('./appConstants');

function insertSemVerMsg(lines, semVerName, msg, next) {
  const semVerPrefix = appConstants.semVerPrefixTemplate(semVerName);

  lines.some((line, index)=>{

    if (line.indexOf(semVerPrefix) === 0){
      lines.splice(index + 1, 0, appConstants.bullet + msg);
      return true
    }
  });
  next( null, lines);
}

module.exports = insertSemVerMsg;
