
const MySQL = require('mysql');
const FS    = require('fs');
const async = require('async');
const config = JSON.parse(  FS.readFileSync('../config.json', 'utf8') );

var db = MySQL.createConnection(config.db_config);

db.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }else{
        console.log('done');
    }
});

var idfs = {}; 


async.series(
    [
        function(callback)
        {
            var query = db.query('SELECT word, name FROM frequency', function(err, rows)
            {
                callback(err, rows);
            });
        },
        function(callback)
        {
            var query = db.query('SELECT DISTINCT name FROM frequency', function(err, rows)
            {
                callback(err, rows);
            });
        },
        function(callback)
        {
            var query = db.query('SELECT DISTINCT word FROM frequency', function(err, rows)
            {
                callback(err, rows);
            });
        }
    ],
    function(err, results)
    {
        if(err){
            console.log(err!);
            return;
        }

        var pairs = results[0];
        var names = results[1];
        var terms = results[2];

        var D = names.length.toFixed(2);
        var T = terms.length.toFixed(2);

        var task_idf = [];
        terms.forEach(function(e)
        {
            const word = e.word;
            task_idf.push(function(callback)
            {
                const sql = `SELECT count(*) FROM frequency WHERE word = '${word}';`;
                var query = db.query(sql, function(err, rows)
                {
                    var idf = Math.log10(  D / rows[0].count );
                    idfs[word] = idf;
                    const sql2 = `UPDATE words SET idf = ${idf} WHERE word = '${word}';`;
                    var query2 = db.query(sql, function(err, rows)
                    {
                        callback(err, rows);
                    })
                });
            });
        });

        async.series(
            task_idf,
            function(err, results)
            {
                pairs.forEach(function(p)
                {
                    var name = p.name;
                    var word = p.word;
                    //boolean

                    var tf_boolean = 1;
                    var tf_log = 

                    //log 
                    //arg
                });
            }
        );
    }
);


const tf = function(t, d)
{

};

