export const parseDataTransferItem = async (
  item: DataTransferItem
): Promise<File[]> => {
  // TODO: needs more investigation
  // if (supportsFileSystemAccessAPI) {
  //   return generatorToArray(
  //     readFileHandlesRecursively(item.getAsFileSystemHandle())
  //   );
  // }

  if (supportsWebkitGetAsEntry) {
    // return readFileSystemEntryAsync(item.webkitGetAsEntry());
    const entry = item.webkitGetAsEntry();
    if (entry) {
      return generatorToArray(readFileSystemEntryRecursively(entry));
    }
  }

  const file = item.getAsFile();
  if (file) {
    return [file];
  }

  return [];
};

async function* readFileHandlesRecursively(
  entry: FileSystemHandle
): AsyncGenerator<File> {
  if (isFileSystemFileHanle(entry)) {
    const file = await entry.getFile();
    if (file !== null) {
      // file.relativePath = getRelativePath(entry);
      yield file;
    }
  } else if (isFileSystemDirectoryHandle(entry)) {
    const handles = (entry as any).values();
    for await (const handle of handles) {
      yield* readFileHandlesRecursively(handle);
    }
  }
}

async function* readFileSystemEntryRecursively(
  entry: FileSystemEntry
): AsyncGenerator<File> {
  if (isFileSystemFile(entry)) {
    const file = await new Promise<File>((resolve) => entry.file(resolve));
    yield file;
  } else if (isFileSystemDirectory(entry)) {
    const reader = entry.createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve) =>
      reader.readEntries(resolve)
    );
    for (const entry of entries) {
      yield* readFileSystemEntryRecursively(entry);
    }
  }
}

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

export function isFileSystemDirectoryHandle(
  handle?: FileSystemHandle | null
): handle is FileSystemDirectoryHandle {
  return handle?.kind === 'directory';
}

export function isFileSystemFileHanle(
  handle?: FileSystemHandle | null
): handle is FileSystemFileHandle {
  return handle?.kind === 'file';
}

const supportsFileSystemAccessAPI =
  'getAsFileSystemHandle' in DataTransferItem.prototype;
const supportsWebkitGetAsEntry =
  'webkitGetAsEntry' in DataTransferItem.prototype;

async function generatorToArray<T>(generator: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of generator) items.push(item);
  return items;
}
