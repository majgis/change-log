const MAJOR = 'Major';
const MINOR = 'Minor';
const PATCH = 'Patch';
const semVerPrefixTemplate = (semVerName)=> `### ${semVerName}`;

module.exports = {
  fileName: 'CHANGELOG.md',
  major: MAJOR,
  minor: MINOR,
  patch: PATCH,
  semVerPrefixTemplate: semVerPrefixTemplate,
  semVerMajorPrefix: semVerPrefixTemplate(MAJOR),
  semVerMinorPrefix: semVerPrefixTemplate(MINOR),
  semVerPatchPrefix: semVerPrefixTemplate(PATCH),
  bullet: '- ',
  unreleasedPrefix: '## [Unreleased]',
  unreleasedHeading: '## [Unreleased] - YYYY-MM-DD',
  versionPrefix: '## [v',
  releaseHeadingTemplate: (version, date)=> `## [v${version}] - ${date}`,
  semVerMatch: {
    'major': MAJOR,
    'minor': MINOR,
    'patch': PATCH
  }
};