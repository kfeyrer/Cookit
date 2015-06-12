/**
 * Created by katrin on 5/5/15.
 */
var SQLiteStorageService = function () {
    var service = {},
        basisUrl = 'http://localhost:8001/'; //'http://cookit.ddns.net:65431/';

    service.initialize = function() {
        return service;
    };

    service.getMoments = function(query) {
        var deferred = $.Deferred(),
            url = basisUrl;

        if(query) {
            url += 'search/' + query;
        }

        $.ajax({url: url}).done(function(res) {
            deferred.resolve(res);
        });
        return deferred.promise();
    };

    service.getMomentbyId = function(id) {
        var deferred = $.Deferred();

        $.ajax({url: basisUrl + 'id/' + id}).done(function(res) {
            deferred.resolve(res);
        });
        return deferred.promise();
    };

    service.getImage = function(name) {
        var deferred = $.Deferred();

        $.ajax({url: basisUrl + 'image/' + name}).done(function(res) {
            deferred.resolve(res);
        });
        return deferred.promise();
    };

    service.addRecipe = function(data) {
        var deferred = $.Deferred();

        $.ajax({url: basisUrl + 'add', data:data , type:'POST'}).done(function(res) {
            deferred.resolve();
        });
        return deferred.promise();
    };

    //service.uploadFile = function(fileURI, filename) {
    //    var formData = new FormData();
    //
    //    formData.append(filename, fileURI, filename);
    //
    //    var xhr = new XMLHttpRequest();
    //    // Open the connection.
    //    xhr.open('POST', basisUrl + 'image', true);
    //    // Set up a handler for when the request finishes.
    //    xhr.onload = function () {
    //        if (xhr.status === 200) {
    //            console.log('connection successful');
    //        } else {
    //            console.log('An error occurred!');
    //        }
    //    };
    //
    //    // Send the Data.
    //    xhr.send(formData);
    //};

    return service.initialize();
};