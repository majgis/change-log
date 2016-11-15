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
  unreleasedUriPrefix: '[Unreleased]:',
  releaseHeadingTemplate: (version, date)=> `## [v${version}] - ${date}`,
  semVerMatch: {
    'major': MAJOR,
    'minor': MINOR,
    'patch': PATCH
  },
  unreleasedUriTemplate: (toVersion, organization, project) => `https://github.com/${organization}/${project}/compare/v${toVersion}...master`,
  startUriTemplate: (toVersion,organization, project)=> `https://github.com/${organization}/${project}/commits/v${toVersion}`,
  uriTemplate: (fromVersion, toVersion, organization, project)=> `https://github.com/${organization}/${project}/compare/v${fromVersion}...v${toVersion}`
};