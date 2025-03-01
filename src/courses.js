
import unirest from 'unirest';
import * as cheerio  from 'cheerio';
import * as fs from 'fs';



async function scraper(scraping_url){
  let res; 
  try{
    res = await unirest.get(scraping_url)
      return {body: res.body, status:200}
  }catch(err){
    return{body: 'something went wrong', status: 400}
  }
}

const coursesURL = 'https://catalog.cpp.edu/preview_program.php?catoid=68&poid=18690&returnto=5719';

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

  console.log(CourseList);

  /*
  fs.writeFile('MajorData.json', JSON.stringify(majors), (err)=>{
    if (err) throw err;
  })
    */ 
    
    
}).catch((err) => {
  console.log(err)
})
