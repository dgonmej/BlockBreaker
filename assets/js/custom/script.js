$(document).ready(function() {
  $("body").css("display", "none");
  $("body").fadeIn(1000);

  $( "#acordeon" ).accordion({
    heightStyle: "content",
  });
});
