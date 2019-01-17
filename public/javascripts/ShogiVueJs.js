var lastPM = "";
var last_clicked_id = "";
var kingSlainEnd = false;

//Helper Simulation
var helper = 0;
var helper2 = 0;
var simuList;
var simuList_All = [];
var simuCount = 1;

function scalingIMG() {
    var width = document.getElementById('player1Container').getBoundingClientRect().width;
    // var height = document.getElementById('starter-template').getBoundingClientRect().height;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    height -= $('#Navbar').outerHeight(true);

    var els = document.getElementsByClassName("img_style");

    var square = 0;
    if (height < width) {
        square = height / 14;
    } else {
        square = width / 14;
    }

    // console.log(width);
    // console.log(height);
    // console.log(square);

    [].forEach.call(els, function (el) {
        el.style.width = square + "px";
        el.style.height = square + "px";
    });
}

document.getElementsByTagName("BODY")[0].onresize = function () {
    scalingIMG();
};


//Load Simu on start
$(document).ready(function () {
    scalingIMG();
    console.log("Document is ready");
    //get simulation list
    $.ajax(
        {
            type: 'GET',
            url: "shogi/SimuToJson",
            dataType: 'Json',

            success: function (simu) {
                for (var k in simu) {
                    simuList_All.push(simu[k])
                }
                simuList = simuList_All[0];
            }
        }
    );
});

//Close About
new Vue({
    el: '#closeModal',
    methods: {
        close: function () {
            document.getElementById('AboutModal').style.display = "none";
        }
    }
});
$(document).click(function (event) {
    if (event.target.id === "AboutModal") {
        document.getElementById('AboutModal').style.display = "none";
    }
});

//laod Playfield on startup and init "const PlayField" + click piece event handler
const PlayField = new Vue({
    el: '#PlayingField',
    data: {
        size: 9,
        posMoves: [],
        playerFirstCon: [],
        playerSecondCon: [],
        img: []
    },
    created() {
        fetch('shogi/boardToJson')
            .then(response => response.json())
            .then(json => {
                update(this);
            })
    },
    methods: {
        pieceClicked: function (event) {
            if (!kingSlainEnd) {
                clickOnBoard(event.currentTarget.id);
            }
        }
    }
});

//Navbar
new Vue({
    el: '#Navbar',
    methods: {
        newGame: function () {
            newGame();
        },
        emptyGame: function () {
            fetch('shogi/empty')
                .then(response => response.json())
                .then(json => {
                    update();
                })
        },
        saveGame: function () {
            fetch('shogi/save')
                .then(response => response.json())
                .then(json => {
                    update();
                })
        },
        loadGame: function () {
            fetch('shogi/load')
                .then(response => response.json())
                .then(json => {
                    update();
                })
        },
        aboutGame: function () {
            document.getElementById('AboutModal').style.display = "block";
        },
        undoGame: function () {
            fetch('shogi/undo')
                .then(response => response.json())
                .then(json => {
                    update();
                })
        },
        redoGame: function () {
            fetch('shogi/redo')
                .then(response => response.json())
                .then(json => {
                    update();
                })
        },
        simulation: function () {
            Simulation()
        },
        logo: function () {
            update();
        }
    }
});

function update() {
    fetch('shogi/boardToJson')
        .then(response => response.json())
        .then(json => {
            //Reset Conquered
            PlayField.playerFirstCon = [];
            PlayField.playerSecondCon = [];

            let i;
            for (i = 0; i < json.board.length; i++) {
                Vue.set(PlayField.posMoves, i, json.board[i].posMovs);
                Vue.set(PlayField.img, i, json.board[i].piece.img);
            }
            for (i = 0; i < json.playerFirstConquered.length; i++) {
                Vue.set(PlayField.playerFirstCon, i, {
                    img: json.playerFirstConquered[i].img,
                    name: json.playerFirstConquered[i].pieceName.trim(),
                    posMoves: json.playerFirstConquered[i].posMovs
                });
            }
            for (i = 0; i < json.playerSecondConquered.length; i++) {
                Vue.set(PlayField.playerSecondCon, i, {
                    img: json.playerSecondConquered[i].img,
                    name: json.playerSecondConquered[i].pieceName.trim(),
                    posMoves: json.playerSecondConquered[i].posMovs
                });
            }
        })

    scalingIMG();
}

function clickOnBoard(clicked_id) {
    if (lastPM.includes(clicked_id.replace("-", ","))) {
        if ('0123456789'.indexOf(last_clicked_id.charAt(0)) !== -1) {
            var destLink = "shogi/mv/" +
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
                        update();
                        resetGlobalVal();
                    }
                }
            )
        } else {
            $.ajax(
                {
                    type: 'GET',
                    url: "shogi/mvcp/"
                        + last_clicked_id + "/" +
                        clicked_id.charAt(0) + "/" +
                        clicked_id.charAt(2),
                    dataType: 'html',

                    success: function () {
                        update();
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
                update();
            }
        }
    )
}

function KingSlain() {
    kingSlainEnd = true;
    if (confirm("King was slain, you won!!!\n" +
        "Confirm to begin a new game!")) {
        newGame();
    }
}

function newGame() {
    kingSlainEnd = false;
    lastPM = "";
    last_clicked_id = "";

    simuList = simuList_All[0];
    simuCount = 0;
    helper = 0;
    helper2 = 0;
    fetch('shogi/new')
        .then(response => response.json())
        .then(json => {
            update();
        })
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
