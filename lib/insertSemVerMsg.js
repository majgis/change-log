function insertSemVerMsg(lines, semVerName, msg, options, next) {
  const semVerPrefix = options.semVerPrefixTemplate(semVerName);

  lines.some((line, index)=>{

    if (line.indexOf(semVerPrefix) === 0){
      lines.splice(index + 1, 0, options.bullet + msg);
      return true
    }
  });
  next( null, lines);
}

module.exports = insertSemVerMsg;
