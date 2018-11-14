var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var moment = require('moment');
var fs = require('fs');

// 파일 관련 모튤
var multer = require('multer');

// 파일 저장위치와 파일이름 설정
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads');
    },
    // 파일 이름 설정
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
})

var upload = multer({ storage: storage })

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

app.post('/Notice/add', upload.array("fileupload[]"), function (req, res, next) {
    var title = req.body.title;
    var content = req.body.content;
    var write_time = moment().format("YY:MM:DD");
    var file_path = req.files;
    var sql = 'INSERT INTO notice (title, content, write_time, files) VALUES(?, ?, ?, ?)';
    conn.query(sql, [title, content, write_time, file_path.length], function (err, rows) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else {
            var sql = 'INSERT INTO uploadfiles (filePath, noticeId) VALUES(?, ?)';
            for(var i=0; i<file_path.length; i++){
                conn.query(sql, [file_path[i].path, rows.insertId], function(err, rows){
                    if (err){
                        console.log(err);
                    }
                    else{
                    }
                })
            }
            res.redirect('/Notice/' + rows.insertId);
        }
    })
})

app.get('/Notice/:id', function (req, res) {
    var sql = 'select * from notice where id=?';
    var id = req.params.id;
    conn.query(sql, [id], function (err, data){
        if(err){
            console.log(err);
        }
        else{
            if(data[0].files > 0){
                var sql = 'select * from notice join uploadfiles on notice.id = uploadfiles.noticeId WHERE notice.id=?';
                conn.query(sql, [id], function (err, data, fields) {
                    if (err) {
                        console.log(err);
                    }
                    res.render("notice_id", { data: data });
                })
            }
            else{
                res.render("notice_id", { data: data });
            }
        }
    })
    
})

app.post('/Notice/delete/:id', function (req, res){
    var id = req.params.id;
    var sql = 'DELETE FROM notice WHERE id=?';
    conn.query(sql, [id], function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/Notice/');

        }
    })
})

app.get('/Notice/edit/:id', function(req, res){
    var id = req.params.id;
    var sql = 'SELECT * FROM notice WHERE id=?';
    conn.query(sql, [id], function(err, notice){
        if(err){
            console.log(err);
        }
        else{
            res.render('notice_edit', { notice: notice[0] });
        }
    })
})

app.post('/Notice/edit/:id', function(req, res){
    var id = req.params.id;
    var title = req.body.title;
    var content = req.body.content;
    var write_time = moment().format("YY:MM:DD");
    var sql = 'UPDATE notice SET title=?, content=?, write_time=? WHERE id=?'

    conn.query(sql, [title, content, write_time, id], function(err, result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/Notice/' + id);
        }
    });
})

app.get('/download/uploads/:name', function(req, res){
    var filename = req.params.name;

    var file = __dirname + '/uploads/' + filename;
    res.download(file);
})

app.listen(3000, function (req, res) {
    console.log('Connected 3000 Port!');
})