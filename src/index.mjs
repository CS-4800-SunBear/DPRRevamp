
import express from 'express'; 
import path from 'path';
import unirest from 'unirest';
import * as cheerio  from 'cheerio';
import * as fs from 'fs';
const app = express(); 
const __dirname = import.meta.dirname;

const PORT = process.env.PORT || 3000; 

app.set({"Content-type:" : "application/javascript"}); 

app.use(express.static(path.join(__dirname, '../public')));
app.use("/node_modules", express.static(path.resolve("node_modules"))); // Expose node_modules

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, '../public/index.html'))
});
app.get("/fetch.js", (request, response) => {
  response.sendFile(path.join(__dirname, './fetch.js'))
});



app.get("/api/classes", (request, response) =>{
  response.send([
    {
      "id": "1",
      "name": "Software Engineering"
    },
    {
      "id": "2",
      "name": "Mobile App Development"
    },
    {
      "id": "3",
      "name": "Undergrad Seminar"
    },
    {
      "id": "4",
      "name": "Cryptography"
    }
  ]);
});

app.get('/api/programs', (request, response) =>{
  response.sendFile(path.join(__dirname, '../programsData.json'))
});

/*
Catalog ID's 

catoid 68, navoid 5719 = 2024-2025
catoid 65, navoid 5519 = 2023-2024
catoid 61, navoid 4876 = 2022-2023
catoid 57, navoid 4359 = 2021-2022
catoid 53, navoid 3983 = 2020-2021

*/

const catalogIDs = new Map([
  ['2024-2025',68],
  ['2023-2024',65],
  ['2022-2023',61],
  ['2021-2022',57],
  ['2020-2021',53]
]); 

const catalogProgramIDs = new Map([
  ['2024-2025',5719],
  ['2023-2024',5519],
  ['2022-2023',4876],
  ['2021-2022',4359],
  ['2020-2021',3972]
]); 

const programsURL = `https://catalog.cpp.edu/content.php?catoid=${catalogIDs.get('2024-2025')}&navoid=${catalogProgramIDs.get('2024-2025')}`;

async function scraper(scraping_url){
  let res; 
  try{
    res = await unirest.get(scraping_url)
      return {body: res.body, status:200}
  }catch(err){
    return{body: 'something went wrong', status: 400}
  }
}

 scraper(programsURL).then((res) => {
  const $ = cheerio.load(res.body)
  const programsList = []; 
  var majors = [];
  const programs = $('.program-list li');
  programs.each((index, el) => {
    const program = {};

    program.title = $(el).find('a').text(); 
    program.link = $(el).find('a').attr('href');
    programsList.push(program);
  });
  majors = programsList.slice(0,108);
  
  fs.writeFile('programsData.json', JSON.stringify(majors), (err)=>{
    if (err) throw err;
  })
    
}).catch((err) => {
  console.log(err)
})
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`)
});