import $ from 'jquery'

class Store {

  constructor(options){
    this.fetch = options.fetch
    this.value = options.initialValue
    this.subscribers = []
  }

  getJSON(path){
    return $.getJSON(path)
  }

  load(){
    return this.loaded ?
      Promise.resolve(this.value) :
      this.fetch().then(value => {
        this.loaded = true
        this.value = value
        this.trigger()
        return this.value
      })
  }

  getValue(){
    if (this.loaded){
      return Promise.resolve(this.value)
    }else{
      return this.load()
    }
  }

  subscribe(subscriber){
    this.subscribers.push(subscriber)
    this.getValue()
  }

  unsubscribe(subscriber){
    this.subscribers = this.subscribers
      .filter(sub => subscriber !== sub)
  }

  trigger(){
    this.subscribers.forEach(subscriber => {
      subscriber(this.value)
    })
  }

  reload(){
    this.loaded = false
    return this.load()
  }

}

export default Store
