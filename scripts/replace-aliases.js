const { replaceTscAliasPaths } = require('tsc-alias');

replaceTscAliasPaths({
  project: 'tsconfig.json',
  verbose: true,
});
