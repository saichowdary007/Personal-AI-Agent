const fs = require('fs');
const path = require('path');

// Configuration
const searchString = 'http://localhost:8001';
const replaceString = 'https://personal-ai-agent-0wsk.onrender.com';
const directoriesToSearch = ['app/api'];

// Function to recursively search for files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to update file content
function updateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(searchString)) {
      const updatedContent = content.replace(new RegExp(searchString, 'g'), replaceString);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  let fileCount = 0;
  let updatedCount = 0;
  
  directoriesToSearch.forEach(dir => {
    const files = findFiles(dir);
    fileCount += files.length;
    
    files.forEach(file => {
      if (updateFile(file)) {
        updatedCount++;
      }
    });
  });
  
  console.log(`\nProcessed ${fileCount} files, updated ${updatedCount} files.`);
}

main(); 