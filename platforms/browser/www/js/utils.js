function addIngredient (e) {
    if(e.keyCode !== 9) {
        $('#ingredient' + self.count).unbind('keyup');
        self.count += 1;
        var input = document.createElement('input');
        input.type = "text";
        input.name = "ingredient" + self.count;
        input.id = "ingredient" + self.count;
        input.placeholder = "Menge Zutat " + (self.count + 1);

        $('#ingredients').append(input);

        var ingredient = $('#ingredient' + self.count);
        ingredient.keyup(addIngredient);
        ingredient.addClass("ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c");
    }
};

function codeLatLng(lat, lng) {
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
};