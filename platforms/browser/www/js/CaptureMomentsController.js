/**
 * Created by katrin on 5/3/15.
 */
var captureMomentsController = function () {
    var storageService = null;
    var controller = {
        self: null,
        initialize: function () {
            self = this;

            $('header')[0].innerHTML = '<h1 role="heading" aria-level="1"><img src="img/logo.png" alt="Cookit Logo"/> CookIt</h1>';
            new SQLiteStorageService().done(function (service) {
                self.storageService = service;
                self.bindEvents();
                self.renderMainView();
            }).state(function (errorMessage) {
                console.log(errorMessage);
            });
        },


        bindEvents: function () {
            $('.tab-button').on('click', this.onTabClick);
        },

        onTabClick: function () {
            var tab = $(this).data('tab');

            if (tab === '#about-tab') {
                self.renderAboutView();
            } else if (tab === '#settings-tab') {
                self.renderSettingsView();
            } else if (tab === '#main-tab') {
                self.renderMainView();
            } else if (tab === '#capture-tab') {
                self.renderCaptureView();
            }
        },

        renderAboutView: function () {
            $('.tab-button').removeClass('ui-btn-active');
            $('#about-tab-button').addClass('ui-btn-active');
            $("#tab-content").load("./views/about-view.html");
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
                $momentTemplate = $('.moment').remove();

                // Load MyMoments here
                var moments = self.storageService.getMoments().done(function(moments) {

                    for(var idx in moments) {
                        var $div = $momentTemplate.clone();
                        var moment = moments[idx];

                        $div.find('.moment-name').text(moment.name);
                        $div.find('.moment-media').text('<img src="' + moment.media + '"/>');
                        $div.find('.moment-description').text(moment.description);

                        if (moment.location) {
                            var url =
                                '<a target="_blank" href="https://www.google.com/maps/preview/@' +
                                moment.location.latitude + ',' + moment.location.longitude + ',10z">Click to open map</a>';

                            $div.find('.moment-location').html(url);
                        } else {
                            $div.find('.moment-location').text("Not specified");
                        }

                        $tab.append($div);
                    }
                }).fail(function(error) {
                    alert(error);
                });
            });
        },

        renderCaptureView: function () {
            $('.tab-button').removeClass('ui-btn-active');
            $('#caputre-tab-button').addClass('ui-btn-active');
            $("#tab-content").load("./views/post-view.html", function (data) {
                $('#tab-content').find('#post-moment-form').on('submit', self.postMoment);
                $('#tab-content').find('#capture').on('click', self.captureImage);
            });
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