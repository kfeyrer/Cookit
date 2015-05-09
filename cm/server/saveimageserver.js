#!/usr/bin/env node
// simple file - upload server:
// you need to npm install multiparty
//
// from: https://github.com/andrewrk/node-multiparty/
// try upload image with browser at: http://127.0.0.1:3000/upload
//
var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var fs=require('fs');

var port = process.env.PORT || 3000;

function saveFile(name,fileobj){
    console.log(JSON.stringify(fileobj) );
    console.log("filename = ", fileobj.originalFilename);
    console.log("path=",fileobj.path);
    // copy from temp path
    //fs.createReadStream(fileobj.path).pipe(fs.createWriteStream(name));
}
http.createServer(function(req, res) {
    if (req.url === '/upload' && req.method === 'POST') {
        // parse a file upload
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            //res.end(util.inspect({fields: fields, files: files}));
            for (var idx in files){
                var fileobj = files[idx][0]
                saveFile("image.png",fileobj);
            }
        });

        return;
    }

    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
}).listen(port);
console.log("Listening on " + port);