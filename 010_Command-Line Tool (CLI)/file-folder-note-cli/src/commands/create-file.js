import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { 
  showSuccess, 
  showError, 
  showInfo,
  validateFileName,
  getFileTemplate 
} from '../utils/index.js';
import { FILE_EXTENSIONS } from '../config/constants.js';

async function createFile(name, options) {
  const spinner = createSpinner('Creating file...').start();
  
  try {
    const fileName = validateFileName(name, options.type);
    const filePath = path.join(options.path, fileName);
    
    // Check if file exists
    try {
      await fs.access(filePath);
      spinner.error({ text: 'File already exists!' });
      
      const { overwrite } = await inquirer.prompt({
        type: 'confirm',
        name: 'overwrite',
        message: 'File already exists. Overwrite?',
        default: false
      });
      
      if (!overwrite) {
        showInfo('Operation cancelled');
        return;
      }
      
      spinner.start('Overwriting file...');
    } catch (error) {
      // File doesn't exist, continue
    }
    
    // Get content
    let content = options.content;
    if (!content && options.type !== 'txt') {
      content = getFileTemplate(options.type, path.basename(fileName, path.extname(fileName)));
    }
    
    // Create directory if it doesn't exist
    await fs.mkdir(options.path, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, content || '', 'utf8');
    
    spinner.success({ text: 'File created successfully!' });
    showSuccess(`File created at: ${chalk.cyan(filePath)}`);
    
    // Show file preview
    const stats = await fs.stat(filePath);
    showInfo(`Size: ${stats.size} bytes`);
    
  } catch (error) {
    spinner.error({ text: 'Failed to create file!' });
    showError(error.message);
  }
}

async function interactive() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter file name:',
      validate: (input) => input.length > 0 ? true : 'File name is required'
    },
    {
      type: 'list',
      name: 'type',
      message: 'Select file type:',
      choices: Object.entries(FILE_EXTENSIONS).map(([key, value]) => ({
        name: `${key} (${value})`,
        value: value.replace('.', '')
      }))
    },
    {
      type: 'input',
      name: 'path',
      message: 'Enter directory path:',
      default: process.cwd()
    },
    {
      type: 'confirm',
      name: 'addContent',
      message: 'Add initial content?',
      default: false
    },
    {
      type: 'editor',
      name: 'content',
      message: 'Enter file content:',
      when: (answers) => answers.addContent
    }
  ]);
  
  await createFile(answers.name, {
    type: answers.type,
    path: answers.path,
    content: answers.content
  });
}

export default { createFile, interactive };