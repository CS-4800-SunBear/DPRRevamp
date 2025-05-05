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
    try {
        const response = await fetch(`http://cppdegreeroadmap.com/courses`);
        //const response = await fetch(`http://localhost:3000/courses`);
        if (!response.ok) {
            throw new Error("Could not fetch data");
        }

        const data = await response.json();
        //console.log(data);
       
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "<h2>Available Programs:</h2>";

       
        data.forEach(course => {
            //const programElement = document.createElement("p");
            //programElement.innerHTML = `<a target="_blank">${course.title}</a>`;
            var linebreak = document.createElement("br");
            const programElement = document.createElement('input'); 
            programElement.type = "checkbox";
            programElement.id = course.title; 

            var label = document.createElement('label'); 

            label.htmlFor = course.title; 
            label.appendChild(document.createTextNode(course.title)); 
            resultsContainer.appendChild(label);
            resultsContainer.appendChild(programElement); 
            resultsContainer.appendChild(linebreak); 

        });
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
    background-color: #007bff;
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
  const maxUnitsPerSemester = 18;
  const maxCoursesPerSemester = 6;

  const completed = Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
    .map(cb => cb.id.match(/...? \d{4}\w?/g)?.[0]?.trim())
    .filter(Boolean);

  const regex = /...? \d{4}\w?/g;
  const response = await fetch('http://cppdegreeroadmap.com/courses');
  //const response = await fetch('http://localhost:3000/courses');
  const courses = await response.json();

  const courseMap = new Map();
  const courseUnits = new Map();

  // Universal deduplication setup
  const exclusiveKeywords = [
    'Senior Project',
    'Software Engineering',
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
    const match = code.match(/\d{4}/);
    const number = match ? parseInt(match[0], 10) : 0;
    if (number >= 4000) levels.senior.push([code, title]);
    else if (number >= 3000) levels.junior.push([code, title]);
    else if (number >= 2000) levels.sophomore.push([code, title]);
    else levels.freshman.push([code, title]);
  });

  const roadmap = [];
  const taken = new Set(completed);

  let semester = [];
  let semesterUnits = 0;
  let semesterCourses = 0;

  function tryAddCourses(levelCourses) {
    let remaining = [...levelCourses];
    let leftover = [];

    for (const [code, title] of remaining) {
      const u = courseUnits.get(code);
      if (!taken.has(code) && u >= 1 && !isDuplicateByKeyword(title)) {
        if (semesterUnits + u <= maxUnitsPerSemester && semesterCourses + 1 <= maxCoursesPerSemester) {
          semester.push(title);
          semesterUnits += u;
          semesterCourses++;
          taken.add(code);
        } else {
          leftover.push([code, title]);
        }
      }
    }

    return leftover;
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
