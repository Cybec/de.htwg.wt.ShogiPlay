var lastPM = "";
var last_clicked_id = "";
var kingSlainEnd = false;
$(document).on("click", ".btn", function () {
    if (!kingSlainEnd) {
        clickOnBoard($(this).attr('id'));
    }
});

$(document).on("click", "#logo", function () {
    updateBoard()
});

$(document).on("click", ".dropdown-item", function () {
    switch (this.innerText) {
        case "New":
            newGame();
            break;
        case "Empty":
            emptyGame();
            break;
        case "Save":
            saveGame();
            break;
        case "Load":
            loadGame();
            break;
        case "About":
            aboutGame();
            break;
        case "Undo":
            undoGame();
            break;
        case "Redo":
            redoGame();
            break;
    }
});


function newGame() {
    kingSlainEnd = false;
    $.ajax(
        {
            type: 'GET',
            url: "new",
            dataType: 'html',

            success: function () {
                updateBoard()
            }
        }
    )
}

function emptyGame() {
    $.ajax(
        {
            type: 'GET',
            url: "empty",
            dataType: 'html',

            success: function () {
                updateBoard()
            }
        }
    )
}

function undoGame() {
    $.ajax(
        {
            type: 'GET',
            url: "undo",
            dataType: 'html',

            success: function () {
                updateBoard()
            }
        }
    )
}

function redoGame() {
    $.ajax(
        {
            type: 'GET',
            url: "redo",
            dataType: 'html',

            success: function () {
                updateBoard()
            }
        }
    )
}

function saveGame() {
    $.ajax(
        {
            type: 'GET',
            url: "save",
            dataType: 'html',

            success: function () {
                updateBoard()
            }
        }
    )
}

function loadGame() {
    $.ajax(
        {
            type: 'GET',
            url: "load",
            dataType: 'html',

            success: function () {
                updateBoard()
            }
        }
    )
}

function aboutGame() {
    $.ajax(
        {
            type: 'GET',
            url: "about",
            dataType: 'html',

            success: function (result) {
                $('#gamefield').html(result)
            }
        }
    )
}

function updateBoard() {
    $.ajax(
        {
            type: 'GET',
            url: "boardGamefieldHTML",
            dataType: 'html',

            success: function (result) {
                $('#gamefield').html(result)
            }
        }
    )
}

function ResetBlueFields() {
//Set all Blue Divs back to default
    lastPM.split("-").forEach(function (item) {
        var res = item.replace("(", "").replace(")", "").replace(",", "-");
        if (res.length !== 0) {
            document.getElementById(res).style.backgroundColor = "#ffebb6";
        }
    });
}

function GetPosMovColorize(clicked_id) {
//Get possible moves
    var a = document.getElementById("Label_" + clicked_id).innerText.split("-");
    lastPM = document.getElementById("Label_" + clicked_id).innerText;

    a.forEach(function (item) {
        var res = item.replace("(", "").replace(")", "").replace(",", "-");
        if (res.length !== 0) {
            document.getElementById(res).style.backgroundColor = "blue";
        }
    });
}

function Promotable(currentLink) {
    var linkYesNo = currentLink;
    if (confirm("Do you want to Promote the Piece?")) {
        linkYesNo += "/y";
    } else {
        linkYesNo += "/n";
    }
    $.ajax(
        {
            type: 'GET',
            url: linkYesNo,
            dataType: 'html',

            success: function () {
                updateBoard()
            }
        }
    )
}

function KingSlain() {
    kingSlainEnd = true;
    if (confirm("King was slain, you won!!!\n" +
        "Confirm to begin a new game!")) {
        newGame()
    }
}

function clickOnBoard(clicked_id) {
    console.log(clicked_id);
    if (lastPM.includes(clicked_id.replace("-", ","))) {
        if ('0123456789'.indexOf(last_clicked_id.charAt(0)) !== -1) {
            var destLink = "mv/" +
                last_clicked_id.charAt(0) + "/" +
                last_clicked_id.charAt(2) + "/" +
                clicked_id.charAt(0) + "/" +
                clicked_id.charAt(2);
            $.ajax(
                {
                    type: 'GET',
                    url: destLink,
                    dataType: 'html',

                    success: function (result) {
                        if (result === "<p>Promotable</p>") {
                            Promotable(destLink)
                        } else if (result === "<p>InvalidMove</p>") {
                            alert("This move is not possible!")
                        } else if (result === "<p>KingSlain</p>") {
                            KingSlain()
                        }


                        updateBoard()
                        resetGlobalVal()
                    }
                }
            )
        } else {
            $.ajax(
                {
                    type: 'GET',
                    url: "mvcp/"
                        + last_clicked_id + "/" +
                        clicked_id.charAt(0) + "/" +
                        clicked_id.charAt(2),
                    dataType: 'html',

                    success: function () {
                        updateBoard()
                        resetGlobalVal()
                    }
                }
            )
        }
    }


    ResetBlueFields();

    GetPosMovColorize(clicked_id);

    last_clicked_id = clicked_id;
}

function resetGlobalVal() {
    lastPM = "";
    last_clicked_id = "";
}


