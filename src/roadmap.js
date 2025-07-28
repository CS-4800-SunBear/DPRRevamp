//https://cppdegreeroadmap.com/
//http://cppdegreeroadmap.com/

async function buildRoadMap(){
  var lists = [];
  var mermaid = [];
  mermaid.push('graph TD\n')
  //var courseNode = {}; 
  var regex = /...? \d{4}\w?/g;
  try {
      const response = await fetch(`https://cppdegreeroadmap.com/courses`);
      const secondRes =  await fetch('https://cppdegreeroadmap.com/reqs'); 
      if(!response.ok){
          throw new Error("could not fetch data")
      }

      const data = await response.json(); 
      const secondData = await secondRes.json();
      //console.log(secondData); 
      data.forEach(course => {
          var node = ""; 
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

              //console.log(coursePR.title);
              if(test.includes(courseCode)){
                  coursereqs.push(coursePR.title); 
                  var title = coursePR.title.match(regex).toString(); 
                  node = `${courseCode.replaceAll(" ", "")} -->  ${title.replaceAll(" ", "")}\n`;
                  mermaid.push(node); 
              }
          })
          courseNode.list = coursereqs; 
          lists.push(courseNode); 
          
          /*

          var test = coursePR.title; 
          if(test.includes(courseCode)){
            //coursereqs = coursePR.prereq.split(","); 
            coursereqs.push(coursePR.prereq);
          }
        })
          courseNode.list = coursereqs; 
          lists.push(courseNode)
            
            */
      })
      //var dataset = JSON.stringify(lists); 

      //console.log(mermaid.join(""));
      return lists; 
  } catch (error) {
      console.log(error)
  }
}




export default buildRoadMap; 