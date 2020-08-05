class Database {
  private dbSelect: string = '';
  private dbCommand: string = '';
  private databaseResult: any = null;

  constructor() {}

  public setDatabase = (dbname: string) => {
    this.dbSelect = dbname;
  };

  public getDatabase = () => {
    return this.dbSelect;
  };

  public setCommand = (command: string) => {
    this.dbCommand = command;
  };

  public getCommand = () => {
    return this.dbCommand;
  };

  public setdatabaseResult = (database: string) => {
    this.databaseResult = database;
  };

  public getdatabaseResult = () => {
    return this.databaseResult;
  };
}

const SelectDatabase = new Database();

export { SelectDatabase };
