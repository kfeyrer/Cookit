/**
 * Created by katrin on 5/5/15.
 */
var SQLiteStorageService = function () {
    var service = {},
        db = window.openDatabase("mymoment", "1.0", "My Moments", 2000);

    service.initialize = function() {
        var deferred = $.Deferred();
        db.transaction(function(tx) {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS moments ' +
                '(id integer primary key, name text, media text, description text, latitude real, longitude real)'
                ,[], function(tx, res) {
                    tx.executeSql('DELETE FROM moments', [], function(tx, res) {
                        deferred.resolve(service);
                    }, function(tx, res) {
                        deferred.reject('Error initializing database');
                    });
                }, function(tx, res) {
                    deferred.reject('Error initializing database');
                });
        });
        return deferred.promise();
    };

    service.getMoments = function() {
        var deferred = $.Deferred();

        console.log("DEBUG: get my moments... ");
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM moments', [], function(tx, res) {
                console.log("DEBUG: we returned from the SQL select statement.. with res= ",res);
                var moments = [];
                console.log(res.rows.length);
                for(var i = 0; i < res.rows.length; i++) {
                    var moment = { name: res.rows.item(i).name, media: res.rows.item(i).media, description: res.rows.item(i).description };
                    if (res.rows.item(i).latitude && res.rows.item(i).longitude) {
                        moment.location = {
                            latitude: res.rows.item(i).latitude,
                            longitude: res.rows.item(i).longitude
                        }
                    }
                    console.log("DEBUG: adding moment: ",moment);
                    moments.push(moment);
                }
                console.log("DEBUG: moments ",moments);
                deferred.resolve(moments);

            }, function(e) {
                console.log("DEBUG: errpr execitomg SQL. No moments ",moments);
                deferred.reject(e);
            });
        });
        console.log("DEBUG: sql transacction running... ");
        return deferred.promise();
    };

    service.addMoment = function(name, media, description, addLocation) {
        var deferred = $.Deferred();

        if(addLocation) {
            navigator.geolocation.getCurrentPosition (
                function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    console.log("DEBUG: insert with location ",position);
                    db.transaction(
                        function(tx) {
                            tx.executeSql('INSERT INTO moments (name, media, description, latitude, longitude) VALUES (?,?,?,?,?)',
                                [name, media, description, lat, lon],
                                function(tx, res)
                                {
                                    console.log('success');
                                    // resolve deferred object => call any doneCallbacks
                                    deferred.resolve();
                                }, function(e)
                                {
                                    console.log('failure');
                                    // reject deferred object => call any failCallbacks
                                    deferred.reject('Error posting a new moment');
                                });
                        },
                        function() {
                            // reject deferred object => call any failCallbacks
                            deferred.reject('Error during save process. ');
                        }
                    );
                    return pos;
                },
                function() {
                    // sorry no position ...
                    deferred.reject('Error no position found. ');
                },
                {maximumAge: 60000, timeout: 5000, enableHighAccuracy: true}
            );
        } else {
            console.log("DEBUG: insert without location ",name);
            db.transaction(function(tx) {
                tx.executeSql('INSERT INTO moments (name, media, description) VALUES (?,?,?)', [name, media, description], function(tx, res) {
                    console.log("DEBUG: success when inserting the moment ",res);
                    // resolve deferred object => call any doneCallbacks
                    deferred.resolve();
                }, function(e) {
                    console.log("DEBUG: error on inserting ",e);
                    // reject deferred object => call any failCallbacks
                    deferred.reject(e);
                });
            });
        }

        return deferred.promise();
    };

    return service.initialize();
};

//SQLiteStorageService = function () {
//
//    service.getMoments = function() {
//        // a chainable utility object:
//        //    https://api.jquery.com/category/deferred-object/
//        //    manages multiple callbacks in queues,
//        //    relays state
//        //  see methods: .resolve(..), .reject(..) .promise() and .done(...), .fail(...) ...
//        var deferred = $.Deferred();
//
//        console.log("DEBUG: get my moments... ");
//        db.transaction(function(tx) {
//            tx.executeSql('SELECT * FROM moments', [], function(tx, res) {
//                console.log("DEBUG: we returned from the SQL select statement.. with res= ",res);
//                var moments = [];
//                console.log(res.rows.length);
//                for(var i = 0; i < res.rows.length; i++) {
//                    var moment = { name: res.rows.item(i).name, media: res.rows.item(i).media, description: res.rows.item(i).description };
//                    if (res.rows.item(i).latitude && res.rows.item(i).longitude) {
//                        moment.location = {
//                            latitude: res.rows.item(i).latitude,
//                            longitude: res.rows.item(i).longitude
//                        }
//                    }
//                    console.log("DEBUG: adding moment: ",moment);
//                    moments.push(moment);
//                }
//                console.log("DEBUG: moments ",moments);
//                deferred.resolve(moments);
//
//            }, function(e) {
//                console.log("DEBUG: errpr execitomg SQL. No moments ",moments);
//                deferred.reject(e);
//            });
//        });
//        console.log("DEBUG: sql transacction running... ");
//        return deferred.promise();
//    }
//
//    service.addMoment = function(name, media, description, addLocation) {
//        var deferred = $.Deferred();
//        console.log("DEBUG: WE TRY to add a moment... ",db);
//        if (addLocation) {
//            console.log("DEBUG: insert with location ",name)
//            navigator.geolocation.getCurrentPosition (
//                function(position) {
//                    var lat = position.coords.latitude;
//                    var lon = position.coords.longitude;
//                    console.log("DEBUG: insert with location ",position)
//                    db.transaction(
//                        function(tx) {
//                            tx.executeSql('INSERT INTO moments (name, media, description, latitude, longitude) VALUES (?,?,?,?,?)',
//                                [name, media, description, lat, lon],
//                                function(tx, res)
//                                {
//                                    console.log('success');
//                                    // resolve deferred object => call any doneCallbacks
//                                    deferred.resolve();
//                                }, function(e)
//                                {
//                                    console.log('failure');
//                                    // reject deferred object => call any failCallbacks
//                                    deferred.reject('Error posting a new moment');
//                                });
//                        },
//                        function() {
//                            // reject deferred object => call any failCallbacks
//                            deferred.reject('Error during save process. ');
//                        }
//                    );
//                },
//                function() {
//                    // reject deferred object => call any failCallbacks
//                    deferred.reject(
//                        'We could not fetch your current location. ' +
//                        'Please try again or post a moment without adding a location');
//                },
//                {maximumAge: 60000, timeout: 5000, enableHighAccuracy: true}
//            );
//        } else {
//            console.log("DEBUG: insert without location ",name)
//            db.transaction(function(tx) {
//                tx.executeSql('INSERT INTO moments (name, media, description) VALUES (?,?,?)', [name, media, description], function(tx, res) {
//                    console.log("DEBUG: success when inserting the moment ",res)
//                    // resolve deferred object => call any doneCallbacks
//                    deferred.resolve();
//                }, function(e) {
//                    console.log("DEBUG: error on inserting ",e)
//                    // reject deferred object => call any failCallbacks
//                    deferred.reject(e);
//                });
//            });
//        }
//        // we return now the Promise object (the this object has .done(...) and .fail(...) callbacks )
//        return deferred.promise();
//    }
//    console.log("DEBUG: persistence service will be set up... ");
//    return service.initialize();
//}