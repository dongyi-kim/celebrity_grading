const MySQL = require('mysql');
const FS    = require('fs');
const Request = require('request');
const UrlEncode = require('urlencode');


//read config json file and parse into js object 
const config = JSON.parse(  FS.readFileSync('../config.json', 'utf8') );

const deathnote = FS.readFileSync('../deathnote.txt', 'utf8').replace(/,|\t/gi, '');
const lines = deathnote.split('\n');

const sendRequest = function(name)
{
        const url = 'https://search.naver.com/search.naver?where=news&sm=tab_jum&ie=utf8&query=' + UrlEncode(name);
        const requestOptions = {
            url : url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; en-US; rv:1.9.2.2) Gecko/20100316 Firefox/3.6.2'
            }
        };

        Request(requestOptions, function (error, response, body)
        {
            if(error)
            {
                conslog.log('error : ' + requestOptions.url);
                return;
            }else if(response.statusCode / 100 != 2 )
            {
                console.log('fail : ' + requestOptions.url );
                return;
            }

            if (!error && response.statusCode == 200) {
                console.log(body); // Show the HTML for the Google homepage. 
            }else{
            
            }
        })
};
for(var i = 0 ; i < lines.length; i++)
{
    const name = lines[i].replace(/\s|\n|\t/gi,'').trim();

    if(name.length <= 1)
        continue;
        
    setTimeout( function(){
        sendRequest(name);
    }, i*2000);
    // console.log(requestOptions.url);

}


// //create db connection from db_configuration 
// var db = MySQL.createConnection(config.db_config);

// //connect to the database 
// db.connect(function(err) {
//     if (err) {
//         console.error('mysql connection error');
//         console.error(err);
//         throw err;
//     }else{
//         console.log('done');
//     }
// });



