import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'
import List from './List'

class CustomDragLayer extends Component {
  render() {
    if (!this.props.isDragging) return null

    function getItemStyles(props) {
      var currentOffset = props.currentOffset;
      if (!currentOffset) {
        return {
          display: 'none'
        };
      }

      var x = currentOffset.x;
      var y = currentOffset.y - 100;
      var transform = 'translate(' + x + 'px, ' + y + 'px) rotate(4deg)';
      return {
        transform: transform
      };
    }

    var draggedList = this.props.draggedList
    console.log(draggedList)

    return <div style={getItemStyles(this.props)}>
      <List
        board={this.props.board}
        list={this.props.list}
        onDragOver={this.props.onDragOver}
        onDragEnd={this.props.onDragEnd}
        onDrop={this.props.onDrop}
        dragging={this.props.dragging}
        startDragging={this.props.startDragging}
        stopDragging={this.props.stopDragging}
        moveList={this.props.moveList}
        updateListOrder={this.props.updateListOrder}
      />
    </div>
  }
}

function collect(monitor) {
  return {
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
    draggedList: monitor.getItem()
  }
}

export default DragLayer(collect)(CustomDragLayer)
