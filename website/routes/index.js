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

function structMem(){
    var word;
    var index;
    var total;
}

var rstary = new Array();

connection.query('SELECT * FROM words', function (err, result) {
    console.log(result[0]);
    console.log(result.length);

    for(var a=0;a<result.length;a++){
        rstary[a]= new structMem();
    }

    var tempary = new structMem();

    for(var b=0;b<result.length;b++) {
        rstary[b].word = result[b].word;
        rstary[b].index = b;
        rstary[b].total = result[b].total;
    }
});



/* GET home page. */
router.get('/', function(req, res, next) {
    connection.release;

  var tempary = new structMem();
  for(var i = 0; i<rstary.length-1;i++){
      for(var j = i+1;j<rstary.length;j++){
          if(rstary[i].total>rstary[j].total){
              tempary = rstary[i];
              rstary[i] = rstary[j];
              rstary[j] = tempary;
          }
      }
  }

  var r = Math.floor(Math.random()*20);

    res.render('index', { title: 'Express', data: rstary[r].word });


});

module.exports = router;
