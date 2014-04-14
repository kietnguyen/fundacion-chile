$(document).ready(function() {
  $(".li-home").removeClass("active");
  $(".li-search").removeClass("active");
  $(".li-add").addClass("active");
  $.ajax("/getAll").done(prepairAdd);
});
