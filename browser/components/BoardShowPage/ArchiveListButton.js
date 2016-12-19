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
    commands.archiveList(list.id)
  }

  render(){
    return <Button onClick={this.archiveList}>
    <Icon type="archive" /> Archive List
    </Button>
  }
}

export default ArchiveListButton
