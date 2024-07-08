const express = require('express')
const router = express.Router()
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer');
const chromium = require('chromium');

router.post('/', async (req, res) => {


  try {
    
    // const salt = await bcrypt.genSalt(10)
    // const hash = await bcrypt.hash(req.body.password, salt)
    // const data = {
    //     username: req.body.username,
    //     password: hash,
    // }

    // const admin = await Admin.create(data)
    // admin.save()


    // const urlChecker = (resultArray) => {
    //     return resultArray.some(result => result.url.includes(req.body.website));
    //   };

    // // const rank = await ego.rank({  delay: 5000, phrase: req.body.keyword,domain: req.body.website})
    // const rank = await ranking.getGoogleRanking(req.body.keyword, urlChecker)

    // console.log(rank)
    // res.send(rank)

    // const searchPhrase = 'OpenAI ChatGPT';
    // const urlCheckerString = 'openai.com'; // The URL should contain this string

    // ranking.getGoogleResults(searchPhrase, urlCheckerString, (error, result) => {
    //     if (error) {
    //         console.error('Error:', error);
    //     } else if (result) {
    //         console.log('Result:', result);
    //     } else {
    //         console.log('No match found.');
    //     }
    // });


    async function getGoogleRankingForWebsite(keyword, website) {
   
      const browser = await puppeteer.launch({
        executablePath:chromium.path,
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });



    
      const page = await browser.newPage();



      // await page.setRequestInterception(true);
      // page.on('request', (req) => {
      //   const resourceType = req.resourceType();
      //   if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
      //     req.abort();
      //   } else {
      //     req.continue();
      //   }
      // });

      
      const maxPages = 10;
      let results = [];
      let found = false;






    
      for (let i = 0; i < maxPages && !found; i++) {
        const start = i * 10; // Google search results are usually displayed 10 per page
        try {
          await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${start}&gl=${req.body.googleRegion}`, { timeout: 40000 });
        } catch (error) {
          console.error(`Error navigating to page ${i}:`, error);
          continue; // Skip this iteration and proceed to the next
        }
        const pageResults = await page.evaluate((start) => {
          const resultsArray = [];
          const items = document.querySelectorAll('.g');
          items.forEach((item, index) => {
            const title = item.querySelector('h3') ? item.querySelector('h3').innerText : null;
            const url = item.querySelector('a') ? item.querySelector('a').href : null;
            
            let descriptionElement = item.querySelector('.IsZvec') 
            || item.querySelector('.aCOpRe') 
            || item.querySelector('.VwiC3b') 
            || item.querySelector('.BNeawe')
            || item.querySelector('.yDYNvb.lEBKkf');
          
          const description = descriptionElement ? descriptionElement.innerText : null;



            if (title && url) {
              resultsArray.push({
                title,
                url,
                description,
                ranking: index + 1 + start // Adjust the ranking to account for the page number
              });
            }
          });
          return resultsArray;
        }, start); // Pass start into the page.evaluate context
    
        results = results.concat(pageResults);
    
        // Check if the website is in the current page results
        found = pageResults.some(result => result.url.includes(website));
      }
    
      await browser.close();
    
      const result = results.find(result => result.url.includes(website));
      return result ? result : { title: null, url: null, description: null, ranking: -1 };
    }
    
    
      
      // Example usage
      const keyword = req.body.keyword;
      const website = req.body.website;
      
    //   getGoogleRankingForWebsite(keyword, website)
    //     .then(() => console.log('Search completed'))
    //     .catch(err => console.error('Error:', err));



    
      const rank = await getGoogleRankingForWebsite(keyword,website)
      // const {title,url,ranking} = rank
      res.send(rank)



      
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Some internal server error")
  }

})


module.exports = router