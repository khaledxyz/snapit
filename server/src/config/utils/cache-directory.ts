import { platform, homedir } from 'os';
import { join } from 'path';

/**
 * Get the appropriate cache directory for the current platform
 * @param subdir - Subdirectory within the cache directory
 * @returns Full path to the cache directory
 */
export function getCacheDirectory(subdir: string): string {
  const cacheRoot =
    platform() === 'win32'
      ? process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local')
      : process.env.XDG_CACHE_HOME || join(homedir(), '.cache');

  return join(cacheRoot, 'snapit', subdir);
}
