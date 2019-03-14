const express = require('express')
const next = require('next')
const { reviewInfoFor,beersWithReviews } = require(`${__dirname}/utils/query-proxy.js`)
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(() => {
  const server = express()
  server.use(require("body-parser").json())

  server.post('/beerNames', async(req, res, next) => {
     try{
      console.log(req.body)
      let beerNameResults = await beersWithReviews(req.body.query);
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
