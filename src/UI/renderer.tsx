import "./index.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { initStore } from "./redux/store";
import type { MusicMetadataForUi } from "../shared/music-metadata";

declare global {
  interface ElectronAPI {
    getFilePath: (fileName: string) => Promise<string>;
    parseDataFile: (filePath: string, defaultData: unknown) => Promise<unknown>;
    writeFile: (filePath: string, data: string) => Promise<void>;
    getArrayOfFiles: (dir: string) => Promise<string[]>;
    getMusicMetaData: (location: string) => Promise<MusicMetadataForUi>;
    openDirDialog: () => Promise<Electron.OpenDialogReturnValue>;
    getDataURL: (location: string, codec: string) => Promise<string>;
  }

  interface Window {
    maxBarHeight: number;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: unknown;
    electron: ElectronAPI;
  }
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Missing #root element");
}
const root = createRoot(container);

void initStore().then((store) => {
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

if (process.env.NODE_ENV === "development") {
  module.hot.accept("./App.tsx", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AppHot = require("./App.tsx").default;
    void initStore().then((store) => {
      root.render(
        <Provider store={store}>
          <AppHot />
        </Provider>
      );
    });
  });
}
