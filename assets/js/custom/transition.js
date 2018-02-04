var time;

$(document).ready(function() {
  $("body").css("display", "none");
  $("body").fadeIn(500);

  load = $("<audio/>", {
    id: "load",
    src: "../assets/audio/load.mp3"
  });
  $(".contenedor").append(load);
  document.getElementById("load").play();

  time = window.setTimeout(function() {
    clearTimeout(time);
    $("html").fadeOut(500, redireccionar);
  }, 8000);

  function redireccionar() {
    window.location = "../portfolio/game.html";
  }
});
