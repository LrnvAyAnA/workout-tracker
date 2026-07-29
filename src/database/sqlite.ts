import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";

export const sqlite = new SQLiteConnection(CapacitorSQLite);
let db: SQLiteDBConnection | null = null;

export async function getDatabase() {
  if (db) {
    return db;
  }

  const ret = await sqlite.createConnection(
    "workoutDB",
    false,
    "no-encryption",
    1,
    false,
  );

  await ret.open();

  db = ret;

  return db;
}
