var express = require('express');
var router = express.Router();


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

  console.log(req.body.selection);
  console.log(selection);

  res.send('respond with a resource');
});

module.exports = router;
