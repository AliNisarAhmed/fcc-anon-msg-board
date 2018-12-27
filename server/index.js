const express = require('express');
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

app.get('*', (req, res) => {
  res.redirect('/');
});

connect('mongodb://localhost:27017/anon-msg-board')
  .then(() => {
    app.listen(3000, () => console.log('Listening on port 3000!'));
  })
