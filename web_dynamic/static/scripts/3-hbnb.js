$(document).ready(function () {
    // Dictionary to store selected amenities
    let selectedAmenities = {};
  
    // Listen for changes in the checkboxes
    $('.amenities input[type="checkbox"]').change(function () {
      let amenityId = $(this).attr('data-id');
      let amenityName = $(this).attr('data-name');
  
      if ($(this).is(':checked')) {
        selectedAmenities[amenityId] = amenityName; // Add amenity
      } else {
        delete selectedAmenities[amenityId]; // Remove if unchecked
      }
  
      // Update the <h4> tag with selected amenities
      let amenityList = Object.values(selectedAmenities).join(', ');
      if (amenityList.length > 0) {
        $('.amenities h4').text(amenityList);
      } else {
        $('.amenities h4').html('&nbsp;'); // Reset if empty
      }
    });
  
    // API status check
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  
    // Fetch places
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({}), // Send empty dictionary
      success: function (places) {
        $('.places').empty();
        for (let place of places) {
          $('.places').append(`
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
            </article>
          `);
        }
      }
    });
  });  