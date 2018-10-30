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
  def shogiAsText =  gameController.boardToString()
  def shogi = Action {
    Ok(gameController.boardToString())
  }

  def emptyBoard = Action {
    gameController.createEmptyBoard()
    Ok(gameController.boardToString())
  }

  def newBoard() = Action {
    gameController.createNewBoard()
    Ok(gameController.boardToString())
  }

  def undo = Action {
    gameController.undoCommand
    Ok(gameController.boardToString())
  }

  def redo = Action {
    gameController.redoCommand
    Ok(gameController.boardToString())
  }

  def possibleMoves(x:Int, y:Int) = Action {
    val list = gameController.getPossibleMoves(x,y)
    if(list.isEmpty){
      Ok(gameController.boardToString() + "\n\n" + "There are no moves!")
    }else{
      Ok(gameController.boardToString() + "\n\n" + list.toString())
    }
  }

  def movePiece(x:Int, y:Int, i:Int, j:Int) = Action {
    gameController.movePiece((x, y), (i, j)) match {
      case MoveResult.invalidMove => Ok(gameController.boardToString() + "\n\n" + "<h1>This move is not valid</h1>")
      case MoveResult.validMove => {
        if (gameController.promotable((i, j))) {
        Ok(gameController.boardToString() + "\n\n" +  "Do u want to promote your piece? /y for yes!")
      }else
        Ok(gameController.boardToString())
    }
      case MoveResult.kingSlain => Ok("King Slain YAY")
      }
  }

  def promotePiece(x:Int, y:Int, i:Int, j:Int, promotion: String) = Action {
    if(promotion == "y")
      gameController.promotePiece(i,j)
    Ok(gameController.boardToString())
  }

  def about = Action {
    Ok(views.html.aboutTheGame())
  }
}