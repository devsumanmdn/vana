const electron = require('electron');
const path = require('path');
const fs = require('fs');

function parseDataFile(filePath, defaultData) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    // if there was some kind of error, return the passed in defaultData instead.
    return defaultData;
  }
}

class JSONStore {
  constructor({ fileName, defaultData = {} }) {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    );
    this.path = path.join(userDataPath, `${fileName}.json`);

    this.data = parseDataFile(this.path, defaultData);
  }

  get(key) {
    if (key) {
      return this.data[key];
    }
    return this.data;
  }

  set(key, val) {
    if (key) {
      this.data[key] = val;
    } else {
      this.data = val;
    }
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

// expose the class
export default JSONStore;
