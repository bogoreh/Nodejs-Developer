const chalk = require('chalk');

const styles = {
  // Success messages
  success: (text) => chalk.green.bold(text),
  
  // Error messages
  error: (text) => chalk.red.bold(text),
  
  // Info messages
  info: (text) => chalk.blue(text),
  
  // Warning messages
  warning: (text) => chalk.yellow.bold(text),
  
  // Note messages
  note: (text) => chalk.magenta(text),
  
  // File names
  file: (text) => chalk.cyan(text),
  
  // Folder names
  folder: (text) => chalk.yellow(text),
  
  // Prompts
  promptMessage: (text) => chalk.cyan.bold(text),
  
  // Success icon
  successIcon: () => chalk.green('✓'),
  
  // Error icon
  errorIcon: () => chalk.red('✗'),
  
  // Info icon
  infoIcon: () => chalk.blue('ℹ'),
  
  // Warning icon
  warningIcon: () => chalk.yellow('⚠'),
  
  // Header
  header: (text) => chalk.bold.cyan(text),
  
  // Border
  border: (text) => chalk.gray(text)
};

module.exports = styles;