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
// More Imports Here

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

// Express middleware definition
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