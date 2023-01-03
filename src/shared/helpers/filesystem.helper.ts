export const parseDataTransferItem = async (item: DataTransferItem) => {
  if (typeof item.webkitGetAsEntry === 'function') {
    const entry = item.webkitGetAsEntry();

    if (entry) {
      return readFileSystemEntryAsync(entry);
    }
  }

  const file = item.getAsFile();
  if (file) {
    return [file];
  }

  return [];
};

export const readFileSystemEntryAsync = (entry: FileSystemEntry) =>
  new Promise<File[]>((resolve, reject) => {
    let iterations = 0;
    const files: File[] = [];

    readEntry(entry);

    function readEntry(entry: FileSystemEntry) {
      if (isFileSystemFile(entry)) {
        iterations++;
        entry.file((file) => {
          iterations--;
          files.push(file);

          if (iterations === 0) {
            resolve(files);
          }
        });
      } else if (isFileSystemDirectory(entry)) {
        readReaderContent(entry.createReader());
      }
    }

    function readReaderContent(reader: FileSystemDirectoryReader) {
      iterations++;

      reader.readEntries(function (entries) {
        iterations--;
        for (const entry of entries) {
          readEntry(entry);
        }

        if (iterations === 0) {
          resolve(files);
        }
      }, reject);
    }
  });

export function isFileSystemDirectory(
  entry?: FileSystemEntry | null
): entry is FileSystemDirectoryEntry {
  return !!entry && entry.isDirectory;
}

export function isFileSystemFile(
  entry?: FileSystemEntry | null
): entry is FileSystemFileEntry {
  return !!entry && entry.isFile;
}
