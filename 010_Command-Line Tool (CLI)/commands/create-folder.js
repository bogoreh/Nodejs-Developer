const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const styles = require('../utils/styles');

async function createFolder(foldername, options) {
  const spinner = ora(styles.info(`Creating folder ${foldername}...`)).start();
  
  try {
    const folderPath = path.join(process.cwd(), options.path || '.', foldername);
    
    await fs.mkdir(folderPath, { recursive: true });
    
    spinner.succeed(styles.success(`✅ Folder created successfully: ${foldername}`));
    console.log(styles.info(`📍 Location: ${folderPath}`));
    
    // Show folder contents
    const contents = await fs.readdir(folderPath);
    if (contents.length > 0) {
      console.log(styles.note(`📁 Contains: ${contents.join(', ')}`));
    }
  } catch (error) {
    spinner.fail(styles.error(`❌ Error creating folder: ${error.message}`));
  }
}

module.exports = { createFolder };