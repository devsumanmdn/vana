class JSONStore {
  path!: string;
  data: unknown;

  private constructor() {}

  static async create({
    fileName,
    defaultData = {},
  }: {
    fileName: string;
    defaultData?: unknown;
  }): Promise<JSONStore> {
    const inst = new JSONStore();
    inst.path = await window.electron.getFilePath(fileName);
    inst.data = await window.electron.parseDataFile(inst.path, defaultData);
    return inst;
  }

  get(key?: string): unknown {
    if (key) {
      return (this.data as Record<string, unknown>)[key];
    }
    return this.data;
  }

  async set(key: unknown, val: unknown): Promise<void> {
    if (key) {
      (this.data as Record<string, unknown>)[key as string] = val as unknown;
    } else {
      this.data = val;
    }
    await window.electron.writeFile(this.path, JSON.stringify(this.data));
  }
}

export default JSONStore;
