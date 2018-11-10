var express = require('express');
var app = express();

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'devdogs'
});

app.set('view engine', 'jade');
app.set('views', './views')
// 정적인 파일을 불러오는 코드 (public 폴더를 기준으로 함)
app.use(express.static('public'));

app.get('/', function(req, res){
    res.render("index");
})

app.get('/Notice', function(req, res){
    var sql = 'SELECT * FROM notice';
    conn.query(sql, function(err, datas, fields){
        if(err){
            console.log(err);
        }
        res.render("notice", {datas:datas});
    })
})

app.get('/Notice/:id', function(req, res){
    var sql = 'SELECT * FROM notice where id=?';
    var id = req.params.id;
    conn.query(sql, [id], function(err, data, fields){
        if(err){
            console.log(err);
        }
        res.render("notice_id", {data:data[0]});
    })
})

app.listen(3000, function(req, res){
    console.log('Connected 3000 Port!');
})