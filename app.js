var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var moment = require('moment');

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'devdogs'
});

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');
app.set('views', './views')
// 정적인 파일을 불러오는 코드 (public 폴더를 기준으로 함)
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render("index");
})

app.get('/Notice', function (req, res) {
    var sql = 'SELECT * FROM notice';
    conn.query(sql, function (err, datas, fields) {
        if (err) {
            console.log(err);
        }
        res.render("notice", { datas: datas });
    })
})

app.get('/Notice/add', function (req, res) {
    res.render("Notice_add")
})

app.post('/Notice/add', function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var write_time = moment().format("YY:MM:DD");
    var sql = 'INSERT INTO notice (title, content, write_time) VALUES(?, ?, ?)';
    conn.query(sql, [title, content, write_time], function (err, rows) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else {
            res.redirect('/Notice/' + rows.insertId);
        }
    })
})

app.get('/Notice/:id', function (req, res) {
    var sql = 'SELECT * FROM notice where id=?';
    var id = req.params.id;
    conn.query(sql, [id], function (err, data, fields) {
        if (err) {
            console.log(err);
        }
        res.render("notice_id", { data: data[0] });
    })
})

// app.post('')

app.listen(3000, function (req, res) {
    console.log('Connected 3000 Port!');
})