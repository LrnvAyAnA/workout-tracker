import { useEffect, useState } from "react";
import { getDatabase } from "../database/sqlite";

export function DebugDatabase() {
  const [data, setData] = useState<any[]>([]);

  async function loadExercises() {
    const db = await getDatabase();

    const result = await db.query("SELECT * FROM exercises");

    setData(result.values ?? []);
  }

  useEffect(() => {
    loadExercises();
  }, []);

  return (
    <div>
      <h2>Exercises</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
