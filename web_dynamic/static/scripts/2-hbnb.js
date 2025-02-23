$(document).ready(function () {
    // ✅ API status check
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');  // Change to green
      } else {
        $('#api_status').removeClass('available');  // Keep gray
      }
    });
  
    // ✅ Track selected amenities
    let selectedAmenities = {};
  
    $('.amenities input[type="checkbox"]').change(function () {
      let amenityId = $(this).attr('data-id');
      let amenityName = $(this).attr('data-name');
  
      if ($(this).is(':checked')) {
        selectedAmenities[amenityId] = amenityName;
      } else {
        delete selectedAmenities[amenityId];
      }
  
      let amenityList = Object.values(selectedAmenities).join(', ');
      $('.amenities h4').text(amenityList.length > 0 ? amenityList : '\xa0'); // Non-breaking space
    });
  });  