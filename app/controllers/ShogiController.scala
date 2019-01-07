package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.Shogi.Shogi
import de.htwg.se.Shogi.aview.Tui
import de.htwg.se.Shogi.controller.controllerComponent.MoveResult

@Singleton
class ShogiController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController = Shogi.controller
  val tui = new Tui(gameController)

  def shogiAsText: String = gameController.boardToString()

  def boardOkHTML = Ok(views.html.shogi(gameController, gameController.boardSize))

  def shogi = Action {
    boardOkHTML
  }

  def emptyBoard = Action {
    gameController.createEmptyBoard()
    boardOkHTML
  }

  def newBoard() = Action {
    gameController.createNewBoard()
    boardOkHTML
  }

  def undo = Action {
    gameController.undoCommand
    boardOkHTML
  }

  def redo = Action {
    gameController.redoCommand
    boardOkHTML
  }

  def possibleMoves(x: Int, y: Int) = Action {
    val list = gameController.getPossibleMoves(x, y)
    if (list.isEmpty) {
      Ok(gameController.boardToString() + "\n\n" + "There are no moves!")
    } else {
      Ok(gameController.boardToString() + "\n\n" + list.toString())
    }
  }

  def movePiece(x: Int, y: Int, i: Int, j: Int) = Action {
    gameController.movePiece((x, y), (i, j)) match {
      case MoveResult.invalidMove => Ok(gameController.boardToString() + "\n\n" + "<h1>This move is not valid</h1>")
      case MoveResult.validMove => {
        if (gameController.promotable((i, j))) {
          Ok(views.html.shogi_YesNo(gameController, gameController.boardSize))
        } else
          boardOkHTML
      }
      case MoveResult.kingSlain => Ok(views.html.shogi_YesNoNewGame(gameController, gameController.boardSize))
    }
  }


  def promotePiece(x: Int, y: Int, i: Int, j: Int, promotion: String) = Action {
    if (promotion == "y")
      gameController.promotePiece(i, j)
    boardOkHTML
  }

  def moveConqueredPiece(pieceAbbrevation: String, x: Int, y: Int) = Action {
    if (gameController.moveConqueredPiece(pieceAbbrevation, (x, y))) {
      boardOkHTML
    } else {
      Ok(gameController.boardToString() + "\n\n" + "<h1>This move is not valid</h1>")
    }
  }


  def possibleMovesConqueredPiece(pieceAbbrevation: String) = Action {
    val list = gameController.getPossibleMovesConqueredPiece(pieceAbbrevation)
    if (list.isEmpty) {
      Ok(gameController.boardToString() + "\n\n" + "</h1>There are no moves!</h1>")
    } else {
      Ok(gameController.boardToString() + "\n\n" + list.toString())
    }
  }

  def save() = Action {
    gameController.save
    boardOkHTML
  }

  def load() = Action {
    gameController.load
    boardOkHTML
  }

  def end() = Action {
    Ok(views.html.shogiPlain(gameController, gameController.boardSize))
  }

  def about = Action {
    Ok(views.html.aboutTheGame())
  }
}