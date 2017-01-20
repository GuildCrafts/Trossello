import React from 'react'
import ToggleComponent from '../../ToggleComponent'
import ContentForm from '../ContentForm'
import Link from '../../Link'
import Icon from '../../Icon'
import commands from '../../../commands'
import './CardDescription.sass'

export default class CardDescription extends ToggleComponent {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.updateDescription = this.updateDescription.bind(this)
  }

  updateDescription(){
    let newDescription = this.refs.descriptionForm.state.content

    commands.updateCardAttribute(this.props.card.id, {description: newDescription})
    .then(this.close)
  }

  render() {
    const { card } = this.props

    if (this.state.open){
      return <ContentForm
        ref="descriptionForm"
        className="BoardShowPage-CardModal-CommentForm BoardShowPage-CardModal-CardDescription"
        onSave={this.updateDescription}
        onCancel={this.close}
        submitButtonName="Save"
        defaultValue={card.description}
      />
    }

    if (card.description === ""){
      return <Link onClick={this.open} className="BoardShowPage-CardModal-CardDescription">
        <Icon type="align-justify" />&nbsp;
        <span>Edit the description</span>
      </Link>
    }

    return <div className="BoardShowPage-CardModal-CardDescription">
      <div className="BoardShowPage-CardModal-CardDescription-header">
        Description
        <Link
          className="BoardShowPage-CardModal-CardDescription-header-edit"
          onClick={this.open}
        >
          Edit
        </Link>
      </div>
      <div className="BoardShowPage-CardModal-CardDescription-content">{card.description}</div>
    </div>
  }
}
