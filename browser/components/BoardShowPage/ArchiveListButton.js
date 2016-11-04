import React, {Component} from 'react'
import Icon from '../Icon'
import Button from '../Button'

class ArchiveListButton extends Component {

  static propTypes = {
    list: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.archiveList = this.archiveList.bind(this)
  }

  archiveList(){
    $.ajax({
      method: "POST",
      url: `/api/lists/${this.props.list.id}/archive`
    }).then(() => {
      boardStore.reload()
    })
  }

  render(){
    return <Button onClick={this.archiveList}>
    <Icon type="archive" /> Archive List
    </Button>
  }
}

export default ArchiveListButton
