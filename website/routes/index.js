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

var rstword = new Array();
var rsttotal = new Array();

connection.query('SELECT * FROM words', function (err, result) {
    console.log(result[0]);
    for(var i=0;i<result.length;i++){
        rstword[i]=result[i].word;
        rsttotal[i]=result[i].total;
    }
});

console.log(rstword[0]+', '+rsttotal[0]);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
