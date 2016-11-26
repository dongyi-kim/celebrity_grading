const MySQL = require('mysql');
const FS    = require('fs');

//read config json file and parse into js object 
const config = JSON.parse(  FS.readFileSync('../config.json', 'utf8') );

//create db connection from db_configuration 
var db = MySQL.createConnection(config.db_config);

//connect to the database 
db.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }else{
        console.log('done');
    }
});
