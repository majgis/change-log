const MAJOR = 'Major';
const MINOR = 'Minor';
const PATCH = 'Patch';

module.exports = {
  fileName: 'CHANGELOG.md',
  major: MAJOR,
  minor: MINOR,
  patch: PATCH,
  semVerPrefixTemplate: (semVerName)=> `### ${semVerName}`,
  bullet: '- ',
  semVerMatch: {
    'major': MAJOR,
    'minor': MINOR,
    'patch': PATCH
  }
};