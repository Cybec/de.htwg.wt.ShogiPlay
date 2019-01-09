package controllers

import de.htwg.se.Shogi.Shogi
import de.htwg.se.Shogi.aview.Tui
import de.htwg.se.Shogi.controller.controllerComponent.{ControllerInterface, MoveResult}
import de.htwg.se.Shogi.model.pieceComponent.PieceInterface
import javax.inject._
import play.api.libs.json._
import play.api.mvc._

@Singleton
class ShogiController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController: ControllerInterface = Shogi.controller
  val tui = new Tui(gameController)

  def shogiAsText: String = gameController.boardToString()

  def boardOkHTML: Result = Ok(views.html.shogi(gameController, gameController.boardSize))

  def shogi: Action[AnyContent] = Action {
    boardOkHTML
  }

  def emptyBoard: Action[AnyContent] = Action {
    gameController.createEmptyBoard()
    boardOkHTML
  }

  def newBoard(): Action[AnyContent] = Action {
    gameController.createNewBoard()
    boardOkHTML
  }

  def undo: Action[AnyContent] = Action {
    gameController.undoCommand
    boardOkHTML
  }

  def redo: Action[AnyContent] = Action {
    gameController.redoCommand
    boardOkHTML
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
          boardOkHTML
      case MoveResult.kingSlain => Ok("<p>KingSlain</p>")
    }
  }


  def promotePiece(x: Int, y: Int, i: Int, j: Int, promotion: String): Action[AnyContent] = Action {
    if (promotion == "y")
      gameController.promotePiece(i, j)
    boardOkHTML
  }

  def moveConqueredPiece(pieceAbbrevation: String, x: Int, y: Int): Action[AnyContent] = Action {
    if (gameController.moveConqueredPiece(pieceAbbrevation, (x, y))) {
      boardOkHTML
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
    boardOkHTML
  }

  def load(): Action[AnyContent] = Action {
    gameController.load
    boardOkHTML
  }

  def end(): Action[AnyContent] = Action {
    Ok(views.html.shogiPlain(gameController, gameController.boardSize))
  }

  def about: Action[AnyContent] = Action {
    Ok(views.html.aboutTheGame())
  }


  implicit val cellWrites: Writes[PieceInterface] = (piece: PieceInterface) => Json.obj(
    "pieceName" -> piece.toStringLong,
    "firstPlayer" -> piece.isFirstOwner)

  def boardGamefieldHTML: Action[AnyContent] = Action {
//    //    implicit val format = Json.format[PieceInterface]
//    val board = gameController.getBoardClone
//
//    Ok(Json.obj(
//      "playerFirstConquered" -> Json.toJson(board.getContainer._1.distinct),
//      "playerSecondConquered" -> Json.toJson(board.getContainer._2.distinct),
//      "board" -> Json.toJson(
//        for {
//          col <- 0 until board.size
//          row <- 0 until board.size
//        } yield {
//          Json.obj(
//            "row" -> row,
//            "col" -> col,
//            "piece" -> Json.toJson(board.cell(col, row)))
//        }))
//    )
    Ok(views.html.shogiGamefield(gameController, gameController.boardSize))
  }
}





















