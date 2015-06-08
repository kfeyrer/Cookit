/**
 * Created by katrin on 5/5/15.
 */
var SQLiteStorageService = function () {
    var service = {},
        basisUrl = 'http://localhost:3000/';

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
            console.log('finished');
            deferred.resolve(res);
        });
        return deferred.promise();
    };

    service.getMomentbyId = function(id) {
        var deferred = $.Deferred();

        $.ajax({url: basisUrl + 'id/' + id}).done(function(res) {
            console.log('finished');
            deferred.resolve(res);
        });
        return deferred.promise();
    };

    service.getImage = function(name) {
        var deferred = $.Deferred();

        $.ajax({url: basisUrl + 'image/' + name}).done(function(res) {
            console.log('finished');
            deferred.resolve(res);
        });
        return deferred.promise();
    };

    service.addRecipe = function(data) {
        var deferred = $.Deferred();

        $.ajax({url: basisUrl + 'add', data:data , type:'POST'}).done(function(res) {
            console.log('finished');
            deferred.resolve();
        });
        console.log("DEBUG: sql transacction running... ");
        return deferred.promise();
    };

    return service.initialize();
};