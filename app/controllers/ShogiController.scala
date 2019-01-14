package controllers

import akka.actor.ActorSystem
import akka.stream.Materializer
import de.htwg.se.Shogi.Shogi
import de.htwg.se.Shogi.aview.Tui
import de.htwg.se.Shogi.controller.controllerComponent.{ControllerInterface, MoveResult}
import de.htwg.se.Shogi.model.pieceComponent.PieceInterface
import javax.inject._
import play.api.libs.json._
import play.api.mvc._


@Singleton
class ShogiController @Inject()(cc: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {
  val gameController: ControllerInterface = Shogi.controller
  val tui = new Tui(gameController)

  def shogiAsText: String = gameController.boardToString()

  def boardOkHTML: Result = Ok(views.html.shogi())

  def shogi: Action[AnyContent] = Action {
    boardOkHTML
  }

  def emptyBoard: Action[AnyContent] = Action {
    gameController.createEmptyBoard()
    Ok(JsonBoard())
  }

  def newBoard(): Action[AnyContent] = Action {
    gameController.createNewBoard()
    Ok(JsonBoard())
  }

  def undo: Action[AnyContent] = Action {
    gameController.undoCommand
    Ok(JsonBoard())
  }

  def redo: Action[AnyContent] = Action {
    gameController.redoCommand
    Ok(JsonBoard())
  }

  def possibleMoves(x: Int, y: Int): Action[AnyContent] = Action {
    val list = gameController.getPossibleMoves(x, y)
    if (list.isEmpty) {
      Ok(gameController.boardToString() + "\n\n" + "There are no moves!")
    } else {
      Ok(gameController.boardToString() + "\n\n" + list.toString())
    }
  }

  def movePiece(x: Int, y: Int, i: Int, j: Int): Action[AnyContent] = Action {
    gameController.movePiece((x, y), (i, j)) match {
      case MoveResult.invalidMove => Ok("<p>InvalidMove</p>")
      case MoveResult.validMove =>
        if (gameController.promotable((i, j))) {
          Ok("<p>Promotable</p>")
        } else
          Ok(JsonBoard())
      case MoveResult.kingSlain => Ok("<p>KingSlain</p>")
    }
  }

  def promotePiece(x: Int, y: Int, i: Int, j: Int, promotion: String): Action[AnyContent] = Action {
    if (promotion == "y")
      gameController.promotePiece(i, j)
    Ok(JsonBoard())
  }

  def moveConqueredPiece(pieceAbbrevation: String, x: Int, y: Int): Action[AnyContent] = Action {
    if (gameController.moveConqueredPiece(pieceAbbrevation, (x, y))) {
      Ok(JsonBoard())
    } else {
      Ok(gameController.boardToString() + "\n\n" + "<h1>This move is not valid</h1>")
    }
  }

  def possibleMovesConqueredPiece(pieceAbbrevation: String): Action[AnyContent] = Action {
    val list = gameController.getPossibleMovesConqueredPiece(pieceAbbrevation)
    if (list.isEmpty) {
      Ok(gameController.boardToString() + "\n\n" + "</h1>There are no moves!</h1>")
    } else {
      Ok(gameController.boardToString() + "\n\n" + list.toString())
    }
  }

  def save(): Action[AnyContent] = Action {
    gameController.save
    Ok(JsonBoard())
  }

  def load(): Action[AnyContent] = Action {
    gameController.load
    Ok(JsonBoard())
  }

  def end(): Action[AnyContent] = Action {
    Ok(views.html.shogiPlain(gameController, gameController.boardSize))
  }

  def about: Action[AnyContent] = Action {
    Ok(views.html.aboutTheGame())
  }

  def SimuToJson: Action[AnyContent] = Action {
    val jsonArrayOfStrings_1: JsValue = Json.toJson(List("6-2", "6-3"), List("7-6", "7-5"),
      List("1-2", "1-3"), List("7-5", "7-4"), List("1-3", "1-4"), List("3-8", "2-7"), List("7-1", "6-2"),
      List("2-6", "2-5"), List("6-0", "7-1"), List("1-7", "6-2"), List("7-1", "6-2"), List("2-8", "1-7"),
      List("5-0", "6-1"), List("1-7", "2-6"), List("2-0", "2-1"), List("6-8", "5-7"), List("2-1", "1-2"),
      List("6-6", "6-5"), List("1-2", "1-3"), List("0-6", "0-5"), List("0-2", "0-3"), List("5-7", "6-6"))
    val jsonArrayOfStrings_2: JsValue = Json.toJson(List("0-3", "0-4"), List("0-5", "0-4"),
      List("1-3", "0-4"), List("0-8", "0-4"), List("0-0", "0-4"), List("P", "0-3"), List("P°", "0-1"),
      List("2-6", "3-5"), List("1-4", "1-5"), List("B", "8-7"), List("1-1", "1-2"), List("1-6", "1-5"),
      List("1-2", "1-5"), List("SG", "1-6"), List("1-5", "1-3"), List("3-5", "2-4"), List("1-3", "4-3"),
      List("4-8", "3-7"), List("3-0", "2-0"), List("P", "1-1"), List("4-0", "3-1"), List("2-4", "1-5"))
    val jsonArrayOfStrings_3: JsValue = Json.toJson(List("4-3", "0-3"), List("1-8", "2-6"),
      List("1-0", "0-2"), List("6-6", "5-5"), List("L°", "1-2"), List("1-5", "0-4"), List("0-3", "0-4"),
      List("L", "0-5"), List("P°", "1-5"), List("0-5", "0-4"), List("1-5", "1-6"), List("0-4", "0-2"),
      List("0-1", "0-2"), List("R", "0-1"), List("1-6", "2-7"), List("3-7", "2-7"), List("SG°", "4-7"),
      List("2-7", "3-7"), List("4-7", "5-8"), List("1-1", "1-0"), List("P°", "1-1"), List("1-0", "2-0"))
    val jsonArrayOfStrings_4: JsValue = Json.toJson(List("GG°", "2-7"), List("3-7", "4-8"),
      List("GG°", "4-7"), List("7-7", "4-7"), List("5-8", "4-8"))
    Ok(Json.obj(
      "jsonArrayOfStrings1" -> jsonArrayOfStrings_1,
      "jsonArrayOfStrings2" -> jsonArrayOfStrings_2,
      "jsonArrayOfStrings3" -> jsonArrayOfStrings_3,
      "jsonArrayOfStrings4" -> jsonArrayOfStrings_4
    ))
  }

  def boardToJson(): Action[AnyContent] = Action {
    Ok(JsonBoard())
  }

  def JsonBoard(): JsObject = {
    implicit val cellWrites: Writes[PieceInterface] = (piece: PieceInterface) => {
      val player = if (piece.isFirstOwner) "1" else "2"
      val img = "/assets/images/player" + player + "/1000x1000/" + piece.toStringLong + ".png"

      Json.obj(
        "pieceName" -> piece.toString,
        "firstPlayer" -> piece.isFirstOwner,
        "toStringLong" -> piece.toStringLong,
        "posMovs" -> gameController.getPossibleMovesConqueredPiece(piece.toString.trim).mkString("-"),
        "img" -> img)
    }


    val board = gameController.getBoardClone

    Json.obj(
      "playerFirstConquered" -> Json.toJson(board.getContainer._1),
      "playerSecondConquered" -> Json.toJson(board.getContainer._2),
      "board" -> Json.toJson(
        for {
          col <- 0 until board.size
          row <- 0 until board.size
          cell = board.cell(col, row)
        } yield {
          Json.obj(
            "row" -> row,
            "col" -> col,
            "posMovs" -> gameController.getPossibleMoves((col, row)).mkString("-"),
            "piece" -> Json.toJson(board.cell(col, row))
          )
        }))
  }
}





















