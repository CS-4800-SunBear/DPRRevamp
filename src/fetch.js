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
        const response = await fetch("http://localhost:3000/api/programs");

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
    return data; 
};
if(button){
button.addEventListener("click", getClasses);
}