

alert('help');
//fetchData(); 
async function fetchData(){
  try{
    const response = await fetch("http://localhost:3000/api/programs");

    if(!response.ok){
      throw new Error("Could not fetch");
    }
    const data = await response.json(); 

    console.log(data);
  }
  catch(error){
    console.error(error);
    console.log('hi')
  }
}

document.querySelector('button').addEventListener('click', fetchData)