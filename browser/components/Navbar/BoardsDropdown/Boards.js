import React from 'react'
import ToggleComponent from '../../ToggleComponent'
import Button from '../../Button'
import Link from '../../Link'
import Icon from '../../Icon'
import BoardStar from '../../BoardStar'

export default class Boards extends ToggleComponent {

  static initialState = true;
  static closeIfUserClicksOutside = false;
  static closeOnEscape = false;

  static propTypes = {
    title: React.PropTypes.string.isRequired,
    boards: React.PropTypes.array.isRequired,
    onBoardClick: React.PropTypes.func,
  };

  render(){
    if (this.props.boards.length === 0) return null

    const boards = this.state.open ?
      this.props.boards.map(board =>
        <Board key={board.id} board={board} onClick={this.props.onBoardClick} />
      ) :
      null

    return <div className="Navbar-BoardsDropdown-Boards">
      <div className="Navbar-BoardsDropdown-Boards-title">
        <span>{this.props.title}</span>
        <Button
          type="invisible"
          tabIndex="-1"
          noFocus
          onClick={this.toggle}
        >
          <Icon type={this.state.open ? "minus" : "plus"} />
        </Button>
      </div>
      {boards}
    </div>
  }
}

const Board = ({ board, onClick }) =>
  <div
    className={`Navbar-BoardsDropdown-board Navbar-BoardsDropdown-board-${board.background_color}`}
  >
    <Link to={`/boards/${board.id}`} onClick={onClick} className="Navbar-BoardsDropdown-board-thumbnail"></Link>
    <Link to={`/boards/${board.id}`} onClick={onClick} className="Navbar-BoardsDropdown-board-name">
      <div>{board.name}</div>
    </Link>
    <BoardStar board={board} />
  </div>
