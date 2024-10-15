export const readFileAsDataURLAsync = (file: File) =>
  new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.onabort = reject;

    reader.readAsDataURL(file);
  });

export const validateFileType = (file: File, acceptTypes: string[]) => {
  if (acceptTypes.includes('*')) {
    return true;
  }

  const acceptFiletypes = acceptTypes.map((item) => item.toLowerCase().trim());
  const filetype = file.type.toLowerCase();
  const filename = file.name.toLowerCase();

  const matchedFileType = acceptFiletypes.find((acceptFiletype) => {
    // check for wildcard mimetype (e.g. image/*)
    if (acceptFiletype.endsWith('/*')) {
      return filetype.split('/')[0] === acceptFiletype.split('/')[0];
    }

    // check for file extension (e.g. .csv)
    if (acceptFiletype.startsWith('.')) {
      return filename.endsWith(acceptFiletype);
    }

    // check for exact mimetype match (e.g. image/jpeg)
    return acceptFiletype === filetype;
  });

  return !!matchedFileType;
};

export const validateFileSize = (
  file: File,
  minFileSize = 1,
  maxFileSize?: number
) => {
  if (file.size < minFileSize) {
    return false;
  }

  if (maxFileSize && file.size > maxFileSize) {
    return false;
  }

  return true;
};
