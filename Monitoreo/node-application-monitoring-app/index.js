const client = require('prom-client');
const express = require('express');
const app = express();
const fetch = require('node-fetch');


app.get('/metrics', async (req, res) => {
  const register = new client.Registry();
 
  const response = await fetch('http://35.225.83.23:8080/metrics');
  const REDIS = await response.text(); //extract JSON from the http response
  var content = "";
  REDIS.split("\n").forEach(element => {
    content+=element+"<br/>";
  });
  const response2 = await fetch('http://104.197.101.28:8080/metrics');
  const MONGO = await response2.text(); //extract JSON from the http response
  MONGO.split("\n").forEach(element => {
    content+=element+"<br/>";
  });

  res.setHeader('Content-Type', register.contentType);
  res.send(REDIS+"\n"+MONGO);
});

// Start the Express server and listen to a port
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080, metrics are exposed on http://localhost:8080/metrics')
});
