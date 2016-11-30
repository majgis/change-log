'use strict';

const test = require('tape');
const target = require('./insertSemVerMsg');
const options = {
  semVerPrefixTemplate: semVerName => `### ${semVerName}`
  , bullet: '* '
};
const lines = [
  ''
  , '### Minor'
];

test('insert a new minor bullet', t => {
  t.plan(1);
  const expected = [
    ''
    , '### Minor'
    , '* This is a test'
  ];
  const actual = target(lines, 'Minor', 'This is a test', options);
  t.deepEqual(actual, expected);
});