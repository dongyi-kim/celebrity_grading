
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
        },
        function(callback)
        {
            var query = db.query('SELECT name, word, count FROM frequency', function(err, rows)
            {
                callback(err,rows);
            });
        }
    ],
    function(err, results)
    {
        if(err){
            console.log(err);
            return;
        }

        // var pairs = results[0];
        var names = results[0];
        var terms = results[1];
        var pairs = results[2];

        var fnames = '';
        names.forEach(function(row)
        {
            fnames += row.name +'\n';
        });

        var fterms = '';
        terms.forEach(function(row)
        {
            fterms += row.word + '\n';
        });

        var fpairs = '';
        pairs.forEach(function(row)
        {
            fpairs += row.name + '\t' + row.word + '\t' + row.count + '\n';
        });

        FS.writeFile('names.csv', fnames, 'utf8', function(err){ console.log(err); });
        FS.writeFile('words.csv', fterms, 'utf8', function(err){ console.log(err); });
        FS.writeFile('pairs.csv', fpairs, 'utf8', function(err){ console.log(err); });
        

        // var D = names.length.toFixed(2);
        // var T = terms.length.toFixed(2);

        // console.log(D + ' ' + T);

        // terms.forEach(function(e)
        // {
        //     const word = e.word;
        //     const sql = `SELECT count(*) FROM frequency WHERE word = '${word}';`;
        //     var query = db.query(sql, function(err1, rows1)
        //     {
        //         const idf = Math.log10(  D / rows1[0]['count(*)'] );
        //         const sql2 = `UPDATE words SET idf = ${idf} WHERE word = '${word}';`;
        //         var query2 = db.query(sql2, function(err2, rows2)
        //         {
        //             console.log('---');
        //             console.log(err2);
        //             console.log(rows2)
        //             const sql3 = `SELECT name, count FROM frequency WHERE word = '${word}';`;
        //             var query3 = db.query(sql3, function(err3, rows3)
        //             {
        //                 console.log(err3);
                        
        //                 rows3.forEach(function(row)
        //                 {

        //                     const name = row.name;
        //                     const count = row.count.toFixed(2);


        //                     const tf_boolean = 1;
        //                     const tf_log = Math.log10( count + 1 );
        //                     const sql4 = `SELECT MAX(count) FROM frequency WHERE name = '${name}';`;
        //                     var query4 = db.query(sql4, function(err4, rows4){
        //                         const max_count = rows4[0].max;
        //                         const tf_arg = 0.5 + ( 0.5 * count ) / (max_count);
        //                         const sql5 = `UPDATE frequency SET tf_boolean = ${tf_boolean}, tf_log = ${tf_log}, tf_arg = ${tf_log} WHERE name = '${name}' AND word = '${word}';`;
        //                         var query5 = db.query(sql5, function(err5, rows5)
        //                         {
        //                             console.log(err5);
        //                         });
        //                     });
        //                 });
        //             });
        //         });
        //     });
        // });
    }
);


