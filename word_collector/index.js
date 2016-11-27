const MySQL = require('mysql');
const FS    = require('fs');
const Request = require('request');
const UrlEncode = require('urlencode');
const XPath = require('xpath');
const DOM   = require('xmldom').DOMParser;
const Async = require('async');
// const HttpsProxyAgent = require('https-proxy-agent');  
// const proxy = 'http://gethide.net';
// const agent = new HttpsProxyAgent(proxy);  

//read config json file and parse into js object 
const config = JSON.parse(  FS.readFileSync('../config.json', 'utf8') );

const deathnote = FS.readFileSync('../deathnote.txt', 'utf8').replace(/,|\t/gi, '\n');
const lines = deathnote.split('\n');

const lineValidator = function(text)
{
    //길이
    if(text.length <= 2)
        return false;

    if(text.endsWith('naver.com') ) 
        return false;

    //언론사 마크 제거 
    if(text.length <= 10 && ( 
            text.includes('뉴스')     || text.includes('스포츠')     || text.includes('일보') || text.includes('신문')
            || text.includes('경제')  || text.includes('기자')      || text.includes('YTN') || text.includes('코리아') 
            || text.includes('MBN')  || text.includes('BS')     || text.includes('코리아')   || text.includes('라디오')
            || text.includes('데일리') || text.includes('리포트')  || text.includes('TV')  || text.includes('타임') 
            || text.includes('뉴시스') || text.includes('투데이')  || text.includes('한겨레' || text.includes('위클리')
            || text.includes('헤럴드') || text.includes('허핑턴')   || text.includes('리포트') || text.includes('BC')  ) ) )
        return false;

    //날짜마크 제거 
    if(text.length == 11 && ( text.startsWith('20') || text.startsWith('19') ) )
        return false;

    if(text.endsWith('시간 전') || text.endsWith('분 전') || text.endsWith('초 전') || text.endsWith('보내기')  || text.endsWith('일 전')   || text.endsWith('달 전') )
        return false;

    if(text.startsWith('@')  ||  text.endsWith('****') )
        return false;
                         
    if( text.startsWith('답글') || text.startsWith('공감') || text.startsWith('비공감') || text.startsWith('리트윗')  || text.startsWith('관심글')  )
        return false;

    return true;
};

const newsExtractor = function(body)
{
    var begin = body.indexOf('<ul class="type01">');
    body = body.substring(begin);

    var end = body.indexOf('<div class="paging"');
    var html = body.substring(0, end -7);

    html = html.replace(/<strong[^>]*>/gi, "");
    html = html.replace(/<\/strong>/gi, "");
    return html;
};

const snsExtractor = function(body)
{
    var begin = body.indexOf('<ul class="type01">');
    body = body.substring(begin);

    var end = body.indexOf('<div class="bt_more"');
    var html = body.substring(0, end-32);

    html = html.replace(/<strong[^>]*>/gi, "");
    html = html.replace(/<\/strong>/gi, "");
    return html;
};

const crawlPage = function(url, extractor, validator, callback)
{
    var requestOptions = {
        url : url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; en-US; rv:1.9.2.2) Gecko/20100316 Firefox/3.6.2',
            'Accept-Language' : 'ko-KR',
            'Connection' : 'Keep-Alive',
            'Cookie' : 'NNB=037Y6EIUNNUVE;',
            'Referer' : 'http://naver.com',
        },
        // agent: agent,
    };

    Request(requestOptions, function (error, response, body)
    {
        var resultString = '';
        // console.log(body);
        if (!error && response.statusCode == 200) {
            var xml = extractor(body);
          

            var doc = new DOM().parseFromString(xml);
            if(doc)
            {
                var nodes = XPath.select("//ul/descendant::*/text()", doc);
                for(var index = 0 ; index < nodes.length; index ++)
                {
                    var text = nodes[index].nodeValue.trim();
                    text = text.replace(/[&\/\\#,+()$~%'":*?<>{}\[\]'"`‘’”“ㆍ-]/g, '');

                    var isValid = validator(text);
                    if(isValid)
                        resultString += text + '\n';
                }
            }
        }
        callback(null, resultString);
    });
}
const collectTexts = function(name)
{
    var tasks = [];

    //news 
    for(var i = 0 ; i < 30; i++)
    {
        const start = (i * 10 + 1); 
        const cluster_rank = (start + 20); 
        const encodedName =  UrlEncode(name);
        const url = 'https://search.naver.com/search.naver?ie=utf8&where=news&query='+encodedName+'&sm=tab_pge&sort=0&photo=0&field=0&reporter_article=&pd=0&ds=&de=&docid=&nso=so:r,p:all,a:all&mynews=0&cluster_rank='+cluster_rank+'&start='+start+'&refresh_start=0';  
        tasks.push( function(callback)
        {

            console.log(url);
            crawlPage(url, newsExtractor, lineValidator, callback);
        });
    }

    tasks.push( function(callback)
    {
        const url = 'https://search.naver.com/search.naver?where=news&sm=tab_jum&ie=utf8&query=' + UrlEncode(name);
        crawlPage(url, snsExtractor, lineValidator, callback);
    });
  
    Async.parallel(
        tasks
        // [
        // function(callback)
        // {   //news 
        //     const url = 'https://search.naver.com/search.naver?where=news&sm=tab_jum&ie=utf8&query=' + UrlEncode(name);
        //     var requestOptions = {
        //         url : url,
        //         headers: {
        //             'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; en-US; rv:1.9.2.2) Gecko/20100316 Firefox/3.6.2',
        //             'Accept-Language' : 'ko-KR',
        //             'Connection' : 'Keep-Alive',
        //             'Cookie' : 'NNB=037Y6EIUMMUVE;',
        //         }
        //     };
        //     Request(requestOptions, function (error, response, body)
        //     {
        //         var resultString = '';
        //         if (!error && response.statusCode == 200) {
        //             var begin = body.indexOf('<ul class="type01">');
        //             body = body.substring(begin);

        //             var end = body.indexOf('<div class="paging"');
        //             html = body.substring(0, end -7);

        //             html = html.replace(/<strong[^>]*>/gi, "");
        //             html = html.replace(/<\/strong>/gi, "");

        //             var doc = new DOM().parseFromString(html);
        //             if(doc)
        //             {
        //                 var nodes = XPath.select("//ul/descendant::*/text()", doc);
        //                 for(var index = 0 ; index < nodes.length; index ++)
        //                 {
        //                     var text = nodes[index].nodeValue.trim();
        //                     text = text.replace(/[&\/\\#,+()$~%'":*?<>{}\[\]'"`‘’”“ㆍ-]/g, '');
        //                     if(isValidString(text))
        //                         resultString += text + '\n';
        //                 }
        //             }
        //         }
        //         callback(null, resultString);
        //     });
        // },
        // function(callback)
        // {   //sns
        //     const url = 'https://search.naver.com/search.naver?where=realtime&sm=tab_jum&ie=utf8&query=' + UrlEncode(name);
        //     var requestOptions = {
        //         url : url,
        //         headers: {
        //             'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; en-US; rv:1.9.2.2) Gecko/20100316 Firefox/3.6.2',
        //             'Accept-Language' : 'ko-KR',
        //             'Connection' : 'Keep-Alive',
        //             'Cookie' : 'NNB=037Y6EIUMMUVE;',
        //         }
        //     };
        //     Request(requestOptions, function (error, response, body)
        //     {
        //         var resultString = '';
        //         if (!error && response.statusCode == 200) {
        //             var begin = body.indexOf('<ul class="type01">');
        //             body = body.substring(begin);

        //             var end = body.indexOf('<div class="bt_more"');
        //             html = body.substring(0, end-32);

        //             html = html.replace(/<strong[^>]*>/gi, "");
        //             html = html.replace(/<\/strong>/gi, "");

        //             var doc = new DOM().parseFromString(html);
        //             if(doc)
        //             {
        //                 var nodes = XPath.select("//ul/descendant::*/text()", doc);
        //                 for(var index = 0 ; index < nodes.length; index ++)
        //                 {
        //                     var text = nodes[index].nodeValue.trim();
        //                     text = text.replace(/[&\/\\#,+()$~%'":*?<>{}\[\]'"`‘’”“ㆍ-]/g, '');
        //                     if(isValidString(text))
        //                         resultString += text + '\n';
        //                 }
        //             }
        //         }
        //         callback(null, resultString);
        //     });
        // }]
        ,
        function(err, results)
        {
            if(!results)
                return;

            console.log(name);

            var resultString = '';
            for(var i = 0 ; i < results.length; i++)
            {
                resultString += results[i].trim() + '\n';
            }
            // console.log(resultString);
            FS.writeFile('data/' + name + '.txt', resultString, 'utf8', function(){
                console.log('[done] ' + name);
            });
        }
    );

}

var check = {};
for(var i = 0 ; i < lines.length; i++)
{
    const name = lines[i].replace(/\s|\n|\t/gi,'').trim();

    if(name.length <= 1 || check[name])
        continue;
    check[name] = [];

    // setTimeout( function(){
        collectTexts(name);
    // }, i*1000);
    // break;
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



