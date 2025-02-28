import express from 'express'; 

alert('help');
async function fetchdata(){
  try{
    const response = await fetch("http://localhost:3000/apis/programs");

    if(!response.ok){
      throw new Error("Could not fetch");
    }
    const data = await response.json(); 

    console.log(data);
  }
  catch(error){
    console.error(error);
  }
}