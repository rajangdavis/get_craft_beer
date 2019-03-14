const express = require('express')
const next = require('next')
const beersWithReviews = require(`${__dirname}/static/beer-names.json`);
const { reviewInfoFor } = require(`${__dirname}/utils/query-proxy.js`)
const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const compression = require('compression') 
const handle = app.getRequestHandler()

var setCustomHeaderFunc = function(req, res, next) {
    if(!req.secure) {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next()
};

app.prepare().then(() => {
  const server = express()
  server.use(compression())
  server.use('*', setCustomHeaderFunc)
  server.use(require("body-parser").json())

  server.post('/beerNames', async(req, res, next) => {
     try{
      console.log(req.body)
      let beerNameResults = beersWithReviews.filter( x => x.name.toLowerCase().indexOf(req.body.query.toLowerCase()) != -1 ).slice(0, 10);
      console.log(beerNameResults);
      res.send(beerNameResults);
    }catch(err){
      console.log(err)
      res.send(JSON.stringify({err: "There was an error with your request."}));
    }
  });


  server.post('/reviewInfoFor', async (req, res, next) => {
     try{
      let reviewInfo = await reviewInfoFor(req.body)
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
