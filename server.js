var express    = require("express"),
    mysql      = require('mysql'),
    fs = require('fs');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'Cookit'
});
var app = express();

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
    connection.query('SELECT * from recipe', function(err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
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
    var recipe,
        ingredients;
    connection.query('SELECT * from recipe WHERE id=' + id, function(err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            recipe = rows;
        }
        else {
            console.log('Error while performing Query.');
        }
    });

    //SELECT recipe.*, ingredient.amount, food.name FROM ingredient INNER JOIN recipe ON ingredient.recipe_id = recipe.id INNER JOIN food ON food.id = ingredient.food_id WHERE ingredient.recipe_id = 2
console.log(id);
    connection.query('SELECT ingredient.amount, food.name FROM ingredient INNER JOIN food ON food.id = ingredient.food_id WHERE ingredient.recipe_id=' + id, function(err, rows, fields) {

        console.log(err);
        ingredients = rows;
        console.log('Ingredients: '+  rows);
        recipe.push(ingredients);
        res.send(recipe);
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
app.listen(3000);