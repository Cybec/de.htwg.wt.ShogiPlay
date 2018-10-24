package controllers

import javax.inject._

import play.api.mvc._
import de.htwg.se.Shogi.Shogi

@Singleton
class ShogiController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController = Shogi.controller
  def shogiAsText =  gameController.boardToString()
  def shogi = Action {
    Ok(views.html.index(shogiAsText))
  }

  def newBoard = Action {
    gameController.createNewBoard()
    Ok(views.html.sudoku(shogiAsText))
  }
}