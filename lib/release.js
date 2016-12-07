'use strict';

function release (lines, options) {
  const linesCopy = lines.slice();
  let unreleasedIndex;
  let majorIndex;
  let minorIndex;
  let patchIndex;
  let unreleasedUriIndex;
  let versionSplit;
  let fromVersion;

  linesCopy.some((line, index) => {
    if (!versionSplit &&
      !unreleasedIndex &&
      line.indexOf(options.unreleasedPrefix) === 0) {
      unreleasedIndex = index;
    } else if (!versionSplit &&
      !majorIndex &&
      line.indexOf(options.semVerMajorPrefix) === 0) {
      majorIndex = index;
    } else if (!versionSplit &&
      !minorIndex &&
      line.indexOf(options.semVerMinorPrefix) === 0) {
      minorIndex = index;
    } else if (!versionSplit &&
      !patchIndex &&
      line.indexOf(options.semVerPatchPrefix) === 0) {
      patchIndex = index;
    } else if (!versionSplit &&
      line.indexOf(options.versionPrefix) === 0) {
      versionSplit = line
        .split(options.versionPrefix)[1]
        .split(']')[0]
        .split('.')
        .map(parseFloat);
      fromVersion = versionSplit.join('.');
    } else if (!unreleasedUriIndex &&
      line.indexOf(options.unreleasedUriPrefix) === 0) {
      unreleasedUriIndex = index;
    }
    return !!unreleasedUriIndex;
  });

  if (!unreleasedIndex) {
    throw new Error('The unreleased section is missing.');
  }

  let isMajor;
  let isMinor;
  let isPatch;

  if (patchIndex) {
    let line = linesCopy[patchIndex + 1];
    if (line.indexOf(options.bullet) === 0) {
      isPatch = true;
    }
  }

  if (minorIndex) {
    let line = linesCopy[minorIndex + 1];
    if (line.indexOf(options.bullet) === 0) {
      isMinor = true;
    }
  }

  if (majorIndex) {
    let line = linesCopy[majorIndex + 1];
    if (line.indexOf(options.bullet) === 0) {
      isMajor = true;
    }
  }

  if (!isMajor && !isMinor && !isPatch) {
    throw new Error('You have no unreleased entries.');
  }

  if (!versionSplit) {
    versionSplit = [1, 0, 0];
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
  const version = versionSplit.join('.');

  // Insert uri reference for current release
  if (unreleasedUriIndex) {
    linesCopy.splice(unreleasedUriIndex, 1,
      `${options.unreleasedUriPrefix} ${options.unreleasedUriTemplate(fromVersion, version, options.organization, options.name)}`);
    if (linesCopy[unreleasedUriIndex + 1]) {
      // After first insert
      linesCopy.splice(unreleasedUriIndex + 1, 0,
        `[v${version}]: ${options.uriTemplate(fromVersion, version, options.organization, options.name)}`);
    } else {
      // First insert
      linesCopy.splice(unreleasedUriIndex + 1, 0,
        `[v${version}]: ${options.startUriTemplate(fromVersion, version, options.organization, options.name)}`);
    }
  }

  // If unreleased subheadings are empty, delete, including empty line
  if (!isPatch && patchIndex) {
    linesCopy.splice(patchIndex, 2);
  }
  if (!isMinor && minorIndex) {
    linesCopy.splice(minorIndex, 2);
  }
  if (!isMajor && majorIndex) {
    linesCopy.splice(majorIndex, 2);
  }

  // Insert unreleased subheadings and release heading
  if (unreleasedIndex) {
    let date = (new Date()).toISOString().split('T')[0];
    let append = [
      '',
      options.semVerMajorPrefix,
      '',
      options.semVerMinorPrefix,
      '',
      options.semVerPatchPrefix,
      '',
      options.releaseHeadingTemplate(version, date)
    ];
    linesCopy.splice(unreleasedIndex + 1, 0, append.join('\n'));
  }

  return {
    lines: linesCopy,
    version: version,
    fullVersion: 'v' + version
  };
}

module.exports = release;
