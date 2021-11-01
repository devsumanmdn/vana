
import "./index.css";
import { render } from "react-dom";
import App from "./App";
// import "../preload";

declare global {
  interface electronAPI {
    getFilePath: (fileName: string) => string;
    parseDataFile: (filePath: string, defaultData: any) => any;
    writeFile: (filePath: any, data: any) => void;
    readFile: (filePath: any, data: any) => void;
    getArrayOfFiles: (dir: string, filelist?: string[]) => Promise<any[]>;
    getMusicMetaData: (location: string) => Promise<any>;
    openDirDialog: () => Promise<Electron.OpenDialogReturnValue>;
    getDataURL: (location: string, codec: string) => Promise<string>
  }

  interface Window {
    maxBarHeight: number;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    electron: electronAPI;
  }
}

if (process.env.NODE_ENV === "development") {
  module.hot.accept("./App.tsx", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AppHot = require("./App.tsx");
    render(<AppHot />, document.getElementById("root"));
  });
}

render(<App />, document.getElementById("root"));
