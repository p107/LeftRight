var express = require('express');
var app = express();
var session = require('client-sessions');
var engines = require('consolidate');
var tools = require('./tools');

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here_12345678900',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/js', express.static('assets/js'));
app.use('/css', express.static('assets/css'));

var max = 1000;
var mydata = {};

for (var i = 1; i < max; i++) {
	mydata[i] = 0;
}

//---

function debVotes() {
  var deb = {};
  for (var i in mydata) {
    if (mydata[i] > 0) {
      deb[i] = mydata[i];
    }
  }
  console.log('-- votes\n', deb);
}

//---

app.get('/', function (req, res) {
  var last = req.session.last;
  if (typeof last != 'object') {
    last = tools.newVoting(req, max);
  }
  res.render('index.hbs', { last: last });
});

app.get('/yo/:vote', function (req, res) {
  var vote = parseInt(req.params.vote);
  var valid = false;
  var last = req.session.last;
  if (typeof last == 'object') {
    for (var i in last) {
      if (last[i] == vote) {
        mydata[vote] += 1;
        valid = true;
        break;
      }
    }
  }

  if (valid) {
    debVotes();
    req.session.last = tools.newVoting(req, max);
    res.redirect('/');
  }
  else {
    var msg = ' Your vote is invalid.';
    res.send('vote = ' + vote + ' from ' + JSON.stringify(last, null, 2) + msg);
  }
});

app.get('/yo', function (req, res) {
  var rand = tools.newVoting(req, max);
  res.send(JSON.stringify(rand, null, 2));
});

var server = app.listen(3000, function(){
	console.log('Server running at http://localhost:' + server.address().port);
});
