class UI {
  constructor(){}
}
const ui=new UI();

(function(){
  let currentState=false;
  let states=[];

  class State {
    constructor(name,options={},previous){
      Object.defineProperties(this,{
        'name':{value:name,writable:false},
        'previous':{value:previous,writable:false},
        'time':{value:performance.now(),writable:false},
      });
      Object.assign(this,options)
    }
    open(){
      console.log('open',this)
    }
    close(){
      console.log('close',this)
    }
  }


  Object.defineProperties(UI.prototype,{
    currentState:{
      get:function(){
        return currentState;
      },
      set:function(state){
        return currentState;
      },
    },
    pushState:{
      value:function(name,options={}){
        if(this.currentState.name!==name){
          const newState=new State(name,states[name],this.currentState);
          history.pushState(Object.assign(options,{name:name,time:newState.time}),name);
          states.unshift(newState);
          if(currentState)currentState.close()
          currentState=newState;
          currentState.open()
          return newState;
        }
      }
    },
    replaceState:{
      value:function(name,options={}){
        if(currentState.name!==name){
          const newState=new State(name,states[name],this.currentState.previous);
          history.replaceState(Object.assign(options,{name:name,time:newState.time}),name);
          states.splice(states.indexOf(currentState),1,newState)
          if(currentState)currentState.close()
          currentState=newState;
          currentState.open()
          return newState;
        }
      }
    },
    createState:{
      value:function(name,options){
        states[name]=options;
      }
    }

  });

  window.addEventListener('popstate',function(event){
    currentState.close();
    currentState=states[states.findIndex(state=>state.time==event.state.time)];
    currentState.open();
  })

})();
