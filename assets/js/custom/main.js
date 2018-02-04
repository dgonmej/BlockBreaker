var chronometer;
var score;
var move;
var size;
var sessionUser;

$(document).ready(function() {
  $("body").css("display", "none");
  $("body").fadeIn(1000);

  sessionUser = sessionStorage.getItem("user");
  $("#user").text(sessionUser);



  $("#facil").click(function() {
    size = 10;
    iniciarJuego(3);
  });

  $("#medio").click(function() {
    size = 8;
    iniciarJuego(2);
  });

  $("#dificil").click(function() {
    size = 6;
    iniciarJuego(1);
  });

  if ($(".puntuaciones").length != 0) {
    rellenarPuntuaciones();
  }

  if ($(".perfil").length != 0) {
    rellenarDatosUsuario();
  }
});

function rellenarPuntuaciones() {
  allUsers = recogerInformacion();
  for (var i = 0; i < allUsers.length; i++) {
    $(".puntuaciones").append(
      "<h3>" + allUsers[i][0] + "</h3><span class='puntos'>" + allUsers[i][5] + "</span><br/>"
    );
  }
}

function rellenarDatosUsuario() {
  userInfo = recogerUsuario();
  $("#username").text(userInfo[1][0][0]);
  $("#name").text(userInfo[1][0][1]);
  $("#surnmae").text(userInfo[1][0][2]);
  $("#email").text(userInfo[1][0][3]);
  $("#userScore").text(userInfo[1][0][5]);
}

function iniciarJuego(minutes) {
  $("#contenedor-juego").fadeIn(1000);

  score = 0;
  actualizarPuntuacion(score);

  cargarSonidos();

  crearTablero();

  crearFiguras(3);

  reiniciarCronometro();

  iniciarCronometro(60 * minutes);

  document.getElementById("start").play();
}

function iniciarCronometro(duration) {
  var time = duration, minutes, seconds;

  chronometer = setInterval(function() {
    minutes = parseInt(time / 60, 10);
    seconds = parseInt(time % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    $("#timer").text(minutes + ":" + seconds);

    if (--time < 0) {
      time = duration;
    }

    if (minutes == 0 && seconds == 0) {
      finalizarPartida();
    }
  }, 1000);
}

function finalizarPartida() {
  if (sessionUser != "Invitado") {
    guardarPuntuacion();
  }

  clearInterval(chronometer);

  audioEnd = document.getElementById("end");
  audioEnd.loop = true;
  audioEnd.play();

  $("#dialogo").show();
  $("#dialogo").dialog({
    resizable: false,
    closeOnEscape: false,
    open: function(event, ui) {
      $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
    },
    show: {
      effect: "bounce",
      duration: 1000
    },
    hide: {
      effect: "explode",
      duration: 500
    },
    height: "auto",
    width: 400,
    modal: true,
    buttons: {
      Puntuaciones: function() {
        $(this).dialog("close");
        window.location = "score.html";
      },
      Reiniciar: function() {
        $(this).dialog("close");
        audioEnd.remove();
        switch (true) {
          case size == 10:
            iniciarJuego(3);
            break;
          case size == 8:
            iniciarJuego(2);
            break;
          case size == 6:
            iniciarJuego(1 / 10);
            break;
        }
      },
      "Ir a Inicio": function() {
        $(this).dialog("close");
        window.location = "../index.html";
      }
    }
  });
}

function guardarPuntuacion() {
  info = recogerUsuario();
  userID = info[0];
  userInfo = info[1];

  userInfo[0][5] = score;
  userInfo = JSON.stringify(userInfo[0]);
  localStorage.setItem(userID, userInfo);
}

function recogerUsuario() {
  var allUsers = [];
  var userInfo = [];
  for (var i = 1; i < localStorage.length; i++) {
    userStore = JSON.parse(localStorage.getItem("user_" + i));
    allUsers.push(userStore);

    if (allUsers[i - 1][0] == sessionUser) {
      var userID = "user_" + i;
      var user = localStorage.getItem(userID);
      user = JSON.parse(user);
      userInfo.push(user);
    }
  }
  return [userID, userInfo];
}

function reiniciarCronometro() {
  clearInterval(chronometer);
}

function insertarFuncionalidad() {
  $("ul.figuras").draggable({
    scroll: false,
    revert: "invalid",
    helper: "clone",
    cursor: "move",
    cursorAt: { top: 5, left: 5 },
    snap: true
  });

  $(".celda").droppable({
    accept: "ul.figuras",
    classes: {
      "ui-droppable-active": "ui-state-active"
    },

    drop: function(event, ui) {
      moverAlContenedor(ui.draggable, $(this));
    }
  });
}

function moverAlContenedor(item, container) {
  moverFigura(item, container);
  if (move == true) {
    item.fadeOut(function() {
      item.remove();
      document.getElementById("more").play();
    });
  } else {
    document.getElementById("denied").play();
  }
}

function crearTablero() {
  $("table").remove();

  $(".contenido").css("background-image", "none");
  var board = $("#tablero");
  table = document.createElement("table");

  for (var i = 0; i < size; i++) {
    var line = document.createElement("tr");
    line.id = "f" + i;
    for (var j = 0; j < size; j++) {
      var cell = document.createElement("td");
      cell.id = "c" + i + j;
      cell.style.border = "solid #000 1px";
      line.appendChild(cell);
      cell.className = "celda";
    }
    table.appendChild(line);
  }
  board.append(table);
}

function crearFiguras(iterations) {
  $("ul.figuras").remove();

  figures = cargarFiguras();
  var aleatory;
  for (var i = 0; i < iterations; i++) {
    aleatory = Math.round(Math.random() * 6);
    $("#figuras").append(figures[aleatory]);
  }
  insertarFuncionalidad();
}

function cargarFiguras() {
  var allFigures = [];

  allFigures.push("<ul id='O' class='figuras'><ul><li class='figura'></li><li class='figura'></li></ul><ul><li class='figura'></li><li class='figura'></li></ul></ul>");
  allFigures.push("<ul id='I' class='figuras'><li class='figura'></li><li class='figura'></li><li class='figura'></li><li class='figura'></li></ul>");
  allFigures.push("<ul id='T' class='figuras'><ul><li class='vacio'></li><li class='figura'></li><li class='vacio'></li></ul><ul><li class='figura'></li><li class='figura'></li><li class='figura'></li></ul></ul>");
  allFigures.push("<ul id='S' class='figuras'><ul><li class='vacio'></li><li class='figura'></li><li class='figura'></li></ul><ul><li class='figura'></li><li class='figura'></li><li class='vacio'></li></ul></ul>");
  allFigures.push("<ul id='Z' class='figuras'><ul><li class='figura'></li><li class='figura'></li><li class='vacio'></li></ul><ul><li class='vacio'></li><li class='figura'></li><li class='figura'></li></ul></ul>");
  allFigures.push("<ul id='L' class='figuras'><ul><li class='figura'></li><li class='figura'></li><li class='figura'></li></ul><ul><li class='figura'></li></ul></ul>");
  allFigures.push("<ul id='J' class='figuras'><ul><li class='figura'></li></ul><ul><li class='figura'></li><li class='figura'></li><li class='figura'></li></ul></ul>");
  
  return allFigures;
}

function pintarFigura(value1, value2, rest, option1, option2, size1, size2, iteration1, iteration2, type) {
  figure = [];
  var i, j, z;
  switch (true) {
    case type == 1:
      value1 = value1 - rest;
      for (i = 0; i < size1; i = i + iteration1) {
        rowAux = value1 + i + option1;
        figure.push($("#c" + value2 + rowAux));
        for (j = 0; j < size2; j = j + iteration2) {
          columnAux = value2 + j + option2;
          figure.push($("#c" + columnAux + rowAux));
        }
      }
      break;
    case type == 2:
      value1 = value1 - rest;
      for (i = 0; i < size1; i = i + iteration1) {
        columnAux = value2 + i + option1;
        figure.push($("#c" + columnAux + value1));
        for (j = 0; j < size2; j = j + iteration2) {
          rowAux = value1 + j + option2;
          figure.push($("#c" + value2 + rowAux));
        }
      }
      break;
    case type == 3:
      for (i = 0; i < size1; i = i + iteration1) {
        value1 = value1 + i + option1;
        figure.push($("#c" + value1 + value2));
        for (j = 0; j < size2; j = j + iteration2) {
          value2 = value2 + j + option2;
          figure.push($("#c" + value1 + value2));
        }
      }
      break;
  }
  asignarColor(figure);
}

function moverFigura(item, container) {
  coords = container.attr("id").split("");
  coord1 = parseInt(coords[1]);
  coord2 = parseInt(coords[2]);

  switch (true) {
    case item.attr("id") == "O":
      pintarFigura(coord2, coord1, 0, -1, 0, 2, 2, 1, 1, 1);
      break;

    case item.attr("id") == "I":
      pintarFigura(coord2, coord1, 0, -1, 0, 4, 0, 1, 1, 1);
      break;

    case item.attr("id") == "T":
      pintarFigura(coord2, coord1, 0, -1, -1, 2, 3, 2, 1, 2);
      break;

    case item.attr("id") == "J":
      pintarFigura(coord2, coord1, 1, -1, 1, 2, 2, 1, 1, 2);
      break;

    case item.attr("id") == "L":
      pintarFigura(coord2, coord1, 1, 1, 0, 1, 3, 1, 1, 2);
      break;

    case item.attr("id") == "S":
      pintarFigura(coord1, coord2, 0, 0, -1, 2, 2, 1, 1, 3);
      break;

    case item.attr("id") == "Z":
      pintarFigura(coord1, coord2, 0, 0, 0, 2, 2, 1, 1, 3);
      break;
  }
  comprobarLineas();
}

function comprobarLineas() {
  var contCol = 0;
  var contRow = 0;

  fullCol = [];
  fullRow = [];

  var i, j;

  for (i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
      if ($("#c" + j + i).hasClass("ocupado") == true) {
        contCol++;
        fullCol.push($("#c" + j + i));
        if (contCol == size) {
          items = fullCol.slice(-size);
          actualizarPuntuacion(37);
          quitarColor(items);
        }
      }
    }
    contCol = 0;
  }

  for (i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
      if ($("#c" + i + j).hasClass("ocupado") == true) {
        contRow++;
        fullRow.push($("#c" + i + j));
        if (contRow == size) {
          items = fullRow.slice(-size);
          actualizarPuntuacion(24);
          quitarColor(items);
        }
      }
    }
    contRow = 0;
  }

  if ($("#figuras").children().length - 2 == 0) {
    crearFiguras(3);
  }
}

function asignarColor(items) {
  move = true;
  for (var i = 0; i < items.length; i++) {
    if (items[i].hasClass("ocupado") == true) {
      move = false;
      i = items.length;
    }
  }
  for (var j = 0; j < items.length; j++) {
    if (move == true) {
      items[j].addClass("ocupado");
      document.getElementById("piece").play();
    }
  }
}

function quitarColor(items) {
  for (var i = 0; i < items.length; i++) {
    items[i].removeClass("ocupado");
  }
  document.getElementById("line").play();
}

function actualizarPuntuacion(points) {
  score = score + points;
  $("#score").text(score);
}

function cargarSonidos() {
  start = $("<audio/>", {
    id: "start",
    src: "../assets/audio/start.mp3"
  });
  piece = $("<audio/>", {
    id: "piece",
    src: "../assets/audio/piece.mp3"
  });
  more = $("<audio/>", {
    id: "more",
    src: "../assets/audio/more.mp3"
  });
  line = $("<audio/>", {
    id: "line",
    src: "../assets/audio/line.mp3"
  });
  denied = $("<audio/>", {
    id: "denied",
    src: "../assets/audio/denied.mp3"
  });
  end = $("<audio/>", {
    id: "end",
    src: "../assets/audio/end.mp3"
  });

  $("main").append(start, piece, more, line, denied, end);
}

function recogerInformacion() {
  var allUsers = [];
  var userInfo = [];

  for (var i = 1; i < localStorage.length; i++) {
    var userID = "user_" + i;
    userStore = JSON.parse(localStorage.getItem(userID));
    allUsers.push(userStore);
  }
  return allUsers;
}
