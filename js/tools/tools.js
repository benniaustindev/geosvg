(function(){
  const storedTools=[];
  let initialized=false;

  class Tool {
    constructor(tools,name,obj){
      tools[name]=this;
      Object.assign(this,obj);
      if(obj.constructor)obj.constructor.call(this,obj);
      if(tools.activeTool===name)tools.activateTool(name);
    }
    activate(){}
    deactivate(){}
  }


  class Tools {
    constructor(){
      this.activeTool=false;
    }
    toggleTool(toolName){
      if(this[toolName] instanceof Tool){
        if(this.activeTool===toolName){
          this.deactivateTool(toolName)
        }
        else {
          this.activateTool(toolName)

        }
      }
    }
    deactivateTool(toolName){
      if(this.activeTool===toolName)this.activeTool=false;
      Array.from(document.querySelectorAll(`button[name="tool"][value="${toolName}"]`)).forEach(button=>button.classList.remove('active'))
      this[toolName].deactivate()
    }
    activateTool(toolName){
      Array.from(document.querySelectorAll(`button[name="tool"][value="${toolName}"]`)).forEach(button=>button.classList.add('active'))
      if(this.activeTool && this.activeTool!==toolName)this.deactivateTool(this.activeTool);
      this.activeTool=toolName
      this[toolName].activate()

    }
  }

  const tools = new Tools();

  GeoSvg.extend({
    constructor(){
      this.addEventListener('ready',(event)=>{
        this.tools=tools;
        tools.geosvg=this;
        initialized=true;
        storedTools.forEach((arr)=>{
          new Tool(tools,...arr);
          tools[arr[0]].geosvg=this;
        })
        Array.from(document.getElementsByName('tool')).forEach(button=>{
          button.addEventListener('click',(event)=>this.tools.toggleTool(button.getAttribute('value')));
        })
        let activeButton=document.querySelector('button[name="tool"].active');

        if(activeButton){
          this.activeTool=activeButton.getAttribute('value');
          this.tools.activateTool(activeButton.getAttribute('value'));
        }
      });


    }
  })

  GeoSvg.addTool=function(name,obj){
    if(initialized) new Tool(tools,name,obj);
    else storedTools.push([...arguments]);
  }

})();
