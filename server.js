var express = require('express');
var app = express();

// Disable server self identification (security)
app.disable('x-powered-by');

// Integrate express-handlebars
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('body-parser').urlencoded({
  extended: true
}));

var formidabale = require('formidable');
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret))

// Express configuration
app.set('port', process.env.PORT || 3000); // Set Port
app.use(express.static(__dirname + '/public')); // Set Public Folder



// Express routes definition
app.get('/', function (req, res) { // Create Index Route
  res.render('home');
});
app.get('/about', function (req, res) { // Create About Route
  res.render('about');
});
app.get('/contact', function (req, res) {
  res.render('contact', {
    csrf: 'CSRF token here'
  });
});

app.get('/thankyou', function (req, res) {
  res.render('thankyou');
});

// Express Form Processing middleware definition
app.post('/process', function (req, res) {
  console.log('Form ' + req.query.form);
  console.log('CSRF token: ' + req.body._csrf);
  console.log('Email: ' + req.body.email);
  console.log('Question: ' + req.body.question);
  res.redirect(303, '/thankyou');
})


// Express error handling middleware definition
app.use(function (req, res, next) { //
  console.log('Looking for URL: ' + req.url);
  next();
});
app.use(function (err, req, res, next) {
  console.log('Error: ' + err.message);
  next();
});
app.use(function (req, res) {
  res.type('text/html');
  res.status(404);
  res.render('404');
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.statut(500);
  res.render('500')
});

// Start the server
app.listen(app.get('port'), function () {
  console.log('Express started on https://localhost:' + app.get('port') + ' press Ctrl-C to terminate');
});