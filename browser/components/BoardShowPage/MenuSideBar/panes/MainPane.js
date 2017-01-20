import React from 'react'
import Pane from './Pane'
import MenuPaneLink from './MenuPaneLink'
import BoardMembers from '../BoardMembers'
import { MainPaneActivity } from './BoardActivity'

const MainPane = ({board, onClose, gotoPane}) => {
  return <Pane name="Main">
    <BoardMembers board={board} />
    <div className="BoardShowPage-MenuSideBar-separator" />
    <MenuPaneLink
      onClick={gotoPane('Change Background')}
      iconType='square'
    >
      Change Background
    </MenuPaneLink>
    <MenuPaneLink
      onClick={gotoPane('Filter Cards')}
      iconType='filter'
    >
      Filter Cards
    </MenuPaneLink>
    <MenuPaneLink
      onClick={gotoPane('Power-Ups')}
      iconType='rocket'
    >
      Power-Ups
    </MenuPaneLink>
    <MenuPaneLink
      onClick={gotoPane('Stickers')}
      iconType='sticky-note'
    >
      Stickers
    </MenuPaneLink>
    <MenuPaneLink
      onClick={gotoPane('More')}
      iconType='ellipsis-h'
    >
      More
    </MenuPaneLink>
    <div className="BoardShowPage-MenuSideBar-separator" />
    <MenuPaneLink
      onClick={gotoPane('Activity')}
      iconType='list'
    >
      Activity
    </MenuPaneLink>
    <MainPaneActivity board={board} openPanel={gotoPane('Activity')}/>
  </Pane>
}

export default MainPane
