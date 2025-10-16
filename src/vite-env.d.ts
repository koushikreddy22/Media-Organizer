/// <reference types="vite/client" />
export {};

declare global {
  interface Window {
    electronAPI: {
      getAppPath: () => Promise<string>;
      selectPath: () => Promise<string>;
      operateOnPath: (path: string) => Promise<any>;
      sendAppUrl?: (url: string) => void;

      // backend actions
      on: (channel: string, callback: (...args: any[]) => void) => void;
      off: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}
