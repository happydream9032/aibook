import Dexie, { Table } from 'dexie';
// table inteface
export interface Duckdatabase {
  id?: number;
  table_name: string;
  table_data: any;
}
export class IndexDB extends Dexie {
// table name is Duckdatabase 
  duckdatabases!: Table<Duckdatabase>; 
  constructor() {
    super('myDatabase');
    this.version(1).stores({
      duckdatabases: '++id, table_name, table_data'  
    });
  }
}
export const indexDB = new IndexDB(); 