/**
 * Created by katrin on 5/5/15.
 */
var SQLiteStorageService = function () {
    var service = {};

    service.initialize = function() {
        return service;
    };

    service.getMoments = function(query) {
        var deferred = $.Deferred(),
            url = 'http://localhost:3000/';

        if(query) {
            url += 'search/' + query;
        }

        $.ajax({url: url}).done(function(res) {
            deferred.resolve(res);
        });
        console.log("DEBUG: sql transacction running... ");
        return deferred.promise();
    };

    service.getMomentbyId = function(id) {
        var deferred = $.Deferred();

        $.ajax({url: 'http://localhost:3000/id/' + id}).done(function(res) {
            deferred.resolve(res);
        });
        return deferred.promise();
    };

    service.getImage = function(name) {
        var deferred = $.Deferred();

        $.ajax({url: 'http://localhost:3000/image/' + name}).done(function(res) {
            deferred.resolve(res);
        });
        return deferred.promise();
    };

    service.addRecipe = function(data) {
        var deferred = $.Deferred();

        $.ajax({url: 'http://localhost:3000/add', data:data , type:'POST'}).done(function(res) {
            deferred.resolve();
        });
        return deferred.promise();
    };

    return service.initialize();
};