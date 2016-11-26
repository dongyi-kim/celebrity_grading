var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var connection = mysql.createConnection({
    host    :'codingmonster.net',
    port : 3306,
    user : 'datamining',
    password : 'dm2016',
    database:'celebrity_grading'
});

connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }else{
        console.log('done');
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('get page');

});

router.post('/', function (req, res) {
  var selection;

  if(req.body.selection=='긍정')
    selection='positive';
  else if(req.body.selection=='부정')
    selection='negative';
  else
    selection='useless';

  console.log(req.body.word);
    var word = req.body.word;
  console.log(selection);

   connection.query('update words set '+selection+'='+selection+'+1 where (word=\''+word+'\')', function (err, result) {
       console.log(result);
    });


    res.render('result', { title: 'Express'});
});

module.exports = router;
