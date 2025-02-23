import { NextResponse } from "next/server";

//Ethan's api 
export async function GET(){
  const res = await fetch("http://localhost:5000/classes");
  const classes = await res.json();

  return NextResponse.json(classes);
}
