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

var formidable = require('formidable');
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

app.get('/file-upload', function (req, res) {
  var now = new Date();
  res.render('file-upload', {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});

app.post('/file-upload/:year/:month', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, file) {
    if (err) {
      return res.redirect(303, '/form-error');
    }
    console.log('Recieved File.');
    console.log(file);
    res.redirect(303, '/thankyou');
  });
});


// Experimenting with cookies
app.get('/cookie', function (req, res) {
  res.cookie('username', 'Jordan Blakey', {
    expire: new Date() + 9999
  }).send('username has the value of Jordan Blakey');
});

app.get('/listcookies', function (req, res) {
  console.log("Cookies: ", req.cookies);
  res.send('Look in the console for cookies');
});

app.get('/deletecookie', function (req, res) {
  res.clearCookie('username');
  res.send('username Cookie Deleted');
});


// Experimenting with sessions - Counting views
var session = require('express-session');
var parseurl = require('parseurl');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: credentials.cookieSecret,
}));

app.use(function (req, res, next) {
  var views = req.session.views;
  if (!views) {
    views = req.session.views = {};
  }
  var pathname = parseurl(req).pathname;
  views[pathname] = (views[pathname] || 0) + 1;
  next();
});

app.get('/viewcount', function (req, res, next) {
  res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times');
});

// Reading files
var fs = require('fs');
app.get('/readfile', function (req, res, next) {
  fs.readFile('./public/readFile.txt', function (err, data) {
    if (err) {
      return console.error(err);
    }
    res.send('The File: ' + data.toString());
  });
});

app.get('/writefile', function (req, res, next) {
  fs.writeFile('./public/writeFile.txt', 'This is some text written by the npm fs (File System) package, called by an Express route.', function (err) {
    if (err) {
      return console.error(err);
    }
  });

  fs.readFile('./public/writeFile.txt', function (err, data) {
    if (err) {
      return console.error(err);
    }
    res.send('The File: ' + data.toString());
  });
});

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
  res.status(500);
  res.render('500')
});

// Start the server
app.listen(app.get('port'), function () {
  console.log('Express started on https://localhost:' + app.get('port') + ' press Ctrl-C to terminate');
});