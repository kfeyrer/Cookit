/**
 * Created by katrin on 5/3/15.
 */
var captureMomentsController = function () {
    var storageService = null;
    var controller = {
        self: null,
        count: 0,
        initialize: function () {
            self = this;

            $('header')[0].innerHTML = '<h1 role="heading" aria-level="1"><img src="img/logo.png" alt="Cookit Logo"/> CookIt</h1>';
            self.storageService = new SQLiteStorageService();
            self.bindEvents();
            self.renderMainView();
        },

        bindEvents: function () {
            $('.tab-button').on('click', this.onTabClick);
            $('#recipe-search').on('click', self.renderMainView);
        },

        onTabClick: function () {
            var tab = $(this).data('tab');

            if (tab === '#about-tab') {
                self.renderDetailView();
            } else if (tab === '#settings-tab') {
                self.renderSettingsView();
            } else if (tab === '#main-tab') {
                self.renderMainView();
            } else if (tab === '#capture-tab') {
                self.renderCaptureView();
            }
        },

        renderDetailView: function (e) {
            var id = e.currentTarget.attributes.getNamedItem('data-id').value;
            var $tab = $('#tab-content');
            $tab.empty();
            $tab.load("./views/detail-view.html", function(data) {
                $momentTemplate = $('.moment').remove();

                // Load MyMoments here
                var moments = self.storageService.getMomentbyId(id).done(function(recipe) {
                    var $div = $momentTemplate.clone(),
                        recipe = recipe[0];

                    //moment.imageFilePath
                    if(recipe.image === 'NULL') {
                        recipe.image = 'logo.png';
                    }
                    var image = self.storageService.getImage(recipe.image).done(function(image) {
                        $div.find('.detail-media').append(image);
                    });
                    $div.find('.detail-name').text(recipe.name);
                    $div.find('.detail-description').text(recipe.description);
                    ingredients = recipe.ingredients.split(',');
                    ingredients.forEach(function(ingredient) {
                        var ingredient = ingredient.split(' ');
                        $div.find('.detail-ingredients').append('<li>' + ingredient[0] + ' ' + ingredient[1] +'</li>');
                    });

                    if(recipe.lat !== 'NULL' && recipe.lon !== 'NULL' && recipe.lat !== null && recipe.lon !== null) {
                        self.codeLatLng(recipe.lat, recipe.lon);
                    }

                    $tab.append($div);
                }).fail(function(error) {
                    alert(error);
                });
            });
        },

        renderSettingsView: function () {
            $('.tab-button').removeClass('ui-btn-active');
            $('#settings-tab-button').addClass('ui-btn-active');

            var $tab = $('#tab-content');
            $tab.empty();
            $tab.load("./views/settings-view.html");
        },

        renderMainView: function () {
            $('.tab-button').removeClass('ui-btn-active');
            $('#main-tab-button').addClass('ui-btn-active');

            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/main-view.html", function(data) {
                $momentTemplate = $('#moment').remove();

                // Load MyMoments here
                var query = $('#address').val();
                var moments = self.storageService.getMoments(query).done(function(moments) {

                    moments.forEach(function(moment) {
                        if(moment.image === 'NULL') {
                            moment.image = 'logo.png';
                        }
                        var image = self.storageService.getImage(moment.image).done(function(image) {
                            var $div = $momentTemplate.clone();

                            $div.find('.ui-btn-text').prepend(image);
                            $div.find('img').addClass('ui-li-thumb');
                            $div.attr('data-id', moment.id);
                            $div.on('click', self.renderDetailView);
                            $div.find('.ui-li-heading').text(moment.name);
                            $div.find('.moment-description').text(moment.cookingInstruction);

                            $tab.append($div);
                        });
                    });
                }).fail(function(error) {
                    alert(error);
                });
            });
        },

        renderCaptureView: function () {
            $('.tab-button').removeClass('ui-btn-active');
            $('#caputre-tab-button').addClass('ui-btn-active');
            $("#tab-content").load("./views/post-view.html", function (data) {
                $('#tab-content').find('#post-recipe-form').on('submit', self.postMoment);
                //$('#tab-content').find('#capture').on('click', self.captureImage);
                $('#ingredient0').keyup(self.addIngredient);
            });
        },

        addIngredient: function(e) {
            if(e.keyCode !== 9) {
                $('#ingredient' + self.count).unbind('keyup');
                self.count += 1;
                var input = document.createElement('input');
                input.type = "text";
                input.name = "ingredient" + self.count;
                input.id = "ingredient" + self.count;
                input.placeholder = "Zutat " + self.count;

                $('#ingredients').append(input);

                var ingredient = $('#ingredient' + self.count);
                ingredient.keyup(self.addIngredient);
                ingredient.addClass("ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c");
            }
        },

        postMoment: function (e) {
            e.preventDefault();
            var name = $('#name').val(),
                description = $('#desc').val(),
                allIngredients = [];

            var ingredients = $('#ingredients').find('input');

            for(var i = 0; i<ingredients.length; i++) {
                var value = $('#ingredient' + i).val();
                if(value !== "") {
                    allIngredients.push($('#ingredient' + i).val());
                }
            };

            if(allIngredients.length > 1) {
                allIngredients = allIngredients.join(',');
            };
            //var media = $('#media').val();
            var addLocation = $('#location').is(':checked');

            if(addLocation) {
                navigator.geolocation.getCurrentPosition (
                function(position) {
                    var lat = position.coords.latitude;
                    var lon = position.coords.longitude;

                    var result = self.storageService.addRecipe({name: name, description: description, ingredients: allIngredients.toString(), lat: lat, lon: lon});

                    result.done(function() { // promise: deferred object is resolved
                        alert('Another Moment successfully added');
                        $('#ingredient' + self.count).unbind('keyup');
                        self.count = 0;
                        self.renderMainView();
                    }).fail(function(error) { // promise: deferred object is rejected
                        alert(error);
                    });
                });
            } else {
                var result = self.storageService.addRecipe({name: name, description: description, ingredients: allIngredients.toString(), lat: 'NULL', lon: 'NULL'});

                result.done(function() { // promise: deferred object is resolved
                    alert('Another Moment successfully added');
                    $('#ingredient' + self.count).unbind('keyup');
                    self.count = 0;
                    self.renderMainView();
                }).fail(function(error) { // promise: deferred object is rejected
                    alert(error);
                });
            }

        },

        captureImage: function(){
            var url = "http://10.52.202.19:3000/upload";
                //request = require('request');

            console.log('try to capture the image!');
            navigator.camera.getPicture(onSuccess, onFail, { quality: 10,
                encodingType: Camera.EncodingType.PNG,
                sourceType: Camera.PictureSourceType.CAMERA,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                destinationType: Camera.DestinationType.FILE_URI });
            //navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            //	destinationType: Camera.DestinationType.DATA_URL });

            function cameraCallback(imageData) {
                var image = $('#uploadImage');
                image.src = "data:image/jpeg;base64," + imageData;
            }
            function onSuccess(imageURI) {
                var image = $('#uploadImage');
                image.src = imageURI;
                var media = $('#media').val(imageURI);
                $.post(
                    url,
                    { image: image },
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body)
                        }
                    }
                );
            }
            function onFail(message) {
                console.log('Failed because: ' + message);
            }
        },

        codeLatLng: function (lat, lng) {
            var geocoder = new google.maps.Geocoder(),
                latlng = new google.maps.LatLng(lat, lng);
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        //find country name
                        var city = null;
                        for (var i=0; i<results[0].address_components.length; i++) {
                            for (var b=0;b<results[0].address_components[i].types.length;b++) {

                                //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                    //this is the object you are looking for
                                    city= results[0].address_components[i];
                                    break;
                                }
                            }
                        }
                        //city data
                        document.getElementById('city').innerHTML = ('Erstellt in: ' + city.long_name);

                    } else {
                        console.log("No results found");
                    }
                } else {
                    console.log("Geocoder failed due to: " + status);
                }
            });
        }
    };
    controller.initialize();
    return controller;
};