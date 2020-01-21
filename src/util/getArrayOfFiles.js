import { remote } from 'electron';
const fs = remote.require('fs').promises;
const path = remote.require('path');

const walk = async (dir, filelist = []) => {
  const files = await fs.readdir(dir);

  for (let file of files) {
    const filepath = path.join(dir, file);
    const stat = await fs.stat(filepath);

    if (stat.isDirectory()) {
      filelist = await walk(filepath, filelist);
    } else if (
      ['mp3', 'flac', 'ogg', 'webm'].includes(file.split('.').slice(-1)[0])
    ) {
      filelist.push(filepath);
    }
  }

  return filelist;
};

export default walk;
