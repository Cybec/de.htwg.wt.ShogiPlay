var lastPM = "";
var last_clicked_id = "";


$(document).ready(function () {
    $(".btn").click(function () {
        clickOnBoard($(this).attr('id'));
        // alert($(this).id)

    });
});


function clickOnBoard(clicked_id) {
    if (lastPM.includes(clicked_id.replace("-", ","))) {
        if ('0123456789'.indexOf(last_clicked_id.charAt(0)) !== -1) {
            window.location.replace("http://localhost:9000/mv/" +
                last_clicked_id.charAt(0) + "/" +
                last_clicked_id.charAt(2) + "/" +
                clicked_id.charAt(0) + "/" +
                clicked_id.charAt(2));
        } else {
            window.location.replace("http://localhost:9000/mvcp/"
                + last_clicked_id + "/" +
                clicked_id.charAt(0) + "/" +
                clicked_id.charAt(2));
        }
    }


    //Set all Blue Divs back to default
    lastPM.split("-").forEach(function (item) {
        var res = item.replace("(", "").replace(")", "").replace(",", "-");
        if (res.length !== 0) {
            document.getElementById(res).style.backgroundColor = "#ffebb6";
        }
    });

    //Get possible moves
    var a = document.getElementById("Label_" + clicked_id).innerText.split("-");
    lastPM = document.getElementById("Label_" + clicked_id).innerText;

    a.forEach(function (item) {
        var res = item.replace("(", "").replace(")", "").replace(",", "-");
        if (res.length !== 0) {
            document.getElementById(res).style.backgroundColor = "blue";
        }
    });
    last_clicked_id = clicked_id;
}



