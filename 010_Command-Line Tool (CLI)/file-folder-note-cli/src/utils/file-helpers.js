import fs from 'fs/promises';
import path from 'path';

export const getFileTemplate = (type, name) => {
  const templates = {
    js: `// ${name}.js\n\nfunction main() {\n  console.log('Hello, World!');\n}\n\nmain();`,
    ts: `// ${name}.ts\n\nconst main = (): void => {\n  console.log('Hello, World!');\n};\n\nmain();`,
    py: `# ${name}.py\n\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`,
    html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${name}</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>`,
    css: `/* ${name}.css */\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}`,
    json: `{\n  "name": "${name}",\n  "version": "1.0.0",\n  "description": ""\n}`,
    md: `# ${name}\n\n## Description\n\nYour content here.`
  };
  
  return templates[type] || '';
};

export const formatNoteContent = (note) => {
  return `---
title: ${note.title}
category: ${note.category}
priority: ${note.priority}
tags: ${note.tags.join(', ')}
created: ${note.timestamp}
id: ${note.id}
---

${note.content}
`;
};