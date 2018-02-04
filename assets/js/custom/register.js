$(document).ready(function () {
  $("body").css("display", "none");
  $("body").fadeIn(1000);

  var emailReg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
  $("#b_submit").click(function () {
    $(".error").remove();
    if ($("#username").val() == "") {
      $("#errores").fadeOut();
      $("#username").focus().after("<span class='error'>No puede estar vacío</span>");
    } else if ($("#name").val() == "") {
      $("#errores").fadeOut();
      $("#name").focus().after("<span class='error'>No puede estar vacío</span>");
    } else if ($("#surname").val() == "") {
      $("#errores").fadeOut();
      $("#surname").focus().after("<span class='error'>No puede estar vacío</span>");
    } else if ($("#email").val() == "") {
      $("#errores").fadeOut();
      $("#email").focus().after("<span class='error'>No puede estar vacío</span>");
    } else if (!emailReg.test($("#email").val())) {
      $("#errores").fadeOut();
      $("#email").focus().after("<span class='error'>Introduzca un email correcto</span>");
    } else if ($("#password").val() == "") {
      $("#errores").fadeOut();
      $("#password").focus().after("<span class='error'>Introduzca una contraseña</span>");
    } else if ($("#password_2").val() == "") {
      $("#errores").fadeOut();
      $("#password_2").focus().after("<span class='error'>Repita la contraseña</span>");
    } else if ($("#password").val() != $("#password_2").val()) {
      $("#errores").fadeOut();
      $("#password_2").focus().after("<span class='error'>Las contraseñas no coinciden</span>");
    } else {
      insertarUsuario();
    }
  });

  $("#username, #name, #surname, #password, #password_2").keyup(function () {
    if ($(this).val() != "") {
      $(".error").fadeOut();
    }
  });

  $("#email").keyup(function () {
    if ($(this).val() != "" && emailReg.test($(this).val())) {
        $(".error").fadeOut();
    }
});

  $("#b_reset").click(function () {
    $(".error").remove();
    $("#errores").fadeOut();
    $("#username, #email, #password, #password_2").removeClass("error-formulario");
  });
});

function insertarUsuario() {
  var userValidated = false;
  var userStore = [];

  var user = $("#username").val();
  var name = $("#name").val();
  var surname = $("#surname").val();
  var email = $("#email").val();
  var password = $("#password").val();
  var score = 0;
  var userData = [user, name, surname, email, password, score];

  var userNumber = localStorage.getItem("userID");
  if (userNumber == null) {
    userNumber = 0;
  }
  userNumber++;

  $("#errores").fadeOut();

  for (i = 1; i <= localStorage.length - 1; i++) {
    var userID = "user_" + i;
    userStore = JSON.parse(localStorage.getItem(userID));

    $("#username, #email, #password, #password_2").removeClass("error-formulario");
    if (userStore[0].toString() == userData[0].toString()) {
      $("#errores").fadeIn().text("El nombre de usuario no está disponible").css("display", "block");
      $("#username").addClass("error-formulario");
      userValidated = true;
    }
    if (userStore[3].toString() == userData[3].toString()) {
      $("#errores").fadeIn().text("Ya existe un usuario con este email").css("display", "block");
      $("#email").addClass("error-formulario");
      userValidated = true;
    }
  }

  if (userValidated == false) {
    localStorage.setItem("user_" + userNumber, JSON.stringify(userData));
    localStorage.setItem("userID", userNumber);
    location.href = "../portfolio/login.html";
  }
}