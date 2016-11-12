'use strict';
const ac = require('./appConstants');

function release(lines, next) {
  let unreleasedIndex;
  let majorIndex;
  let minorIndex;
  let patchIndex;
  let versionSplit;

  lines.some((line, index)=> {
    if (!unreleasedIndex && line.indexOf(ac.unreleasedPrefix) === 0) {
      unreleasedIndex = index;
    } else if (!majorIndex && line.indexOf(ac.semVerMajorPrefix) === 0) {
      majorIndex = index;
    } else if (!minorIndex && line.indexOf(ac.semVerMinorPrefix) === 0) {
      minorIndex = index;
    } else if (!patchIndex && line.indexOf(ac.semVerPatchPrefix) === 0) {
      patchIndex = index;
    } else if (!versionSplit && line.indexOf(ac.versionPrefix) === 0) {
      versionSplit = line
        .split(ac.versionPrefix)[1]
        .split(']')[0]
        .split('.')
        .map(parseFloat);
    }
    return !!versionSplit;
  });

  if (!unreleasedIndex) {
    return next(
      new Error('The unreleased section is missing.')
    )
  }

  let isMajor;
  let isMinor;
  let isPatch;

  if (patchIndex) {
    let line = lines[patchIndex + 1];
    if (line.indexOf(ac.bullet) === 0) {
      // Bullets
      isPatch = true
    } else {
      // No bullets
      lines.splice(patchIndex, 1);
    }
  }

  if (minorIndex) {
    let line = lines[minorIndex + 1];
    if (line.indexOf(ac.bullet) === 0) {
      // Bullets
      isMinor = true
    } else {
      // No bullets
      lines.splice(minorIndex, 1);
    }
  }

  if (majorIndex) {
    let line = lines[majorIndex + 1];
    if (line.indexOf(ac.bullet) === 0) {
      // Bullets
      isMajor = true
    } else {
      // No bullets
      lines.splice(majorIndex, 1);
    }
  }

  if (!isMajor && !isMinor && !isPatch) {
    return next(new Error('You have no unreleased entries.'))
  }

  if (!versionSplit) {
    versionSplit = [1, 0, 0]
  } else {
    if (isMajor) {
      versionSplit[0] = versionSplit[0] + 1;
      versionSplit[1] = 0;
      versionSplit[2] = 0;
    } else if (isMinor) {
      versionSplit[1] = versionSplit[1] + 1;
      versionSplit[2] = 0;
    } else if (isPatch) {
      versionSplit[2] = versionSplit[2] + 1;
    }
  }


  if (unreleasedIndex) {
    let date = (new Date()).toISOString().split('T')[0];
    let append = [
      ac.semVerMajorPrefix,
      ac.semVerMinorPrefix,
      ac.semVerPatchPrefix,
      '',
      ac.releaseHeadingTemplate(versionSplit.join('.'), date)
    ];
    lines.splice(unreleasedIndex + 1, 0, append.join('\n'));
  }

  next(null, lines);
}

module.exports = release;
