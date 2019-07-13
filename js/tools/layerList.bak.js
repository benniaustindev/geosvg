(function(){


  GeoSvg.addTool('layerBrowser',{
    constructor:function(){
      const newLayer=document.getElementById('newLayer')
      const createLayer=document.getElementById('createLayer')
      const layerBrowser=document.getElementById('layerBrowser')

      newLayer.addEventListener('click',event=>ui.overlay='createLayer');
      createLayer.addEventListener('hide',event=>{
        event.srcElement.querySelector('input').value='';
        document.getElementById('createLayer').querySelector('.error').textContent='';
      });
      createLayer.addEventListener('show',event=>event.srcElement.querySelector('input').focus());
      createLayer.querySelector('button[name="submit"]').addEventListener('click',event=>{
        const errorMessage = createLayer.querySelector('.error');
        const input=createLayer.querySelector('input');
        const newName=input.value;
        if(newName.length==0){
          errorMessage.innerHTML='<i class="material-icons">warning</i> You must enter a name';
          input.focus();
        }
        else if(newName.includes('.')){
          errorMessage.innerHTML='<i class="material-icons">warning</i> Sorry, period (.) characters are not allowed';
          input.focus();
        }
        else {
          const activeLayer=geosvg.layers.getLayer(geosvg.activeLayer)
          const existing=Array.from(activeLayer.children).find((child)=>child.name==newName);
          if(existing){
            errorMessage.innerHTML='<i class="material-icons">warning</i> A layer with that name already exists here';
            input.focus();
          }
          else {
            activeLayer.createChild(newName);
            history.back();
          }
        }
      });

      layerBrowser.addEventListener('hide',event=>Array.from(document.querySelectorAll('button[name="tool"][value="layerBrowser"]')).forEach(button=>button.classList.remove('active')));
      layerBrowser.addEventListener('show',event=>Array.from(document.querySelectorAll('button[name="tool"][value="layerBrowser"]')).forEach(button=>button.classList.add('active')));
      layerBrowser.addEventListener('click',event=>{
        const {srcElement}=event;
        const layerAddress=srcElement.getAttribute('data-layer');
        if(srcElement.classList.contains('activateLayer')) geosvg.activateLayer(layerAddress);
        else if(srcElement.classList.contains('visibility')){
          const layer=geosvg.layers.getLayer(layerAddress);
          const visibility=layer.toggleVisibility();
          const listItem=srcElement.parentElement;
          listItem.classList.add(visibility);
          if(visibility==='hidden') listItem.classList.remove('visible');
          else listItem.classList.remove('hidden');
        };
      });
      geosvg.addEventListener('layerCreated',event=>this.populateList());
      geosvg.addEventListener('layerActivated',event=>this.populateList());
    },
    activate:function(){
      ui.sidebar='layerBrowser';
      this.populateList();
    },
    deactivate:function(){
      ui.sidebar=null
    },
    populateList:function(){
      let activeLayer=this.geosvg.layers.getLayer(this.geosvg.activeLayer)
      const layerList=document.getElementById('layerList');
      breadcrumbs.innerHTML='';
      layerList.innerHTML='';
      let parentLayer=activeLayer;
      while(parentLayer.parent){
        let listitem=document.createElement('li');
        if(parentLayer.address !== this.geosvg.activeLayer){
          listitem.classList.add('activateLayer');
          listitem.setAttribute('data-layer',parentLayer.address);
          listitem.innerHTML='<i class="material-icons">keyboard_arrow_up</i>'+parentLayer.name;
        }
        else {
          listitem.innerHTML='<i class="material-icons">keyboard_arrow_right</i>'+parentLayer.name;
        }
        breadcrumbs.insertBefore(listitem,breadcrumbs.children[0]);
        parentLayer=parentLayer.parent;
      }
      activeLayer.children.forEach(layer=>{
        let show=document.createElement('i');
            show.classList.add('material-icons');
            show.classList.add('visibility');
            show.classList.add('visibility_off');
            show.setAttribute('data-layer',geosvg.activeLayer+'.'+layer.name);
            show.textContent='visibility_off';
        let hide=document.createElement('i');
            hide.classList.add('material-icons');
            hide.classList.add('visibility');
            hide.classList.add('visibility_on');
            hide.setAttribute('data-layer',geosvg.activeLayer+'.'+layer.name);
            hide.textContent='visibility';
        let nameLink=document.createElement('a');
            nameLink.textContent=layer.name;
            nameLink.classList.add('activateLayer');
            nameLink.setAttribute('data-layer',geosvg.activeLayer+'.'+layer.name);
        let listItem=document.createElement('li');
            listItem.classList.add(layer.visibility
            )
            listItem.appendChild(show);
            listItem.appendChild(hide);
            listItem.appendChild(nameLink);
        layerList.appendChild(listItem);
      });
    }
  });
})();
