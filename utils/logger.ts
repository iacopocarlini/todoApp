
class LogManager {

    logs: String[] = [];
    static instance: LogManager;

    public constructor() {

      if (LogManager.instance == null) {
        this.logs = [];
        LogManager.instance = this;
      }
      return LogManager.instance;
    }
  
    public log(logLevel: String, message:any) {
      this.logs.push(message);
      console.log(`${logLevel}: ${message}`);
    }
  
    /*public printLogCount() {
      console.log(`${this.logs.length} Logs`);
    }*/
  }
  
const logger = new LogManager();
Object.freeze(logger);
export default logger;