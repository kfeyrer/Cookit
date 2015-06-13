/**
 * Created by katrin on 5/3/15.
 */
var recipeController = function () {
    var storageService = null;
    var controller = {
        self: null,
        count: 0,
        recipeIds: [],
        ws: new WebSocket('ws://cookit.ddns.net:65431/'),
        /*
        sets Header text and Logo
        bind events to tab buttons, header and search buttons
        adds a listener for the websocket onmessage
        renders
         */
        initialize: function () {
            self = this;

            $('header')[0].innerHTML = '<h1 role="heading" aria-level="1"><img src="img/logo.png" alt="Cookit Logo"/> CookIt</h1>';
            self.storageService = new SQLiteStorageService();
            self.bindEvents();
            self.renderMainView();
            self.ws.onmessage = function (data) {
                var message = JSON.parse(data.data).msg;
                $('#msg')[0].innerHTML = message;
            };
        },

        bindEvents: function () {
            $('header').on('click', self.renderMainView);
            $('.tab-button').on('click', this.onTabClick);
            $('#recipe-search').on('click', self.renderMainView);
            $('#random-recipe').on('click', self.randomRecipe);
        },

        onTabClick: function () {
            var tab = $(this).data('tab');

            if (tab === '#main-tab') {
                self.renderMainView();
            } else if (tab === '#capture-tab') {
                self.renderAddRecipeView();
            }
        },

        /*
        gets all recipes from the server and renderes it as list
        saves all ids in the recipeIds array for the random recipes
         */
        renderMainView: function () {
            $('.tab-button').removeClass('ui-btn-active');
            $('#main-tab-button').addClass('ui-btn-active');

            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/main-view.html", function(data) {
                $momentTemplate = $('#moment').remove();

                // Load MyMoments here
                var query = $('#address').val().toLowerCase();
                var moments = self.storageService.getMoments(query).done(function(moments) {

                    moments.forEach(function(moment) {
                        self.recipeIds.push(moment.id);
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

        /*
        calculates a random number between 0 and the amount of the recipes
        calls renderDetailView with the specific random recipeId
         */
        randomRecipe: function() {
            var random = Math.floor((Math.random() * self.recipeIds.length));
            self.renderDetailView(null, self.recipeIds[random]);
        },

        /*
        gets recipe by id and renders it as the detail view
        if latitude and longitude and google maps are available, the location can be found
         */
        renderDetailView: function (e, recipeId) {
            var id = null;
                if(e) {
                   id = e.currentTarget.attributes.getNamedItem('data-id').value;
                } else if(recipeId) {
                    id = recipeId;
                }
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

                    if(recipe.lat !== 'NULL' && recipe.lon !== 'NULL' && recipe.lat !== null && recipe.lon !== null && window.google) {
                        codeLatLng(recipe.lat, recipe.lon);
                    }

                    $tab.append($div);
                }).fail(function(error) {
                    alert(error);
                });
            });
        },

        /*
        renders the add recipe form.
        adds the keyup event to the ingredient input field
         */
        renderAddRecipeView: function () {
            $('.tab-button').removeClass('ui-btn-active');
            $('#caputre-tab-button').addClass('ui-btn-active');
            $("#tab-content").load("./views/post-view.html", function (data) {
                $('#tab-content').find('#post-recipe-form').on('submit', self.addRecipe);
                $('#ingredient0').keyup(addIngredient);
            });
        },

        /*
        gets all form values and sends it to the server
        adds the current location to the sent data if location should be added
        gets ingredients from all ingredient input fields and connects them with a ","
        this is needed, as there is only one ingredients field in the database
         */
        addRecipe: function (e) {
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
            }

            if(allIngredients.length > 1) {
                allIngredients = allIngredients.join(',');
            }

            var addLocation = $('#location').is(':checked');

            if(addLocation && window.google) {
                navigator.geolocation.getCurrentPosition (
                    function(position) {
                        var lat = position.coords.latitude;
                        var lon = position.coords.longitude;

                        var result = self.storageService.addRecipe({name: name, description: description, ingredients: allIngredients.toString(), image: name.toLowerCase(), lat: lat, lon: lon});

                        result.done(function() { // promise: deferred object is resolved
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
                    $('#ingredient' + self.count).unbind('keyup');
                    self.count = 0;
                    self.renderMainView();
                }).fail(function(error) { // promise: deferred object is rejected
                    alert(error);
                });
            }
        }
    };

    controller.initialize();
    return controller;
};