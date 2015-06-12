var express    = require("express"),
    mysql      = require('mysql'),
    fs = require('fs'),
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'Cookit'
    }),
    app = express(),
    expressWs = require('express-ws')(app);

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});
app.get("/",function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    connection.query('SELECT id, name, image from recipes', function(err, rows, fields) {
        if (!err){
            res.send(rows);
        }
        else {
            console.log('Error while performing Query.');
        }
    });
});

app.get("/id/:id", function(req, res) {
    var id = req.params.id;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    connection.query('SELECT * from recipes WHERE id=' + id, function(err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.send(rows);
        }
        else {
            console.log('Error while performing Query.');
        }
    });
});

var bodyParser = require('body-parser');
app.use(bodyParser());
app.post("/add", function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log(req.body);
    var recipeName = req.body.name,
        desc = req.body.description,
        ingredients = req.body.ingredients,
        image = 'logo.png',
        lat = req.body.lat,
        lon = req.body.lon;

    connection.query('INSERT INTO recipes (name, ingredients, description, image, lat, lon) VALUES (?, ?, ?, ?, ?, ?);',
        [recipeName, ingredients, desc, image, lat, lon], function(err, rows) {
        if(err) {
            console.log(err);
        } else {
            for (var i=0; i < clients.length; i++) {
                clients[i].send(JSON.stringify({
                    'event': 'msg',
                    'msg': 'Eine neues Rezept wurde hinzugef&uumlgt!'
                }));
            }
            res.send('finished');
        }
    });
});

app.post("/image", function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var file = req.body;
    console.log(file);
});

function saveFile(name,fileobj){
    console.log(JSON.stringify(fileobj) );
    console.log("filename = ", fileobj.originalFilename);
    console.log("path=",fileobj.path);
    // copy from temp path
    fs.createReadStream(fileobj.path).pipe(fs.createWriteStream(name));
}

app.get("/search/:query", function(req, res) {
    var query = req.params.query;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    connection.query('SELECT * FROM recipes WHERE LOWER(name) LIKE "%' + query + '%"', function(err, rows, fields) {
        if (!err){
            res.send(rows);
        }
        else {
            console.log('Error while performing Query.');
        }
    });
});

app.get("/image/:name", function(req, res) {
    var path = 'www/img/' + req.params.name;
    fs.readFile(path, function(err, data) {
        if (err) throw err; // Fail if the file can't be read.
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<img src="data:image/jpeg;base64,');
        res.write(new Buffer(data).toString('base64'));
        res.end('"/>');
    });
});

var clients = [];

app.ws('/', function (ws, req) {
    ws.on('close', function() {
        clients.splice(ws, 1);
    });
    clients.push(ws);
});
app.listen(8001);