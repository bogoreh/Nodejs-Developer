const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const styles = require('../utils/styles');

async function createFile(filename, options) {
  const spinner = ora(styles.info(`Creating file ${filename}.${options.extension}...`)).start();
  
  try {
    const filePath = path.join(process.cwd(), options.path || '.', `${filename}.${options.extension}`);
    const content = options.content || '';
    
    await fs.writeFile(filePath, content, 'utf8');
    
    spinner.succeed(styles.success(`✅ File created successfully: ${filename}.${options.extension}`));
    console.log(styles.info(`📍 Location: ${filePath}`));
    
    if (content) {
      console.log(styles.note(`📝 Content: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`));
    }
  } catch (error) {
    spinner.fail(styles.error(`❌ Error creating file: ${error.message}`));
  }
}

module.exports = { createFile };