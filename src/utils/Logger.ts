import { isEmpty } from "lodash";

export class Logger {
  static debug(message: any) {
    if (
      process.env.IS_OFFLINE ||
      ["DEBUG"].includes(String(process.env.LOG_LEVEL).toUpperCase())
    ) {
      if (typeof message === "object") {
        const replacer = (_k: any, v: any) => {
          if (v === undefined) {
            return null;
          }
          return v;
        };
        const mssg = JSON.stringify(message, replacer);
        console.log(mssg);
      } else {
        console.log(message);
      }
    }
  }

  static info(message: any) {
    if (
      isEmpty(process.env.LOG_LEVEL) ||
      ["INFO", "DEBUG"].includes(String(process.env.LOG_LEVEL).toUpperCase())
    ) {
      if (typeof message === "object") {
        const replacer = (_k: any, v: any) => {
          if (v === undefined) {
            return null;
          }
          return v;
        };
        const mssg = JSON.stringify(message, replacer);
        console.log(mssg);
      } else {
        console.log(message);
      }
    }
  }

  static error(message: any) {
    if (
      isEmpty(process.env.LOG_LEVEL) ||
      ["INFO", "ERROR", "DEBUG"].includes(
        String(process.env.LOG_LEVEL).toUpperCase()
      )
    ) {
      if (message instanceof Error) {
        console.error(message);
      } else if (typeof message === "object") {
        const replacer = (_k: any, v: any) => {
          if (v === undefined) {
            return null;
          }
          return v;
        };
        const mssg = JSON.stringify(message, replacer);
        console.error(mssg);
      } else {
        console.error(message);
      }
    }
  }
}
