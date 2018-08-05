(function(){
  GeoSvg.addTool('layerBrowser',{
    constructor:function(){
      document.getElementById('newLayer').addEventListener('click',event=>{
        ui.overlay='createLayer';
      });
      document.getElementById('createLayer').addEventListener('hide',event=>{
        event.srcElement.querySelector('input').value='';
        document.getElementById('createLayer').querySelector('.error').textContent='';
      })
      document.getElementById('createLayer').addEventListener('show',event=>{
        event.srcElement.querySelector('input').focus();
      });
      document.getElementById('createLayer').querySelector('button[name="submit"]').addEventListener('click',event=>{
        let errorMessage = document.getElementById('createLayer').querySelector('.error')
        let input=document.getElementById('createLayer').querySelector('input');
        let newName=input.value
        if(newName.length==0){
          errorMessage.innerHTML='<i class="material-icons">warning</i> You must enter a name';
          input.focus();
        }
        else if(newName.includes('.')){
          errorMessage.innerHTML='<i class="material-icons">warning</i> Sorry, period (.) characters are not allowed';
          input.focus();
        }
        else {
          let activeLayer=geosvg.layers.getLayer(geosvg.activeLayer)
          let existing=Array.from(activeLayer.children).find((child)=>child.name==newName);

          if(existing){
            errorMessage.innerHTML='<i class="material-icons">warning</i> A layer with that name already exists here';
            input.focus();
          }
          else {

            activeLayer.createChild(newName)
            history.back()
          }
        }
      });


      document.getElementById('layerBrowser').addEventListener('hide',function(event){
        Array.from(document.querySelectorAll('button[name="tool"][value="layerBrowser"]')).forEach(button=>button.classList.remove('active'));
      })
      document.getElementById('layerBrowser').addEventListener('show',function(event){
        Array.from(document.querySelectorAll('button[name="tool"][value="layerBrowser"]')).forEach(button=>button.classList.add('active'));
      })
      document.getElementById('layerBrowser').addEventListener('click',event=>{
        if(event.srcElement.classList.contains('activateLayer')){
          geosvg.activateLayer(event.srcElement.getAttribute('data-layer'));
        }
        else if(event.srcElement.classList.contains('visibility')){
          console.log(event.srcElement)
          let layer=geosvg.layers.getLayer(event.srcElement.getAttribute('data-layer'));
          let visibility=layer.toggleVisibility();
          event.srcElement.parentElement.classList.add(visibility);
          if(visibility==='hidden'){
            event.srcElement.parentElement.classList.remove('visible');
          }
          else {
            event.srcElement.parentElement.classList.remove('hidden');
          }
        };
      });
      geosvg.addEventListener('layerCreated',(evt)=>{
        this.populateList();
      });
      geosvg.addEventListener('layerActivated',(evt)=>{
        this.populateList();
      });
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
      const breadcrumbs=document.getElementById('layerBreadcrumbs')
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
