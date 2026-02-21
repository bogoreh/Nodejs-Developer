#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const { createFile } = require('../commands/create-file');
const { createFolder } = require('../commands/create-folder');
const { createNote } = require('../commands/create-note');
const { showHelp, showVersion } = require('../utils/helpers');
const styles = require('../utils/styles');

// Display banner
console.log(
  chalk.cyan(
    figlet.textSync('File Creator', { 
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })
  )
);

console.log(chalk.yellow('⚡ Your friendly file & folder creator ⚡\n'));

// Set up commander
program
  .version('1.0.0')
  .description('A CLI tool to create files, folders, and notes')
  .option('-v, --version', 'Display version')
  .option('-h, --help', 'Display help');

// File command
program
  .command('file [name]')
  .description('📄 Create a new file')
  .option('-e, --extension <ext>', 'File extension (txt, js, html, css, json)', 'txt')
  .option('-p, --path <path>', 'Custom path for the file', '.')
  .option('-c, --content <content>', 'Initial content for the file')
  .action((name, options) => {
    if (!name) {
      // Interactive mode
      const inquirer = require('inquirer');
      inquirer.prompt([
        {
          type: 'input',
          name: 'filename',
          message: styles.promptMessage('Enter file name:'),
          validate: input => input ? true : 'File name cannot be empty'
        },
        {
          type: 'list',
          name: 'extension',
          message: styles.promptMessage('Select file extension:'),
          choices: ['txt', 'js', 'html', 'css', 'json', 'md']
        },
        {
          type: 'input',
          name: 'content',
          message: styles.promptMessage('Enter initial content (optional):')
        }
      ]).then(answers => {
        createFile(answers.filename, {
          extension: answers.extension,
          content: answers.content
        });
      });
    } else {
      createFile(name, options);
    }
  });

// Folder command
program
  .command('folder [name]')
  .description('📁 Create a new folder')
  .option('-p, --path <path>', 'Custom path for the folder', '.')
  .action((name, options) => {
    if (!name) {
      const inquirer = require('inquirer');
      inquirer.prompt([
        {
          type: 'input',
          name: 'foldername',
          message: styles.promptMessage('Enter folder name:'),
          validate: input => input ? true : 'Folder name cannot be empty'
        },
        {
          type: 'confirm',
          name: 'createSubfolder',
          message: styles.promptMessage('Do you want to create a subfolder?'),
          default: false
        },
        {
          type: 'input',
          name: 'subfolder',
          message: styles.promptMessage('Enter subfolder name:'),
          when: answers => answers.createSubfolder
        }
      ]).then(answers => {
        createFolder(answers.foldername, options);
        if (answers.subfolder) {
          createFolder(`${answers.foldername}/${answers.subfolder}`, options);
        }
      });
    } else {
      createFolder(name, options);
    }
  });

// Note command
program
  .command('note [title]')
  .description('📝 Create a quick note')
  .option('-c, --content <content>', 'Note content')
  .option('-d, --date', 'Add timestamp to note', false)
  .action((title, options) => {
    if (!title) {
      const inquirer = require('inquirer');
      inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: styles.promptMessage('Enter note title:'),
          validate: input => input ? true : 'Title cannot be empty'
        },
        {
          type: 'editor',
          name: 'content',
          message: styles.promptMessage('Enter note content (opens in editor):')
        },
        {
          type: 'confirm',
          name: 'addTimestamp',
          message: styles.promptMessage('Add timestamp to note?'),
          default: true
        }
      ]).then(answers => {
        createNote(answers.title, {
          content: answers.content,
          date: answers.addTimestamp
        });
      });
    } else {
      createNote(title, options);
    }
  });

// Custom help
program.on('--help', () => {
  console.log('');
  console.log(chalk.green('📚 Examples:'));
  console.log('  $ creator file myfile --extension js');
  console.log('  $ creator folder myfolder');
  console.log('  $ creator note "Meeting Notes" --content "Discuss project"');
  console.log('');
  console.log(chalk.yellow('💡 Tip: Run commands without arguments for interactive mode'));
});

// Parse arguments
program.parse(process.argv);

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}