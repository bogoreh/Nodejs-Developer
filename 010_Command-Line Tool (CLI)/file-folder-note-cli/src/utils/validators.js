import path from 'path';

export const validateFileName = (name, type) => {
  const extension = type ? `.${type}` : '';
  
  if (path.extname(name)) {
    return name;
  }
  
  return `${name}${extension}`;
};

export const validateFolderName = (name) => {
  // Remove any invalid characters
  const sanitized = name.replace(/[<>:"/\\|?*]/g, '-');
  return sanitized;
};

export const isValidPath = (inputPath) => {
  try {
    path.resolve(inputPath);
    return true;
  } catch {
    return false;
  }
};