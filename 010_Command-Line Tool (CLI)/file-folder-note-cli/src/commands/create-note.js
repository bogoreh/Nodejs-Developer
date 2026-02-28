import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { showSuccess, showError, formatNoteContent } from '../utils/index.js';
import { NOTE_CATEGORIES, PRIORITY_LEVELS } from '../config/constants.js';

async function createNote(title, options) {
  const spinner = createSpinner('Creating note...').start();
  
  try {
    const timestamp = new Date().toISOString();
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}_${Date.now()}.note`;
    const notesDir = path.join(process.cwd(), 'notes');
    
    // Create notes directory if it doesn't exist
    await fs.mkdir(notesDir, { recursive: true });
    
    const filePath = path.join(notesDir, fileName);
    
    // Get content
    let content = options.content;
    if (options.editor) {
      const { noteContent } = await inquirer.prompt({
        type: 'editor',
        name: 'noteContent',
        message: 'Enter your note content:'
      });
      content = noteContent;
    } else if (!content) {
      const { noteContent } = await inquirer.prompt({
        type: 'input',
        name: 'noteContent',
        message: 'Enter note content (optional):'
      });
      content = noteContent;
    }
    
    // Format note content with metadata
    const formattedNote = formatNoteContent({
      title,
      content: content || '',
      category: options.category,
      priority: options.priority,
      tags: options.tags || [],
      timestamp,
      id: Date.now()
    });
    
    // Write note
    await fs.writeFile(filePath, formattedNote, 'utf8');
    
    spinner.success({ text: 'Note created successfully!' });
    showSuccess(`Note saved at: ${chalk.cyan(filePath)}`);
    
    // Display note preview
    console.log('\n' + chalk.bold('📝 Note Preview:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(formattedNote);
    console.log(chalk.gray('─'.repeat(50)));
    
  } catch (error) {
    spinner.error({ text: 'Failed to create note!' });
    showError(error.message);
  }
}

async function interactive() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter note title:',
      validate: (input) => input.length > 0 ? true : 'Title is required'
    },
    {
      type: 'list',
      name: 'category',
      message: 'Select category:',
      choices: NOTE_CATEGORIES
    },
    {
      type: 'list',
      name: 'priority',
      message: 'Set priority:',
      choices: PRIORITY_LEVELS
    },
    {
      type: 'input',
      name: 'tags',
      message: 'Enter tags (comma-separated):',
      filter: (input) => input.split(',').map(tag => tag.trim()).filter(tag => tag)
    },
    {
      type: 'confirm',
      name: 'editor',
      message: 'Open in editor for multiline content?',
      default: false
    }
  ]);
  
  await createNote(answers.title, {
    category: answers.category,
    priority: answers.priority,
    tags: answers.tags,
    editor: answers.editor
  });
}

export default { createNote, interactive };