/** Prefix for VirtualFileSystem entries in localStorage. */
export const FILE_PREFIX = 'pseudocode_file_';

/**
 * Window CustomEvent fired when the interpreter persists file(s) to localStorage
 * (on WRITEFILE/PUTRECORD flush, CLOSEFILE, or end-of-run). `detail.files` lists
 * the changed file names so an open Files panel can refresh live.
 */
export const FILES_CHANGED_EVENT = 'pseudocode:files-changed';
