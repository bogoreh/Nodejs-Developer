const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const styles = require('../utils/styles');

async function createNote(title, options) {
  const spinner = ora(styles.info(`Creating note: ${title}...`)).start();
  
  try {
    const timestamp = options.date ? new Date().toISOString().replace(/[:.]/g, '-') : '';
    const filename = options.date 
      ? `${title.replace(/\s+/g, '_')}_${timestamp}.txt`
      : `${title.replace(/\s+/g, '_')}.txt`;
    
    const filePath = path.join(process.cwd(), 'notes', filename);
    
    // Create notes directory if it doesn't exist
    await fs.mkdir(path.join(process.cwd(), 'notes'), { recursive: true });
    
    const content = options.content || '';
    const noteContent = options.date 
      ? `Title: ${title}\nDate: ${new Date().toLocaleString()}\n\n${content}`
      : content;
    
    await fs.writeFile(filePath, noteContent, 'utf8');
    
    spinner.succeed(styles.success(`✅ Note created successfully: ${filename}`));
    console.log(styles.info(`📍 Location: ${filePath}`));
    
    if (options.date) {
      console.log(styles.note(`📅 Created: ${new Date().toLocaleString()}`));
    }
  } catch (error) {
    spinner.fail(styles.error(`❌ Error creating note: ${error.message}`));
  }
}

module.exports = { createNote };