const execSync = require('child_process').execSync;

const arg = process.argv[2];
if (!arg) throw new Error('Pass the name of migration');
const command = `typeorm-ts-node-commonjs migration:generate -d .src/database/data-source.ts ./src/database/migrations/${arg}`;

execSync(command, { stdio: 'inherit' });
