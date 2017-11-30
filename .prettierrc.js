module.exports = {
  parser: 'flow',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  overrides: [
    {
      files: '.babelrc',
      options: { parser: 'json' },
    },
    {
      files: '*.json',
      options: { parser: 'json' },
    },
  ],
};
