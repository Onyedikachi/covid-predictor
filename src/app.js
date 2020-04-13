const express = require('express');
const bodyParser = require('body-parser');
const xmlParser = require('fast-xml-parser').j2xParser;

const path = require('path');

const app = express();
const { covid19ImpactEstimator } = require('./estimator');

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '52428800' }));

const publicPath = path.join(__dirname, './public');
app.use(express.static(publicPath));
app.use('/', (req, res) => {
  const { data } = req.body;

  const estimate = covid19ImpactEstimator(data);

  res.status(200).json(estimate);
});
app.get('/json', (req, res) => {
  const { data } = req.body;

  const estimate = covid19ImpactEstimator(data);

  return res.status(200).json(estimate);
});
app.get('/xml', (req, res) => {
  const { data } = req.body;

  const estimate = covid19ImpactEstimator(data);
  const xml = xmlParser.parse(estimate);
  res.set('Content-Type', 'text/xml');
  res.send(xml);
});

app.listen(port, () => console.info('APP RUNNING ON ', port));
