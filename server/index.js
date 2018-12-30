const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

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
})

module.exports = app;

connect('mongodb://localhost:27017/anon-msg-board')
  .then(() => {
    app.listen(3000, () => console.log('Listening on port 3000!'));
  })
