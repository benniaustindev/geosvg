(function(){



history.replaceState({name:'home'},'home','')

HTMLElement.prototype.hide=function(){
  if(!this.hasAttribute('hidden')){
    this.setAttribute('hidden','');
    this.dispatchEvent(new Event('hide'));
  }
  return this;
}
HTMLElement.prototype.show=function(){
  if(this.hasAttribute('hidden')){
    this.removeAttribute('hidden');
    this.dispatchEvent(new Event('show'));
  }
  return this;
}

document.addEventListener('click',function(event){

  if(event.path.find(element=>element instanceof Element && element.getAttribute('name')==='back')){
    history.go(-1)
  }
})

class UI {
  constructor(){}

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

  if(history.state.type==='overlay'){
    if(ui.overlay !== history.state.name ){
      ui.overlay=history.state.name;
    }
  }
  else {
    if(ui.overlay){
      ui.overlay=null;
    }
  }

  if(history.state.type==='sidebar'){
    if(ui.sidebar !== history.state.name ){
      ui.sidebar=history.state.name;
    }
  }
  else {
    if(ui.sidebar){
      ui.sidebar=null;
    }
  }
})

window.ui=new UI();

})();
