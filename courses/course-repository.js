import db from "../database/index.js";

const findClasses = async (majorName) =>{

  //let test = majorName.replace("+", " "); 
  let test = majorName + "%";

  const query = 
  `SELECT * FROM courses 
   WHERE major LIKE 'Computer Science%' ;`; 

  const testQ =
  `SELECT * FROM 2024-2025 
   WHERE major like $1  ;`; 
  //const res = await db.query(testQ,[majorName]); 
  const res = await db.query(testQ,[test]);  
  return res.rows;
}

export default findClasses; 