import $ from 'jquery'

class Store {

  constructor(options){
    this.fetch = options.fetch
    this.records = null
    this.subscribers = []
  }

  load(){
    return this.fetch().then(records => {
        this.records = records
        return records
      })
  }

  get(){
    if (this.records){
      return Promise.resolve(this.records)
    }else{
      return this.load()
    }
  }

  subscribe(subscriber){
    this.subscribers.push(subscriber)
    this.get().then(subscriber)
  }

  unsubscribe(subscriber){
    this.subscribers = this.subscribers
      .filter(sub => subscriber !== sub)
  }

  reload(){
    this.load().then(records => {
      this.subscribers.forEach(subscriber => {
        subscriber(records)
      })
    })
  }

}

export default Store
