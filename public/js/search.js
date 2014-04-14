$(document).ready(function() {
  $(".li-home").removeClass("active");
  $(".li-search").addClass("active");
  $(".li-add").removeClass("active");
  $.ajax("/getAll").done(prepairSearch);
});
