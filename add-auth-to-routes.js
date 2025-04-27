const fs = require('fs');
const path = require('path');

// Configuration
const directoriesToSearch = ['app/api'];

// Function to recursively search for files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file === 'route.ts') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Auth code to add to routes that don't have it
const authHeaderCode = `
  // Get the token from the Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
`;

const authHeadersCode = `'Authorization': \`Bearer \${token}\`,`;

// Function to update file content
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Skip files that already have auth
    if (content.includes("req.headers.get('authorization')")) {
      console.log(`Skipping (already has auth): ${filePath}`);
      return false;
    }
    
    // Add auth header check before fetch calls
    if (content.includes("const backendUrl =") && 
        !content.includes("const token =")) {
      
      const fetchPattern = /const backendUrl =[^\n]*\n(\s*)/g;
      content = content.replace(fetchPattern, (match, whitespace) => {
        return match + authHeaderCode + whitespace;
      });
      updated = true;
    }
    
    // Add auth header to fetch calls
    if (content.includes("'Content-Type': 'application/json'") && 
        !content.includes("'Authorization': `Bearer ${token}`")) {
        
      const headersPattern = /'Content-Type': 'application\/json'(,?)\n(\s*)/g;
      content = content.replace(headersPattern, (match, comma, whitespace) => {
        return `'Content-Type': 'application/json',\n${whitespace}${authHeadersCode}\n${whitespace}`;
      });
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
      return true;
    } else {
      console.log(`No updates needed: ${filePath}`);
      return false;
    }
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