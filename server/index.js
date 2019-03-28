const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const connect = require('./connect');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', express.static('dist'));


app.use('/api/', apiRoutes);


// Sample front end routes

app.get('/', (req, res) => {
  res.render(process.cwd() + '/dist/index.html');
});

// Catchall route

// app.get('/*', (req, res) => {
//   res.redirect('/');
// });

app.get('/*', function(req, res) {
  console.log(__dirname);
  res.sendFile(process.cwd() + '/dist/index.html', function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});

let port = process.env.PORT || 3000;

module.exports = app;


connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => console.log('Listening on port ' + port));
  })
