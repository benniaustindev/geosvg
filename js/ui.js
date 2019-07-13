(function(){



Object.assign(document,{
  buildElement:function(tagname,options={},namespace){
    if(typeof tagname!=='string'){
      return document.buildElement(options.tagname||'div',tagname,namespace)
    }
    if(!options.id && tagname.includes('#')){
      let start=tagname.indexOf('#');
      let end=tagname.indexOf('.',start);
      if(end==-1)end=tagname.length;
      let id=tagname.substring(start,(end>0)?end:tagname.length);
      tagname=tagname.replace(id,'')
      options.id=id.substring(1)
    }
    if(tagname.includes('.')){
      let arr=tagname.split('.')
      tagname=arr.shift();
      if(options.class)arr.push(options.class)
      options.class=arr.join(' ');
    }
    if(options.style && typeof options.style==='object'){
      let arr='';
      for(let descriptor in options.style){
        arr.push(`${descriptor} : ${options.style[descriptor]}`);
      }
      options.style=arr.join(';\n');
    }
    if(options.style && typeof options.style==='object'){
      let arr=[];
      for(let descriptor in options.style){
        arr.push(`${descriptor} : ${options.style[descriptor]}`);
      }
      options.style=arr.join(';\n');
    }
    const {events={},children=[],innerHTML} = options;
    delete options.children;
    delete options.events;
    delete options.innerHTML;
    let element=document.createElement(tagname);
    for(var eventName in events) element.addEventListener(eventName,events[eventName]);
    if(innerHTML)children.unshift(options.innerHTML);
    if(children.length){
      children.forEach(child=>{
        if(typeof child === 'string'){
          child=document.createTextNode(child)
        }
        element.appendChild(child);
      });
    }
    for(var attributeName in options){
      element.setAttribute(attributeName,options[attributeName])
    }
    return element;
  }
});
  Object.assign(HTMLElement.prototype,{
    hide:function(){
      if(!this.hasAttribute('hidden')){
        this.setAttribute('hidden','');
        this.dispatchEvent(new Event('hide'));
      }
      return this;
    },
    show:function(){
      if(this.hasAttribute('hidden')){
        this.removeAttribute('hidden');
        this.dispatchEvent(new Event('show'));
      }
      return this;
    },
    append:function(element){
      this.appendChild(element);
      return element;
    },
    prepend:function(element){
      if(this.children.length)this.insertBefore(element,this.children[0]);
      else this.appendChild(element);
      return element;
    },
    insertChild:function(element,index=0){
      if(this.children.length<index)this.appendChild(element);
      else this.insertBefore(element,this.children[index]);
      return element;
    }
  });


  document.addEventListener('click',function(event){
    const button=event.path.find(element=>element instanceof HTMLButtonElement && element.hasAttribute('name'));
    if(button){
      const name=button.getAttribute('name')
      if(name==='closeOverlay'){
        const overlay=event.path.find(element=>element instanceof Element && element.parentElement.getAttribute('id') === 'overlay');
        let i=-1;
        let state=ui.currentState.previous;
        while(state && state.overlay && state.overlay ===  currentState.overlay){
          state=state.previous;
          i=i-1;
        }
        history.go(i);
        }
      else if(name==='back')history.go(-1);
      else if(name==='pushState'){
        const stateName=button.getAttribute('value');
        ui.pushState(stateName);
      }
      else if(name==='replaceState'){
        const stateName=button.getAttribute('value');
        ui.replaceState(stateName);
      }
    }

  });

  let currentState=false;
  let states=[];
  class State {
    constructor(name,options={},previous){
      Object.defineProperties(this,{
        'name':{value:name,writable:false},
        'tid':{value:performance.now(),writable:false},
      });
      Object.assign(this,options);
    }
    open(){}
    close(){}
    get previous(){
      return states[states.indexOf(this)+1];
    }
  }


  class UI {
    constructor(){}
    createState(name,options={}){
      const state=states[name]=options;
      const close=state.close;
      const open=state.open;
      if(state.overlay){
        state.open=function(oldState){
          document.getElementById('overlay').show();
          document.getElementById(this.overlay).show();
          if(open)open.call(this,oldState);
        }
        state.close=function(newState){
          if(newState.overlay!==this.overlay){
            document.getElementById(this.overlay).hide();
          }
          if(!newState.overlay)document.getElementById('overlay').hide();
          if(close)close.call(this,newState);
        }
      }
    }
    pushState(name,options={}){

      if(currentState.name!==name){
        while(states.length && states[0]!==currentState)states.shift();
        const newState=new State(name,Object.assign(states[name],options),this.currentState.previous);
        const oldState=currentState;
        history.pushState(Object.assign(options,{name:name,tid:newState.tid}),name);
        currentState=newState;
        states.unshift(newState);
        if(oldState){
          oldState.close(newState);
        }
        else states.unshift(newState);
        newState.open(oldState);
      }
      return currentState;
    }
    replaceState(name,options={}){
      if(currentState.name!==name){
        while(states.length && states[0]!==currentState)states.shift();
        const newState=new State(name,states[name],this.currentState.previous);
        const oldState=currentState;
        history.replaceState(Object.assign(options,{name:name,tid:newState.tid}),name);
        currentState=newState;
        if(oldState){
          states.splice(states.indexOf(oldState),1,newState);
          oldState.close(newState);
        }
        else states.unshift(newState);
        newState.open(oldState);
      }
      return currentState
    }

    get currentState(){
      return currentState;
    }
    set currentState(state){
      return currentState;
    }

    get overlay(){
      return Array.from(document.getElementById('overlay').children).find((child)=>!child.hasAttribute('hidden'));
    }
    set overlay(childId){
      if(childId && document.getElementById(childId)){
        document.getElementById('overlay').show();
        Array.from(document.getElementById('overlay').children).forEach((child)=>{
          if(child.getAttribute('id')===childId)child.show();
          else child.hide();
        });
        history.pushState({type:'overlay',name:childId},'','');

      }
      else {
        document.getElementById('overlay').hide();
        Array.from(document.getElementById('overlay').children).forEach((child)=>{
          child.hide();
        });
        if(history.state.type==='overlay')history.back();

      }
    }
    get sidebar(){
      return Array.from(document.getElementById('sidebar').children).find((child)=>!child.hasAttribute('hidden'));
    }
    set sidebar(childId){
      const stateMethod=(history.state.type==='sidebar')?'replaceState':'pushState';
      if(childId && document.getElementById(childId)){
        document.getElementById('sidebar').show();
        document.getElementById(childId).show();
        Array.from(document.getElementById('sidebar').children).forEach((child)=>{
          if(child.getAttribute('id')===childId)child.show();
          else child.hide();
        });
        history[stateMethod]({type:'sidebar',name:childId},'','');

      }
      else {
        document.getElementById('sidebar').hide();
        Array.from(document.getElementById('sidebar').children).forEach((child)=>{
          child.hide();
        });
        if(history.state.type==='sidebar')history.back();

      }
    }

  }



  window.addEventListener('popstate',function(event){
    const oldState=currentState;
    const newState=states[states.findIndex(state=>state.tid===event.state.tid)];
    oldState.close(newState);
    newState.open(oldState);
    currentState=newState;
  });
  window.ui=new UI();

})();
