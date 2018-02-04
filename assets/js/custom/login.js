$(document).ready(function () {
  $("body").css("display", "none");
  $("body").fadeIn(1000);
  
  $("#b_submit").click(function () {
    $(".error").remove();
    if ($("#username").val() == "") {
      $("#errores").fadeOut();
      $("#username").focus().after("<span class='error'>Introduzca el nombre de usuario</span>");
    } else if ($("#password").val() == "") {
      $("#errores").fadeOut();
      $("#password").focus().after("<span class='error'>Introduzca la contraseña</span>");
    } else {
      conectarUsuario();
    }
  });

  $("#username, #password").keyup(function () {
    if ($(this).val() != "") {
      $(".error").fadeOut();
    }
  });

  $("#b_reset").click(function () {
    $(".error").remove();
    $("#errores").fadeOut();
    $("#username, #password").removeClass("error-formulario");
  });

  $("#b_invited").click(function () {
    sessionStorage.setItem("user", "Invitado");
    $("html").fadeOut(200, redireccionar);
  });
});

function conectarUsuario() {
  var userValidated = false;
  var passwordValidated = false;
  var userStore = [];
  var userData = [$("#username").val(), $("#password").val()];

  for (i = 1; i < localStorage.length; i++) {
    var userID = "user_" + i;
    userStore = JSON.parse(localStorage.getItem(userID));
    if (userStore[0].toString() == userData[0].toString()) {
      userValidated = true;
    }
    if (userStore[4].toString() == userData[1].toString()) {
      passwordValidated = true;
    }
  }

  $("#username, #password").removeClass("error-formulario");
  $("#errores").fadeOut();
  if (userValidated == false) {
    $("#errores").fadeIn().text("El usuario introducido no es correcto").css("display", "block");
    $("#username").addClass("error-formulario");
  } else if (passwordValidated == false) {
    $("#errores").fadeIn().text("La contraseña introducida no es válida").css("display", "block");
    $("#password").addClass("error-formulario");
  }

  if (userValidated == true && passwordValidated == true) {
    sessionStorage.setItem("user", userData[0].toString());
    $("html").fadeOut(200, redireccionar);
  }
}

function redireccionar() {
  window.location = "../portfolio/loading.html";
}
