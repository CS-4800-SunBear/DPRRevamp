const pt = require('puppeteer');
const fs = require("fs");




async function clickElement(url){
   const browser = await pt.launch();
   const page = await browser.newPage();
   await page.setViewport({ width: 1000, height: 3000 })
   await page.goto(url);

   const resultLinks =  await page.$$('.acalog-course a');
   for (const el of resultLinks){
    await el.evaluate(b=>b.click()); 
    await page.screenshot({
      path: 'shot.png'
   });
  }

  await page.waitForSelector('.coursepadding > div:nth-child(2)', {visible: true})
     var coursesData = [];
  
     var courseElements = await page.$$('.coursepadding > div:nth-child(2)');
     
     await courseElements.forEach(async (el,index) =>{
        const title = await el.$eval("h3",(el) => el.textContent); 
        const unit = title.substring(title.length-4, title.length-3);
        var preReq = await el.evaluate(el => el.textContent) ?? "";
        var sentenceArray = preReq.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")
        preReq = sentenceArray.filter(sentence => sentence.includes("Prerequisite(s):") ?? "none").toString(); 
        if (preReq === "") {
          preReq = "None"; 
      }
        
        coursesData.push({title,unit,preReq}); 
  
  
        if(await index === courseElements.length-1){
          fs.writeFile(`MajorData.json`, JSON.stringify(coursesData), (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`Data  of  Page Scraped`);
            }
          });
          browser.close(); 
        }
     })
}
clickElement();


