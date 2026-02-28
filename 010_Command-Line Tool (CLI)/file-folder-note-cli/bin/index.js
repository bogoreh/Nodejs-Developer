#!/usr/bin/env node

import { program } from 'commander';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { createSpinner } from 'nanospinner';
import chalk from 'chalk';
import boxen from 'boxen';

import { 
  createFileCommand, 
  createFolderCommand, 
  createNoteCommand 
} from '../src/commands/index.js';
import { showWelcomeBanner } from '../src/utils/styles.js';

// Welcome banner
console.log(
  gradient.pastel.multiline(
    figlet.textSync('File Folder Note CLI', { 
      font: 'Standard',
      horizontalLayout: 'full'
    })
  )
);

console.log(
  boxen(
    chalk.cyan('✨ Create files, folders, and notes with style! ✨'), 
    { 
      padding: 1, 
      margin: 1, 
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  )
);

program
  .version('1.0.0')
  .description('A powerful CLI to create files, folders, and notes')
  .option('-v, --verbose', 'Show detailed output');

// File command
program
  .command('file <name>')
  .alias('f')
  .description('Create a new file')
  .option('-t, --type <type>', 'File type (js, ts, py, html, css, txt, json, md)', 'txt')
  .option('-p, --path <path>', 'Directory path', process.cwd())
  .option('-c, --content <content>', 'Initial content for the file')
  .action(createFileCommand);

// Folder command
program
  .command('folder <name>')
  .alias('d')
  .description('Create a new folder')
  .option('-p, --path <path>', 'Parent directory path', process.cwd())
  .option('-r, --recursive', 'Create parent folders if they don\'t exist', false)
  .action(createFolderCommand);

// Note command
program
  .command('note <title>')
  .alias('n')
  .description('Create a new note')
  .option('-c, --category <category>', 'Note category (work, personal, idea, todo, other)', 'other')
  .option('-p, --priority <priority>', 'Priority level (low, medium, high)', 'medium')
  .option('-t, --tags [tags...]', 'Tags for the note')
  .option('-e, --editor', 'Open in editor for multiline content', false)
  .action(createNoteCommand);

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Launch interactive mode')
  .action(async () => {
    const inquirer = (await import('inquirer')).default;
    
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to create?',
      choices: [
        { name: '📄 File', value: 'file' },
        { name: '📁 Folder', value: 'folder' },
        { name: '📝 Note', value: 'note' },
        { name: '❌ Exit', value: 'exit' }
      ],
      prefix: '🚀'
    });

    switch (action) {
      case 'file':
        await createFileCommand.interactive();
        break;
      case 'folder':
        await createFolderCommand.interactive();
        break;
      case 'note':
        await createNoteCommand.interactive();
        break;
      case 'exit':
        console.log(gradient.rainbow('\n👋 Goodbye! Have a great day!\n'));
        process.exit(0);
    }
  });

program.parse(process.argv);