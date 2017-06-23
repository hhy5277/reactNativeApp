var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/list', function (req, res, next) {
    let page = req.query.page * 1 || 1;


    let ary = [];
    let time = new Date().getTime();
    for (let i = 0; i < 10; i++) {
        ary.push({
            key: time
        });
        time++
    }

    let data = {
        currentPage: page,
        total: 40,
        data: page > 4 ? [] : ary
    }

    res.send({
        code: 0,
        data
    });
});

module.exports = router;
