// Fetch function to retrieve data


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


async function fetchData() {
    try {
        const response = await fetch("http://cppdegreeroadmap.com/api/programs");

        if (!response.ok) {
            throw new Error("Could not fetch");
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log("hi");
    }
}
const button = document.getElementById("classbutton");
document.addEventListener("DOMContentLoaded", function () {
    const controlsContainer = document.getElementById("dropdownContainer");

    // Check if dropdown already exists before creating a new one
    if (!document.getElementById("yearDropdown")) {
        const yearDropdown = document.createElement("select");
        yearDropdown.id = "yearDropdown";

        const years = ["2024-2025", "2023-2024", "2022-2023", "2021-2022", "2020-2021"];
        years.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearDropdown.appendChild(option);
        });

        controlsContainer.insertBefore(yearDropdown, controlsContainer.firstChild);
    }
    /*
    const button = document.querySelector("button");
    button.removeEventListener("click", fetchData);
    button.addEventListener("click", async function () {
        const selectedYear = document.getElementById("yearDropdown").value;
        console.log("Selected Year:", selectedYear);

        try {
            const response = await fetch(`http://localhost:3000/api/courses`);

            if (!response.ok) {
                throw new Error("Could not fetch data");
            }

            const data = await response.json();
            console.log(data);
           
            const resultsContainer = document.getElementById("results");
            resultsContainer.innerHTML = "<h2>Available Programs:</h2>";

           
            data.forEach(course => {
                const programElement = document.createElement("p");
                programElement.innerHTML = `<a target="_blank">${course.title}</a>`;
                resultsContainer.appendChild(programElement);
            });

        } catch (error) {
            console.error(error);
        }
    });
    */
});


async function getClasses() {
    const selectedYear = document.getElementById("yearDropdown").value;
    console.log("Selected Year:", selectedYear);
    var nonEssentials = []; 
    try {
        const response = await fetch(`https://cppdegreeroadmap.com/courses`);
        //const response = await fetch(`http://localhost:3000/courses`);
        if (!response.ok) {
            throw new Error("Could not fetch data");
        }

        const data = await response.json();
        //console.log(data);
       
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "<h2>Available Programs:</h2>";
        var header = document.createElement("h3"); 
        header.textContent = "Major Required";
        header.style.textAlign = "left";
        resultsContainer.appendChild(header); 
        var selectAll = document.createElement('input'); 
            selectAll.type="checkbox" 
            selectAll.id="selectAllCheckbox"; 
            selectAll.textContent = "Select All Major Required";
            header.appendChild(selectAll); 
        
            
          document.getElementById('selectAllCheckbox')
                .addEventListener('change', function () {
            let checkboxes = 
                document.querySelectorAll('.MajorRequired');
            checkboxes.forEach(function (checkbox) {
                checkbox.checked = this.checked;
            }, this)});
              

       
        data.forEach(course => {
            //const programElement = document.createElement("p");
            //programElement.innerHTML = `<a target="_blank">${course.title}</a>`;

            if(course.required){

            var linebreak = document.createElement("br");
            const programElement = document.createElement('input'); 
            programElement.type = "checkbox";
            programElement.id = course.title; 
            programElement.className = "MajorRequired";


            var label = document.createElement('label'); 
            //label.style.color = "#C6D5E9"; 
            /*
            if(course.required){
              //console.log("RUN IN")
              label.style.color = "#C6D5E9"; 
              //#C6D5E9
            } */ 

            label.className = "courses"; 
            label.htmlFor = course.title; 
            label.appendChild(document.createTextNode(course.title)); 
            resultsContainer.appendChild(label);
            resultsContainer.appendChild(programElement); 
            resultsContainer.appendChild(linebreak); }
            else{
              nonEssentials.push(course.title); 
            }


        });
        var finallinebreak = document.createElement("br");
        resultsContainer.appendChild(finallinebreak); 
        var nonheader = document.createElement("h3");
        nonheader.textContent = "Electives / Subplans";
        nonheader.style.textAlign = "left";
        resultsContainer.appendChild(nonheader); 
        for(var i = 0; i < nonEssentials.length; i++){
          var linebreak = document.createElement("br");
            const programElement = document.createElement('input'); 
            programElement.type = "checkbox";
            programElement.id = nonEssentials[i]; 


            var label = document.createElement('label'); 
            label.class = 'courses'; 

            label.htmlFor = nonEssentials[i]; 
            label.appendChild(document.createTextNode(nonEssentials[i])); 
            resultsContainer.appendChild(label);
            resultsContainer.appendChild(programElement); 
            resultsContainer.appendChild(linebreak); 
        }
        // Remove previous button if it exists
const oldBtn = document.getElementById("generateRoadmapBtn");
if (oldBtn) oldBtn.remove();

// Add Generate Roadmap button
const generateBtn = document.createElement("button");
generateBtn.id = "generateRoadmapBtn";
generateBtn.textContent = "Generate Roadmap";
generateBtn.style.cssText = `
    margin-top: 15px;
    width: 100%;
    padding: 10px;
    background-color: #144d00;
    color: white;
    border: none;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
`;

resultsContainer.after(generateBtn);
generateBtn.addEventListener("click", generateSemesterPlan);

    } catch (error) {
        console.error(error);
    }
    //return data; 
};


async function buildRoadMap(){
    var lists = []; 
    //var courseNode = {}; 
    var regex = /...? \d{4}\w?/g;
    try {
        const response = await fetch(`http://cppdegreeroadmap.com/courses`);
        const secondRes =  await fetch('http://cppdegreeroadmap.com/reqs'); 
        if(!response.ok){
            throw new Error("could not fetch data")
        }

        const data = await response.json(); 
        const secondData = await secondRes.json();
        //console.log(secondData); 
        data.forEach(course => {
            var courseNode = {}; 
            var coursereqs = []; 
            var courseCode = course.title.match(regex).toString(); 
            courseNode.title = courseCode; 
            //coursereqs.push(courseCode); 

            secondData.forEach(coursePR => {
                //cs 1300
                //is CS 1300 a prereq for a certain course
                //if courseCode.includes(test); 
                // is 2400 a prereq for cs1300
                var test = coursePR.prereq;
                if(test.includes(courseCode)){
                    coursereqs.push(coursePR.title); 
                }
            })
            courseNode.list = coursereqs; 
            lists.push(courseNode); 
        })
        var dataset = JSON.stringify(lists); 
        console.log(dataset)
    } catch (error) {
        console.log(error)
    }
}

async function generateSemesterPlan() {
  const maxUnitsPerSemester = 16;
  const maxCoursesPerSemester = 5;
  var requiredJSON = []; 
  var notRequiredJSON = []; 
  var done = false; 

  const completed = Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
    .map(cb => cb.id.match(/...? \d{4}\w?/g)?.[0]?.trim())
    .filter(Boolean);

    //console.log(completed); 

  const regex = /...? \d{4}\w?/g;
  const response = await fetch('https://cppdegreeroadmap.com/courses');
  //const response = await fetch('http://localhost:3000/courses');
  const courses = await response.json();

  for(var key in courses){
    if(courses[key].required){
      requiredJSON.push(courses[key]); 
    }
    else{
      notRequiredJSON.push(courses[key]); 
    }
  };
  //console.log(requiredJSON); 

  const courseMap = new Map();
  const courseUnits = new Map();

  // Universal deduplication setup
  const exclusiveKeywords = [
    'Senior Project',
    'Capstone',
    'Practice'
  ];
  const selectedKeywords = new Set();

  function isDuplicateByKeyword(title) {
    for (const keyword of exclusiveKeywords) {
      if (title.toLowerCase().includes(keyword.toLowerCase())) {
        if (selectedKeywords.has(keyword)) {
          return true; // skip, already included
        } else {
          selectedKeywords.add(keyword);
          return false; // first time, include
        }
      }
    }
    return false; // no keyword match → include
  }
  //Can use requiredJSON for only making courses with major requirments
  // Filter courses, clean units, skip under 1 unit
  courses.forEach(course => {
    const code = course.title.match(regex)?.[0]?.trim();
    let units = course.units ?? 3;

    // Handle unit ranges like '1-3'
    if (typeof units === 'string' && units.includes('-')) {
      units = parseInt(units.split('-')[0], 10);
    } else if (typeof units === 'string') {
      units = parseFloat(units);
    }

    if (!code || units < 1 || isNaN(units)) return;
    courseMap.set(code, course.title);
    courseUnits.set(code, units);
  });

  completed.forEach(code => courseMap.delete(code));

  const levels = {
    freshman: [],
    sophomore: [],
    junior: [],
    senior: []
  };

  courseMap.forEach((title, code) => {
    const match = code.match(/\d{4}\w?/g);
    const number = match ? parseInt(match[0], 10) : 0;
    if (number >= 4000) levels.senior.push([code, title]);
    else if (number >= 3000) levels.junior.push([code, title]);
    else if (number >= 2000) levels.sophomore.push([code, title]);
    else levels.freshman.push([code, title]);
  });

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

shuffle(levels.freshman);
shuffle(levels.sophomore);
shuffle(levels.junior);
shuffle(levels.senior); 

  //console.log("freshman: " + levels.freshman + "\n"  + "sophomore: " + levels.sophomore)





  const roadmap = [];
  const taken = new Set(completed);

  
  let semester = [];
  let semesterUnits = 0;
  let semesterCourses = 0;

  function tryAddCourses(levelCourses) {
    let remaining = [...levelCourses]; 
    let leftover = [];

    for (const [code, title] of remaining) {
      var u = courseUnits.get(code);
      if (!taken.has(code) && u >= 1 && !isDuplicateByKeyword(title)) {
        if (semesterUnits + u <= maxUnitsPerSemester && semesterCourses + 1 <= maxCoursesPerSemester) {
          if(requiredJSON.length != 0){
            //console.log("Console code is: "  +  code); 
            let re = new RegExp(`\\b${code}\\b`);

          let obj = courses.find(o => o.title.match(re));
          //console.log("FOUND " + obj.title + " who has a prereq of " + obj.prereq); 
            

          semester.push(title);
          semesterUnits += u;
          semesterCourses++;
          taken.add(code);

          if(obj.coreq != "None" && !taken.has(obj.coreq)){
            
            var coreqCode = obj.coreq; 
            re = new RegExp(`\\b${coreqCode}\\b`);
             let coreqTitle = courses.find(o => o.title.match(re));
            u = courseUnits.get(obj.coreq)

            //console.log(coreqTitle.title);

            semester.push(coreqTitle.title);
            semesterUnits += u;
            semesterCourses++;
            taken.add(obj.coreq);
            console.log(coreqCode); 
          }


          requiredJSON.forEach(test => {
            if(test.title.match(regex)?.[0]?.trim() === code){ 
              requiredJSON = requiredJSON.filter(course => course.title != title);
              //console.log(test.title); 
            }
          })
          //console.log(requiredJSON)
        }


        } else {
          leftover.push([code, title]);
        }
      }
    }
    //console.log(taken);

    return leftover;
  }


  function reqCheck(preReqs, takenCourses){
    preReqs = preReqs.split(","); 

    preReqs.forEach(course =>{
      console.log(courses); 
    })
  }


  for (const level of ['freshman', 'sophomore', 'junior', 'senior']) {
    let levelCourses = levels[level];
    while (levelCourses.length > 0) {
      levelCourses = tryAddCourses(levelCourses);
      if (semesterUnits >= maxUnitsPerSemester || semesterCourses >= maxCoursesPerSemester) {
        roadmap.push({ semester, units: semesterUnits });
        semester = [];
        semesterUnits = 0;
        semesterCourses = 0;
      }
    }
  }


  if (semester.length > 0) {
    roadmap.push({ semester, units: semesterUnits });
  }

  const roadmapContainer = document.getElementById("listview");
roadmapContainer.innerHTML = "";

roadmap.forEach((s, i) => {
  const list = document.createElement("li")
  const semesterDiv = document.createElement("div");
  semesterDiv.className = "semester-box";
  list.appendChild(semesterDiv);
  const header = document.createElement("h3");
  header.textContent = `Semester ${i + 1} (${s.units} units)`;
  semesterDiv.appendChild(header);

  const courseList = document.createElement("div");
  courseList.className = "course-list";
  courseList.id = `semester-${i + 1}`;

  s.semester.forEach(c => {
    const item = document.createElement("div");
    item.className = "class-item";
    item.textContent = c;
    courseList.appendChild(item);
  });

  semesterDiv.appendChild(courseList);
  roadmapContainer.appendChild(list);

  
  window.Sortable?.create(courseList, {
    group: "courses",
    animation: 150,
    ghostClass: "ghost"
  });
});

}


if(button){
button.addEventListener("click", getClasses);
//button.addEventListener("click", buildRoadMap);
}
