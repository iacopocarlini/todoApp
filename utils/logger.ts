
class LogManager {

    static instance: LogManager;
    active: boolean = true; // switch to turn on/off logging

    public constructor() {

      // Singleton pattern
      if (LogManager.instance == null) {
        LogManager.instance = this;
      }
      return LogManager.instance;
    }
  
    public log(logLevel: String, message:any) {
      
      if (!this.active) return;

      /* Log levels:
        - INFO
        - ERROR 
        - OBJECT -> logs the content of a JS object  
      */ 
      if (logLevel != 'OBJECT')
        console.log(`${logLevel}: ${message}`);
      else
        console.log(message);
    }

  }
  
const logger = new LogManager();
Object.freeze(logger);
export default logger;