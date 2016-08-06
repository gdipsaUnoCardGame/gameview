var rootURL = "http://localhost:18815/uno/api/games";

var currentGame;

// Nothing to start or delete in initial application state
$('#btnDelete').hide();
$('#btnStart').hide();
$('#mainArea').hide();

$('#btnSave').click(function () {
    if ($('#gameId').val() == '')
        createGame();
    return false;
});

$('#btnStart').click(function () {
    if ($('#gameId').val() != '')
        startGame();
    return false;
});

$('#btnDelete').click(function () {
    deleteGame();
    return false;
});

$('#gameList a').live('click', function () {
    findById($(this).data('identity'));
});


function findAll() {
    //console.log('findAll');
    $.ajax({
        type: 'GET',
        url: rootURL,
        dataType: "json", // data type of response
        success: renderList
    });
}

function findById(id) {
    console.log('findById: ' + id);
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + id,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('#game_view').hide();
            $('#create_view').show();
            console.log('findById success: ' + data.name);
            currentGame = data;
            renderGameView(currentGame);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('findById error: ' + errorThrown);
        }
    });
}

function createGame() {
    console.log('createGame');
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            $('#btnDelete').show();
            $('#gameId').val(data.id);
            findAll();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('createGame error: ' + textStatus);
        }
    });
}

function startGame() {
    console.log('startGame');
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL + '/' + $('#gameId').val(),
        dataType: "json",
        data: formToJSON(),
        success: function (result) {
            console.log('success');
            $('#create_view').hide();
            $('#gname').html('<h1>' + result.name + '</h1>');
            $('#playerList li').remove();
            $.each(result, function (i, game) {
                var list = game == null ? [] : (game instanceof Array ? game : [game]);
                if (game instanceof Array) {
                    $.each(list, function (j, player) {
                        $('#playerList').append('<li><a href="#" data-identity="' + player.id + '">' + player.name + ' [' + player.id + ']</a></li>');
                    });
                }
            });
        }
    });
}

function deleteGame() {
    console.log('deleteGame');
    $.ajax({
        type: 'DELETE',
        url: rootURL + '/' + $('#gameId').val(),
        success: function (data, textStatus, jqXHR) {
            findAll();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('deleteGame error');
        }
    });
}

function renderList(result, status, xhr) {
    // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
    console.log('renderList');
    var list = result == null ? [] : (result instanceof Array ? result : [result]);

    $('#gameList li').remove();
    $.each(list, function (index, game) {
        $('#gameList').append('<li><a href="#" data-identity="' + game.id + '">' + game.name + ' - ' + game.status + '</a></li>');
    });
}

function renderGameView(game) {
    console.log('renderGameView');
    $('#gameId1').val(game.id);
    $('#title1').val(game.name);
    var result = game.players;
    var list = result == null ? [] : (result instanceof Array ? result : [result]);

    $('#playerList li').remove();
    $.each(list, function (index, player) {
        $('#playerList').append('<li><a href="#" data-identity="' + player.id + '">' + player.name + '</a></li>');
    });
}

function renderDetails(game) {
    $('#gameId').val(game.id);
    $('#name').val(game.name);

    if (game.status == "STARTED")
        $('#btnStart').hide();
    else if (game.status == "WAITING") {
        $('#btnStart').show();
        $('#btnDelete').hide();
    }
}

function renderGameView(game) {
    $('#gameId').val(game.id);
    $('#title').val(game.name);
    $('#mainArea').show();

    if (game.status == "STARTED")
        $('#btnStart').hide();
    else if (game.status == "WAITING") {
        $('#btnStart').show();
        $('#btnDelete').hide();
    }
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
    var gameId = $('#gameId').val();
    return JSON.stringify({
        "id": gameId == "" ? null : gameId,
        "name": $('#name').val(),
        "status": $('#status').val()
    });
}
