import dotenv from 'dotenv';
import express from 'express'; 
import path from 'path';
import OpenAI from 'openai';
import findClasses from "../courses/course-repository.js"
import * as fs from 'fs';
import bodyParser from 'body-parser'; 
import runDBMigrations from '../database/migrations/index.js'
var  majorLink; 
const app = express(); 
const __dirname = import.meta.dirname;

dotenv.config();

await runDBMigrations();


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

app.get('/test/:major', async (req, res) =>{
  
  //const result = await findClasses(+req.params.major); 
  //res.json(result); 
})


app.post('/majors', async (req,response) =>{
  //majorLink = req.body;
  majorLink = JSON.parse(JSON.stringify(req.body));

  console.log(majorLink.major); 
  const result = await findClasses(majorLink.major); 

  fs.writeFile('MajorData.json', JSON.stringify(result), (err)=>{
    if (err) throw err;
  })
 
response.status(200).send(); 
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


