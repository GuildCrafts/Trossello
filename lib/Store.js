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

  postJSON(path, body){
    // return $.ajax(…)
  }

  load(){
    return this.fetch().then(value => {
      this.value = value
      this.trigger()
      return value
    })
  }

  getValue(){
    if (this.value){
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
    this.load()
  }

}

export default Store
