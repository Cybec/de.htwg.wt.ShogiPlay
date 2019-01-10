var lastPM = "";
var last_clicked_id = "";
var kingSlainEnd = false;

//Helper Simulation
var helper = 0;
var helper2 = 0;
var simuList;
var simuList_All = [];
var simuCount = 1;

// $.ajax(
//     {
//         type: 'GET',
//         url: "boardToJson",
//         dataType: 'Json',
//
//         success: function (board) {
//             createNewConqueredContainer(board.playerFirstConquered, board.playerSecondConquered);
//             fillBoard(board.board)
//         }
//     }
// );

$.ajax(
    {
        type: 'GET',
        url: "SimuToJson",
        dataType: 'Json',

        success: function (simu) {
            for (var k in simu) {
                simuList_All.push(simu[k])
            }
            simuList = simuList_All[0];
        }
    }
);


$(document).on("click", ".btn", function () {
    console.log(document.getElementById('closeModal'));

    if (!kingSlainEnd) {
        clickOnBoard($(this).attr('id'));
    }
});

$(document).on("click", "#logo", function () {
    updateBoard()
});

$(document).on("click", "#Simulation", function () {
    Simulation()
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

$(document).on("click", "#closeModal", function () {
    document.getElementById('AboutModal').style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
$(document).click(function (event) {
    if (event.target.id === "AboutModal") {
        document.getElementById('AboutModal').style.display = "none";
    }
});

function newGame() {
    kingSlainEnd = false;
    lastPM = "";
    last_clicked_id = "";

    simuList = simuList_All[0];
    simuCount = 0;
    helper = 0;
    helper2 = 0;
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
    document.getElementById('AboutModal').style.display = "block";
}

function updateBoard() {
    // $.ajax(
    //     {
    //         type: 'GET',
    //         url: "boardGamefieldHTML",
    //         dataType: 'html',
    //
    //         success: function (result) {
    //             $('#gamefield').html(result)
    //         }
    //     }
    // )
    $.ajax(
        {
            type: 'GET',
            url: "boardToJson",
            dataType: 'Json',

            success: function (board) {
                createNewConqueredContainer(board.playerFirstConquered, board.playerSecondConquered);
                fillBoard(board.board)
            }
        }
    );
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
                            Promotable(destLink);
                        } else if (result === "<p>InvalidMove</p>") {
                            alert("This move is not possible!")
                        } else if (result === "<p>KingSlain</p>") {
                            KingSlain();
                        }


                        updateBoard();
                        resetGlobalVal();
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
                        updateBoard();
                        resetGlobalVal();
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


function Simulation() {
    $('#' + simuList[helper][helper2]).fadeIn(100).fadeIn(100)
        .fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
        .fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

    clickOnBoard(simuList[helper][helper2]);


    helper2 += 1;
    if (helper2 >= 2) {
        helper2 = 0;
        helper += 1;
    }
    if (helper >= simuList.length) {
        helper = 0;
        helper2 = 0;
        if (simuCount >= simuList_All.length) {
            alert("Simulation ended!");
            simuList = simuList_All[0];
            simuCount = 0;
            helper = 0;
            helper2 = 0;
        } else {
            simuList = simuList_All[simuCount];
            simuCount += 1;
        }
    }
}


function fillBoard(boardArray) {
    // console.log(boardArray);

    for (var k in boardArray) {
        var html = [];
        var id = boardArray[k].col + '-' + boardArray[k].row;
        html.push(
            "<label id=\"Label_" + id + "\" style=\"display: none;\">" + boardArray[k].posMovs + "</label>"
        );
        if (boardArray[k].piece.pieceName.trim().length === 0) {
            html.push("<img class=\"img_style\" style=\"opacity: 0;\">");
        } else {
            html.push("<img class=\"img_style\" src=\"" + boardArray[k].piece.img + "\">");
        }
        document.getElementById(id).innerHTML = html.join("");
    }

}

function createNewConqueredContainer(playerFirstCon, playerSecondCon) {

    var html = [];
    if (playerFirstCon.length === 0) {
        html.push("<img class=\"img_style\" style=\"opacity: 0;\">");
    } else {
        for (var k in playerFirstCon) {
            html.push(
                "<div id=\"" + playerFirstCon[k].pieceName.trim() + "\" class=\"conquered btn btn-primary\">",
                "<label id=\"Label_" + playerFirstCon[k].pieceName.trim() + "\" style=\"display: none;\">" + playerFirstCon[k].posMovs + "</label>",
                "<img class=\"img_style\" src=\"" + playerFirstCon[k].img + "\">",
                "</div>"
            );
        }
    }
    document.getElementById("player1Container").innerHTML = html.join("");


    var html2 = [];
    if (playerFirstCon.length === 0) {
        html2.push("<img class=\"img_style\" style=\"opacity: 0;\">");
    } else {
        for (var k in playerSecondCon) {
            html2.push(
                "<div id=\"" + playerSecondCon[k].pieceName.trim() + "\" class=\"conquered btn btn-primary\">",
                "<label id=\"Label_" + playerSecondCon[k].pieceName.trim() + "\" style=\"display: none;\">" + playerSecondCon[k].posMovs + "</label>",
                "<img class=\"img_style\" src=\"" + playerSecondCon[k].img + "\">",
                "</div>"
            );
        }
    }
    document.getElementById("player2Container").innerHTML = html2.join("");
}