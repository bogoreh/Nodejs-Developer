import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';

export const showSuccess = (message) => {
  console.log(boxen(
    chalk.green(`✅ ${message}`),
    { padding: 1, margin: 1, borderColor: 'green', borderStyle: 'round' }
  ));
};

export const showError = (message) => {
  console.log(boxen(
    chalk.red(`❌ Error: ${message}`),
    { padding: 1, margin: 1, borderColor: 'red', borderStyle: 'round' }
  ));
};

export const showInfo = (message) => {
  console.log(boxen(
    chalk.blue(`ℹ️  ${message}`),
    { padding: 1, margin: 1, borderColor: 'blue', borderStyle: 'round' }
  ));
};

export const showWarning = (message) => {
  console.log(boxen(
    chalk.yellow(`⚠️  ${message}`),
    { padding: 1, margin: 1, borderColor: 'yellow', borderStyle: 'round' }
  ));
};

export const showWelcomeBanner = () => {
  console.log(
    gradient.pastel.multiline(
      '✨ File Folder Note CLI ✨'
    )
  );
};

export const formatNoteContent = (note) => {
  return `
${chalk.bold('📌 Title:')} ${note.title}
${chalk.bold('📁 Category:')} ${note.category}
${chalk.bold('⚡ Priority:')} ${note.priority}
${chalk.bold('🏷️ Tags:')} ${note.tags.join(', ') || 'none'}
${chalk.bold('📅 Created:')} ${new Date(note.timestamp).toLocaleString()}
${chalk.bold('🆔 ID:')} ${note.id}

${chalk.bold('📝 Content:')}
${note.content || '(empty)'}
`;
};