import express from 'express'
import React from 'react'
import Router from 'react-router'

const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  let router = Router.create({location: res.url, routes: [
    <Route path="/" handler={App}/>
  ]})
  router.run((Handler, state) => {
    let html = React.renderToString(<Handler/>)
    return res.render('index.ejs', { html: html })
  }
  next();
}))

app.listen(port, function () {
  console.log(`Server listening at port ${port}`);
});
