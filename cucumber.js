module.exports = {
  default: [
'./features/*.feature',
'--require-module ts-node/register',
'--require-module global-jsdom/register',
'--require ./features/step_definitions/*.js',
'--require ./features/step_definitions/*.ts',
'--require ./features/step_definitions/*.tsx',
  ].join(' '),
};