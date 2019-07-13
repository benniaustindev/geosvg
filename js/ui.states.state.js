(function(){

    Object.assign(UI,{
      createState:function(name,options){
        return new State(name,options,ui.currentState)
      }
    })


  })();
