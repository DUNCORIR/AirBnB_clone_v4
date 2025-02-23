$(document).ready(function () {
    let selectedAmenities = {};
  
    // ✅ Listen for Amenity checkbox selection
    $('.amenities input[type="checkbox"]').change(function () {
      let amenityId = $(this).attr('data-id');
      let amenityName = $(this).attr('data-name');
  
      if ($(this).is(':checked')) {
        selectedAmenities[amenityId] = amenityName;
      } else {
        delete selectedAmenities[amenityId];
      }
  
      // ✅ Update the h4 tag inside .amenities
      let amenityList = Object.values(selectedAmenities).join(', ');
      $('.amenities h4').text(amenityList.length > 0 ? amenityList : '\u00A0');
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
    function fetchPlaces(amenityFilter = []) {
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ amenities: amenityFilter }),
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
                <div class="description">
                  ${place.description}
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
      fetchPlaces(Object.keys(selectedAmenities));
    });
  });  