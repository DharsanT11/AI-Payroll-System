const { execSync } = require('child_process');
const fs = require('fs');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('No TypeScript errors found!');
} catch (error) {
  const output = error.stdout ? error.stdout.toString() : error.message;
  fs.writeFileSync('ts-errors.txt', output, 'utf8');
  console.log(`Saved ${output.split('\n').length} lines of errors to ts-errors.txt`);
}
