import $ from 'jquery'

export default function setFaviconColor(color){
  const icon = document.createElement('canvas')
  icon.width = icon.height = 64

  const context = icon.getContext('2d')
  context.beginPath()
  context.rect(4,4,60,60)
  context.fillStyle = color
  context.fill()

  faviconLink().attr('href', icon.toDataURL("image/x-icon"))
}

function faviconLink(){
  const link = $('link[rel="shortcut icon"]')
  return link.length === 0
    ? $('<link />').attr('rel','shortcut icon').appendTo('head')
    : link
}
