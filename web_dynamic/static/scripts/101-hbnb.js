$(document).ready(function () {
    let selectedAmenities = {};
    let selectedStates = {};
    let selectedCities = {};

    // ✅ Listen for Amenity checkbox selection
    $('.amenities input[type="checkbox"]').change(function () {
        let amenityId = $(this).attr('data-id');
        let amenityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }

        // ✅ Update h4 tag inside .amenities
        let amenityList = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').text(amenityList.length > 0 ? amenityList : '\u00A0');
    });

    // ✅ Listen for State and City checkbox selection
    $('.locations input[type="checkbox"]').change(function () {
        let itemId = $(this).attr('data-id');
        let itemName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            if ($(this).parent().is('li')) {
                // City selected
                selectedCities[itemId] = itemName;
            } else {
                // State selected
                selectedStates[itemId] = itemName;
            }
        } else {
            if ($(this).parent().is('li')) {
                delete selectedCities[itemId];
            } else {
                delete selectedStates[itemId];
            }
        }

        // ✅ Update h4 tag inside .locations
        let stateList = Object.values(selectedStates);
        let cityList = Object.values(selectedCities);
        let locationText = [...stateList, ...cityList].join(', ');
        $('.locations h4').text(locationText.length > 0 ? locationText : '\u00A0');
    });

    // ✅ Check API status
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // ✅ Function to fetch and display places
    function fetchPlaces(amenityFilter = [], stateFilter = [], cityFilter = []) {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                amenities: amenityFilter,
                states: stateFilter,
                cities: cityFilter
            }),
            success: function (places) {
                $('.places').empty();
                for (let place of places) {
                    let article = `
                        <article>
                            <div class="title_box">
                                <h2>${place.name}</h2>
                                <div class="price_by_night">$${place.price_by_night}</div>
                            </div>
                            <div class="information">
                                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                            </div>
                            <div class="description">${place.description}</div>

                            <!-- Reviews Section -->
                            <div class="reviews">
                                <h2>Reviews <span class="toggle-reviews" data-id="${place.id}">show</span></h2>
                                <ul class="review-list"></ul>
                            </div>
                        </article>`;
                    $('.places').append(article);
                }
            }
        });
    }

    // ✅ Load all places initially
    fetchPlaces();

    // ✅ Filter places when Search button is clicked
    $('button').click(function () {
        fetchPlaces(Object.keys(selectedAmenities), Object.keys(selectedStates), Object.keys(selectedCities));
    });

    // ✅ Show/Hide Reviews
    $(document).on('click', '.toggle-reviews', function () {
        let placeId = $(this).attr('data-id');
        let reviewList = $(this).closest('.reviews').find('.review-list');

        if ($(this).text() === 'show') {
            // ✅ Fetch and display reviews
            $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`, function (data) {
                reviewList.empty();
                if (data.length === 0) {
                    reviewList.append('<li>No reviews yet.</li>');
                } else {
                    for (let review of data) {
                        let reviewItem = `<li><strong>${review.user}</strong>: ${review.text}</li>`;
                        reviewList.append(reviewItem);
                    }
                }
            });
            $(this).text('hide');
        } else {
            // ✅ Hide reviews
            reviewList.empty();
            $(this).text('show');
        }
    });
});