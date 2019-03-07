const express = require('express')
const next = require('next')
const beersWithReviews = require(`${__dirname}/beer-names.json`);
const { localBeerDictionaries, beerNames, reviewInfoFor } = require("./query-proxy.js")
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.post('/beersNearMe', async (req, res, next) => {
    try{
      let parsedRequest = JSON.parse(req.headers.body)
      let localBeers = await localBeerDictionaries(parsedRequest)
      console.log(localBeers)
      res.send(localBeers);
    }catch(err){
      console.log(err)
      res.send(JSON.stringify({err: "There was an error with your request."}));
    }
  });  

  server.get('/beerNames', async(req, res, next) => {
     try{
      console.log(req.query.name)
      res.send(beersWithReviews.filter(beer => beer.name.toLowerCase().indexOf(req.query.name) > -1).slice(0,4));
    }catch(err){
      console.log(err)
      res.send(JSON.stringify({err: "There was an error with your request."}));
    }
  });


  server.post('/reviewInfoFor', async (req, res, next) => {
     try{
      let obj = JSON.parse(req.headers.body)
      console.log(obj)
      let reviewInfo = await reviewInfoFor(obj)
      res.send(reviewInfo)
    }catch(err){
      console.log(err)
      res.send(JSON.stringify({err: "There was an error with your request."}));
    }
  });

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  // server.get('/a', (req, res) => {
  //   return app.render(req, res, '/a', req.query)
  // })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
