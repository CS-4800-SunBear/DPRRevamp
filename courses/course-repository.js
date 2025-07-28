import db from "../database/index.js";

const findClasses = async (majorName,programYear) =>{

  //let test = majorName.replace("+", " "); 
  let test = majorName + "%";
  console.log(test); 
    const Query2025 =
    `SELECT * FROM courses2025
    WHERE major like $1  
    ORDER BY title ASC;`; 

    const Query2024 =
    `SELECT * FROM courses2024
      WHERE major like $1  
      ORDER BY title ASC;`;  

    const Query2023 =
    `SELECT * FROM courses2023
      WHERE major like $1  
      ORDER BY title ASC;`;  

    const Query2022 =
   `SELECT * FROM courses2022
    WHERE major like $1  
    ORDER BY title ASC;`; 

    const Queries = new Map([
      ['2024-2025',Query2025],
      ['2023-2024',Query2024],
      ['2022-2023',Query2023],
      ['2021-2022',Query2022],
    ]); 

    const selectQ = Queries.get(programYear); 
  const res = await db.query(selectQ,[test]); 
  console.log(res);
  return res.rows;
}


const getPrereqs = async (majorName,programYear) =>{

  //let test = majorName.replace("+", " "); 
  let test = majorName + "%";
    const Query2025 =
    `SELECT title, prereq, coreq
    FROM courses2025
    WHERE major LIKE $1 AND
    title IN (
    SELECT title FROM courses2025 WHERE 
    prereq NOT LIKE 'None' OR coreq NOT LIKE 'None')`; 

    const Query2024 =
    `SELECT title, prereq, coreq
    FROM courses2024
    WHERE major LIKE $1 AND
    title IN (
    SELECT title FROM courses2024 WHERE 
    prereq NOT LIKE 'None' OR coreq NOT LIKE 'None')`; 

    const Query2023 =
    `SELECT title, prereq, coreq 
    FROM courses2023
    WHERE major LIKE $1 AND
    title IN (
    SELECT title FROM courses2023 WHERE 
    prereq NOT LIKE 'None' OR coreq NOT LIKE 'None')`; 

    const Query2022 =
    `SELECT title, prereq, coreq 
    FROM courses2022
    WHERE major LIKE $1 AND
    title IN (
    SELECT title FROM courses2022 WHERE 
    prereq NOT LIKE 'None' OR coreq NOT LIKE 'None')`; 

    const Queries = new Map([
      ['2024-2025',Query2025],
      ['2023-2024',Query2024],
      ['2022-2023',Query2023],
      ['2021-2022',Query2022],
    ]); 

    const selectQ = Queries.get(programYear); 
  const res = await db.query(selectQ,[test]); 
  
  return res.rows;
}

export {getPrereqs}; 

export default findClasses; 