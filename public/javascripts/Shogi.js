function myFunction(clicked_id, controller) {
    document.getElementById(clicked_id).style.backgroundColor = "red";
    // controller.getPossibleMoves((col, row))
    alert(clicked_id.split("-"));
}