var getSearchForm = function(e) {
  e.preventDefault();
  $.ajax("/search").done(function(data) {
    $(".main-form").html(data);
    $(".collapse").collapse("hide");
  });
};

var getAddForm = function(e) {
  e.preventDefault();
  $.ajax("/add").done(function(data) {
    $(".main-form").html(data);
    $(".collapse").collapse("hide");
  });
};

var onlyUnique = function(value, index, self) {
  return self.indexOf(value) === index;
};

var postRemove = function(e) {
  e.preventDefault();
  var id = this.name;

  $.ajax({
    type: "POST",
    url: "/remove",
    data: {
      year: $("#" + id + " input[name='year']").val(),
      month: $("#" + id + " input[name='month']").val(),
      org: $("#" + id + " input[name='org']").val(),
      region: $("#" + id + " input[name='region']").val()
    }
  }).done(function(res) {
    var data = JSON.parse(res);

    // https://stackoverflow.com/questions/467336/jquery-how-to-use-slidedown-or-show-function-on-a-table-row
    if (data.response) {
      $("#tr-" + id).find('td')
      .wrapInner('<div style="display: block;" />')
      .parent()
      .find('td > div')
      .slideUp(400, function(){
        $(this).parent().parent().remove();
      });
    }
  });
};

var populateTable = function(data) {
  $(".table tbody").html(function(data) {
    return data.map(function(val, key) {
      return "<tr class=\"text-center\" id=\"tr-form-" + key + "\">" +
        "<td>" + val.year + "</td>" +
        "<td>" + val.month + "</td>" +
        "<td>" + val.org + "</td>" +
        "<td>" + val.region + "</td>" +
        "<td><form method=\"POST\" action=\"/remove\" id=\"form-" + key + "\">" +
        "<input type=\"hidden\" name=\"year\" value=\"" + val.year + "\">" +
        "<input type=\"hidden\" name=\"month\" value=\"" + val.month + "\">" +
        "<input type=\"hidden\" name=\"org\" value=\"" + val.org + "\">" +
        "<input type=\"hidden\" name=\"region\" value=\"" + val.region + "\">" +
        "<a href=\"/remove\" name=\"form-" + key + "\" class=\"a-remove\">" +
        "<i class=\"fa fa-trash-o fa-fw\"></i></a></form></td>" +
        "</tr>";
    }).join("");
  }(data));

  $("a.a-remove").click(postRemove);
};

var populateFilteredTable = function(data) {
  var year = $("select.input-year").val();
  var month = $("select.input-month").val();
  var org = $("select.input-org").val();
  var region = $("select.input-region").val();

  var filterData = data.filter(function(val) {
    return (
      (!year || (String(val.year) == year)) &&
      (!month || (val.month == month)) &&
      (!org || (val.org == org)) &&
      (!region || (val.region == region))
    );
  });

  populateTable(filterData);
  console.log("here");
};

var prepairSearch = function(res) {
  var data = JSON.parse(res);

  // get data for select lists
  var years = data.map(function(val) { return String(val.year); }).filter(onlyUnique);
  years.forEach(function(val) {
    $("select.input-year").append("<option>" + val + "</option>");
  });

  var months = data.map(function(val) { return val.month; }).filter(onlyUnique);
  months.forEach(function(val) {
    $("select.input-month").append("<option>" + val + "</option>");
  });

  var orgs = data.map(function(val) { return val.org; }).filter(onlyUnique);
  orgs.forEach(function(val) {
    $("select.input-org").append("<option>" + val + "</option>");
  });

  var regions = data.map(function(val) { return val.region; }).filter(onlyUnique);
  regions.forEach(function(val) {
    $("select.input-region").append("<option>" + val + "</option>");
  });

  // bind filter to select lists
  $("select.input-year").change(data, function() {
    populateFilteredTable(data);
  }).change();

  $("select.input-month").change(data, function() {
    populateFilteredTable(data);
  }).change();

  $("select.input-org").change(data, function() {
    populateFilteredTable(data);
  }).change();

  $("select.input-region").change(data, function() {
    populateFilteredTable(data);
  }).change();
};

var prepairAdd = function(res) {
  var data = JSON.parse(res);

  var years = data.map(function(val) { return String(val.year); }).filter(onlyUnique);
  $("input.input-year").autocomplete({
    source: years,
    delay: 100,
    autoFocus: true
  });

  var orgs = data.map(function(val) { return val.org; }).filter(onlyUnique);
  $("input.input-org").autocomplete({
    source: orgs,
    delay: 100,
    autoFocus: true
  });

  var regions = data.map(function(val) { return val.region; }).filter(onlyUnique);
  $("input.input-region").autocomplete({
    source: regions,
    delay: 100,
    autoFocus: true
  });

};
