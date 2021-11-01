class JSONStore {
  path: string;
  data: any;
  constructor({ fileName, defaultData = {} }: { fileName: string, defaultData?: any }) {
    this.path = window.electron.getFilePath(fileName);
    this.data = window.electron.parseDataFile(this.path, defaultData);
  }

  get(key?: string): any {
    if (key) {
      return this.data[key];
    }
    return this.data;
  }

  set(key, val): void {
    if (key) {
      this.data[key] = val;
    } else {
      this.data = val;
    }

    window.electron.writeFile(this.path, JSON.stringify(this.data));
  }
}

// expose the class
export default JSONStore;
