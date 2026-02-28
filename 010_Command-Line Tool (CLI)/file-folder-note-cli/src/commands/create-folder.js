import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { showSuccess, showError, validateFolderName } from '../utils/index.js';

async function createFolder(name, options) {
  const spinner = createSpinner('Creating folder...').start();
  
  try {
    const folderName = validateFolderName(name);
    const folderPath = path.join(options.path, folderName);
    
    // Check if folder exists
    try {
      await fs.access(folderPath);
      spinner.error({ text: 'Folder already exists!' });
      
      const { overwrite } = await inquirer.prompt({
        type: 'confirm',
        name: 'overwrite',
        message: 'Folder already exists. Merge contents?',
        default: false
      });
      
      if (!overwrite) {
        showInfo('Operation cancelled');
        return;
      }
      
      spinner.start('Merging with existing folder...');
    } catch (error) {
      // Folder doesn't exist, continue
    }
    
    // Create folder
    await fs.mkdir(folderPath, { recursive: options.recursive });
    
    spinner.success({ text: 'Folder created successfully!' });
    showSuccess(`Folder created at: ${chalk.cyan(folderPath)}`);
    
    // Show folder info
    showInfo(`Permissions: ${chalk.yellow('755')}`);
    
  } catch (error) {
    spinner.error({ text: 'Failed to create folder!' });
    showError(error.message);
  }
}

async function interactive() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter folder name:',
      validate: (input) => input.length > 0 ? true : 'Folder name is required'
    },
    {
      type: 'input',
      name: 'path',
      message: 'Enter parent directory path:',
      default: process.cwd()
    },
    {
      type: 'confirm',
      name: 'recursive',
      message: 'Create parent folders if they don\'t exist?',
      default: false
    },
    {
      type: 'confirm',
      name: 'addGitkeep',
      message: 'Add .gitkeep file?',
      default: false,
      when: (answers) => answers.name !== '.gitkeep'
    }
  ]);
  
  await createFolder(answers.name, {
    path: answers.path,
    recursive: answers.recursive
  });
  
  if (answers.addGitkeep) {
    const gitkeepPath = path.join(answers.path, answers.name, '.gitkeep');
    await fs.writeFile(gitkeepPath, '');
    showSuccess('Added .gitkeep file');
  }
}

export default { createFolder, interactive };