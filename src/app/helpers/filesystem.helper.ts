export async function parseDataTransferItem(
  item: DataTransferItem
): Promise<File[]> {
  if (supportsFileSystemAccessAPI) {
    // @ts-ignore not yet added to lib.dom.d.ts
    const handle = await item.getAsFileSystemHandle();
    if (handle) {
      return readFileSystemHandlesAsync(handle);
    }
  }

  if (supportsWebkitGetAsEntry) {
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
}

async function readFileSystemHandlesAsync(
  entry: FileSystemHandle
): Promise<File[]> {
  return generatorToArray(readFileSystemHandlesRecursively(entry));
}

async function* readFileSystemHandlesRecursively(
  entry: FileSystemHandle
): AsyncGenerator<File> {
  if (isFileSystemFileHanle(entry)) {
    const file = await entry.getFile();
    if (file) {
      yield file;
    }
  } else if (isFileSystemDirectoryHandle(entry)) {
    // @ts-ignore not yet added to lib.dom.d.ts
    for await (const handle of entry.values()) {
      yield* readFileSystemHandlesRecursively(handle);
    }
  }
}

async function readFileSystemEntryAsync(
  entry: FileSystemEntry
): Promise<File[]> {
  return generatorToArray(readFileSystemEntryRecursively(entry));
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

async function generatorToArray<T>(generator: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of generator) items.push(item);
  return items;
}

export function isFileSystemDirectory(
  entry?: FileSystemEntry | null
): entry is FileSystemDirectoryEntry {
  return entry?.isDirectory === true;
}

export function isFileSystemFile(
  entry?: FileSystemEntry | null
): entry is FileSystemFileEntry {
  return entry?.isFile === true;
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
