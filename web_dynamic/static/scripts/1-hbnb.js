$(document).ready(function () {
    // Dictionary to store selected amenities
    let selectedAmenities = {};
  
    // Listen for changes in the checkboxes
    $('.amenities input[type="checkbox"]').change(function () {
      let amenityId = $(this).attr('data-id');
      let amenityName = $(this).attr('data-name');
  
      if ($(this).is(':checked')) {
        selectedAmenities[amenityId] = amenityName;  // Add amenity
      } else {
        delete selectedAmenities[amenityId];  // Remove if unchecked
      }
  
      // Update the <h4> tag with selected amenities
      let amenityList = Object.values(selectedAmenities).join(', ');
      if (amenityList.length > 0) {
        $('.amenities h4').text(amenityList);
      } else {
        $('.amenities h4').html('&nbsp;');  // Reset if empty
      }
    });
  });  