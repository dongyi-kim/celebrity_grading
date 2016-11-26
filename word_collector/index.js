const MySQL = require('mysql');

var connection = MySQL.createConnection({
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
