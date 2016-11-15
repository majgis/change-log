'use strict';

function release(lines, options, next) {
  let unreleasedIndex;
  let majorIndex;
  let minorIndex;
  let patchIndex;
  let unreleasedUriIndex;
  let versionSplit;
  let fromVersion;

  lines.some((line, index)=> {
    if (!versionSplit
      && !unreleasedIndex
      && line.indexOf(options.unreleasedPrefix) === 0) {
      unreleasedIndex = index;
    } else if (!versionSplit
      && !majorIndex
      && line.indexOf(options.semVerMajorPrefix) === 0) {
      majorIndex = index;
    } else if (!versionSplit
      && !minorIndex
      && line.indexOf(options.semVerMinorPrefix) === 0) {
      minorIndex = index;
    } else if (!versionSplit
      && !patchIndex
      && line.indexOf(options.semVerPatchPrefix) === 0) {
      patchIndex = index;
    } else if (!versionSplit
      && line.indexOf(options.versionPrefix) === 0) {
      versionSplit = line
        .split(options.versionPrefix)[1]
        .split(']')[0]
        .split('.')
        .map(parseFloat);
      fromVersion = versionSplit.join('.');
    } else if (!unreleasedUriIndex
      && line.indexOf(options.unreleasedUriPrefix) === 0) {
      unreleasedUriIndex = index;
    }
    return !!unreleasedUriIndex;
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
    if (line.indexOf(options.bullet) === 0) {
      isPatch = true
    }
  }

  if (minorIndex) {
    let line = lines[minorIndex + 1];
    if (line.indexOf(options.bullet) === 0) {
      isMinor = true
    }
  }

  if (majorIndex) {
    let line = lines[majorIndex + 1];
    if (line.indexOf(options.bullet) === 0) {
      isMajor = true
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
  const version = versionSplit.join('.');

  // Insert uri reference for current release
  if (unreleasedUriIndex) {
    lines.splice(unreleasedUriIndex, 1,
      `${options.unreleasedUriPrefix} ${options.unreleasedUriTemplate(fromVersion, version, options.organization, options.name)}`);
    if (lines[unreleasedUriIndex + 1]) {
      // After first insert
      lines.splice(unreleasedUriIndex + 1, 0,
        `[v${version}]: ${options.uriTemplate(fromVersion, version, options.organization, options.name)}`);
    } else {
      // First insert
      lines.splice(unreleasedUriIndex + 1, 0,
        `[v${version}]: ${options.startUriTemplate(fromVersion, version, options.organization, options.name)}`);
    }
  }

  // If unreleased subheadings are empty, delete, including empty line
  if (!isPatch && patchIndex) {
    lines.splice(patchIndex, 2);
  }
  if (!isMinor && minorIndex) {
    lines.splice(minorIndex, 2);
  }
  if (!isMajor && majorIndex) {
    lines.splice(majorIndex, 2);
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
    lines.splice(unreleasedIndex + 1, 0, append.join('\n'));
  }

  next(null, lines);
}

module.exports = release;
