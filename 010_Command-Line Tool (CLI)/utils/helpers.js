const chalk = require('chalk');
const styles = require('./styles');

function showHelp() {
  console.log('');
  console.log(styles.header('📚 Available Commands:'));
  console.log('');
  console.log(`  ${chalk.green('creator file [name]')}     ${styles.info('- Create a new file')}`);
  console.log(`  ${chalk.green('creator folder [name]')}   ${styles.info('- Create a new folder')}`);
  console.log(`  ${chalk.green('creator note [title]')}    ${styles.info('- Create a new note')}`);
  console.log(`  ${chalk.green('creator help')}            ${styles.info('- Show help')}`);
  console.log(`  ${chalk.green('creator version')}         ${styles.info('- Show version')}`);
  console.log('');
  console.log(styles.note('💡 Tip: Run commands without arguments for interactive mode'));
}

function showVersion() {
  const packageJson = require('../package.json');
  console.log(styles.header(`📦 Version: ${packageJson.version}`));
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

module.exports = {
  showHelp,
  showVersion,
  formatFileSize,
  getCurrentTimestamp
};