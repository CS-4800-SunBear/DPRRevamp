
import express from 'express'; 
import path from 'path';
import unirest from 'unirest';
import OpenAI from 'openai';
import dotenv from 'dotenv'
import * as cheerio  from 'cheerio';
import * as fs from 'fs';
import bodyParser from 'body-parser';
var  majorLink; 
const app = express(); 
const __dirname = import.meta.dirname;

dotenv.config();

const PORT = process.env.PORT || 3000; 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
/* commenting out for now
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
*/

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`)
});
app.set({"Content-type:" : "application/javascript"}); 

app.use(express.static(path.join(__dirname, '../public')));
app.use("/node_modules", express.static(path.resolve("node_modules"))); // Expose node_modules
//app.use(express.json());
//app.use(express.text());
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, '../public/index.html'))
});
app.get("/fetch.js", (request, response) => {
  response.sendFile(path.join(__dirname, './fetch.js'))
});

app.get("/programs", (req, res) => {
  fs.readFile("programsData.json", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to load data" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.get("/courses", (req, res) => {
  fs.readFile("MajorData.json", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to load data" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});


app.post('/majors', (req,res) =>{
  //majorLink = req.body;
  majorLink = JSON.parse(JSON.stringify(req.body));

  const coursesURL = `https://catalog.cpp.edu/${majorLink.major}`;
 scraper(coursesURL).then((res) => {
  const $ = cheerio.load(res.body)
  const CourseList = []; 
  //var majors = [];
  const courses = $('.acalog-course');
  courses.each((index, el) => {
    const course = {};
    course.title = $(el).find('a').text(); 
    CourseList.push(course);
  });
  fs.writeFile('MajorData.json', JSON.stringify(CourseList), (err)=>{
    if (err) throw err;
  })   
}).catch((err) => {
  console.log(err)
})


})

app.get('/api/programs', (request, response) =>{
  response.sendFile(path.join(__dirname, '../programsData.json'))
});

app.get('/api/courses', (request, response) =>{
  response.sendFile(path.join(__dirname, '../MajorData.json'))
});

/* Commenting out to avoid needing the openai key.
app.get("/openai-test", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "what electives should i take a computer science major interested in cybersecurity?" }],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Something went wrong with OpenAI API" });
  }
});
*/

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
//const selectedYear = document.getElementById("yearDropdown").value;

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
  console.log("run");
  
  fs.writeFile('programsData.json', JSON.stringify(majors), (err)=>{
    if (err) throw err;
  })
    
}).catch((err) => {
  console.log(err)
})

