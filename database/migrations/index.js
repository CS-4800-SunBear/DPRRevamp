import db from "../index.js"
import makeCourseTable from "./1_create-table.js"

const runDBMigrations = async () => {
  const client = await db.connect(); 

  try {

    await client.query(makeCourseTable); 

    await client.query('COMMIT'); 
  } catch (error) {
    await client.query('ROLLBACK');
    throw error
  }
  finally{
    client.release(); 
  }
}


export default runDBMigrations; 