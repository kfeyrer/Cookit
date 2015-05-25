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
                var moments = self.storageService.getMomentbyId(id).done(function(moments) {
                    var $div = $momentTemplate.clone();
                    var moment = moments[0];

                    //moment.imageFilePath
                    var image = self.storageService.getImage('logo.png').done(function(image) {
                        $div.find('.detail-media').append(image);
                    });
                    $div.find('.detail-name').text(moment.name);
                    $div.find('.detail-description').text(moment.cookingInstruction);
                    ingredients = moments[1];
                    ingredients.forEach(function(ingredient) {
                        $div.find('.detail-ingredients').append('<li>' + ingredient.amount + ' ' + ingredient.name +'</li>');
                    });

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
                var moments = self.storageService.getMoments().done(function(moments) {

                    moments.forEach(function(moment) {
                        var image = self.storageService.getImage('logo.png').done(function(image) {
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
                //$('#tab-content').find('#post-moment-form').on('submit', self.postMoment);
                //$('#tab-content').find('#capture').on('click', self.captureImage);
                $('#ingredient0').keyup(self.addIngredient);
            });
        },

        addIngredient: function(e) {
            $('#ingredient' + self.count).unbind('keyup');
            self.count += 1;
            var input = document.createElement('input');
            input.type = "text";
            input.name = "ingredient" + self.count;
            input.id = "ingredient" + self.count;
            input.placeholder = "Zutat " + self.count;
            input.required = "true";


            $('#ingredients').append(input);

            $('#ingredient' + self.count).keyup(self.addIngredient);
            $('#ingredient' + self.count).addClass("ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c");
        },

        postMoment: function (e) {
            e.preventDefault();
            var name = $('#moment-name').val();
            var description = $('#moment-description').val();
            var media = $('#media').val();
            var addLocation = $('#include-location').is(':checked');

            if (!name || !description) {
                alert('Please fill in fields name and description');
                return;
            } else {
                var result = self.storageService.addMoment( // return deferred object
                    name, media, description, addLocation);

                result.done(function() { // promise: deferred object is resolved
                    alert('Another Moment successfully added');
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
        }
    };
    controller.initialize();
    return controller;
};