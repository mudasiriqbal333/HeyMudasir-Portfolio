//? Four groups that never match the same file. lint-staged runs different
//? groups at the same time, so a file matched by two of them would be
//? rewritten by two tools at once; inside a group the commands run in order.
module.exports = {
  '!(*.styled).{js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.styled.{js,jsx}': ['eslint --fix', 'stylelint --fix', 'prettier --write'],
  '*.css': ['stylelint --fix', 'prettier --write'],
  '*.mjs': ['eslint --fix', 'prettier --write'],
};
