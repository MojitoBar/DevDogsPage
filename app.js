var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', './views')
// 정적인 파일을 불러오는 코드 (public 폴더를 기준으로 함)
app.use(express.static('public'));

app.get('/', function(req, res){
    res.render("index");
})

app.listen(3000, function(req, res){
    console.log('Connected 3000 Port!')
})