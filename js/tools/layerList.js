(function(){

//delete isn't working at all
//renaming, creates a new layer?
  //apparently is just creating a new row in the dom.
  //needs to use loki id's rather than address


  GeoSvg.ready(function(event){
    const layerBrowser=document.getElementById('layerBrowser');
    layerBrowser.querySelectorAll('[name="submit"]').forEach(button=>button.addEventListener('click',event=>history.back()));
    layerBrowser.addEventListener('hide',event=>Array.from(document.querySelectorAll('button[name="tool"][value="layerBrowser"]')).forEach(button=>button.classList.remove('active')));
    layerBrowser.addEventListener('show',event=>Array.from(document.querySelectorAll('button[name="tool"][value="layerBrowser"]')).forEach(button=>button.classList.add('active')));
    layerBrowser.addEventListener('show',event=>Array.from(document.querySelectorAll('button[name="tool"][value="layerBrowser"]')).forEach(button=>button.classList.add('active')));
    layerBrowser.querySelector('.delete').addEventListener('click',event=>{
      ui.pushState('layerDelete',{layer:document.getElementById('layerBrowser').querySelector('.edit.expanded').dataset.layer})
    });
    this.addEventListener('layerHide',event=>{
      console.log(event.target.id)
      const element=layerBrowser.querySelector('[data-layer="'+event.target.id+'"] .visibility i');
      element.parentElement.classList.add('off')
      element.parentElement.classList.remove('on')
      element.classList.add('fa-eye-slash')
      element.classList.remove('fa-eye')
    });
    this.addEventListener('layerShow',event=>{
      console.log(event)
      const element=layerBrowser.querySelector('[data-layer="'+event.target.id+'"] .visibility i');
      console.log(element)
      element.parentElement.classList.add('on')
      element.parentElement.classList.remove('off')
      element.classList.add('fa-eye')
      element.classList.remove('fa-eye-slash')
    });
    ['insertLayer','layerActivated','renameLayer'].forEach((methodName)=>{
      geosvg.addEventListener(methodName,event=>{
        if(ui.currentState.name==='layerBrowser'){
          ui.currentState.populateList();
        }
      });

    });
    layerBrowser.querySelector('button.save').addEventListener('click',event=>{
      const layer = Array.from(layerBrowser.querySelectorAll('li.edit>.row input')).reduce((obj,element)=>{
        obj[element.getAttribute('name')]=element.value;
        return obj;
      },geosvg.layers.getLayerById(layerBrowser.querySelector('li.edit').dataset.layer));

      console.log(layer.id)
    });

  });


  ui.createState('layerDetails',{
    'overlay':'layerBrowser',
    open:function(oldState){
      const layerBrowser=document.getElementById(this.overlay);
      const layerList=document.getElementById('layerList');
      const activeRow=layerList.querySelector('li[data-layer="'+this.layer+'"]');
      const inactiveRows=Array.from(layerList.querySelectorAll('li:not([data-layer="'+this.layer+'"])'));
      layerBrowser.querySelector('footer .save').show();
      layerBrowser.querySelector('footer .delete').show();
      layerList.classList.add('hideAfter');

      inactiveRows.forEach(row=>{
        row.hide()
        //row.querySelector('.add').hide();
        //row.querySelector('.edit').hide();
      });

      activeRow.querySelector('.add').hide();
      activeRow.querySelector('.edit').hide();
      Array.from(activeRow.children).forEach(child=>{
        if(child.classList.contains('row')){
          console.log(child)
          child.show()
        }
      })
      //for all rows
        //remove after
        //remove .add
        //remove .edit
      //for inactive rows
        //hide row
      //for active row
        //show edit fields
      //layerBrowser.classList.add('editMode');
      //layerBrowser.querySelector('[data-layer="'+this.layer+'"]').classList.add('edit');
    },
    close:function(newState){
      const layerBrowser=document.getElementById(this.overlay);
      const layerList=document.getElementById('layerList');
      layerBrowser.querySelector('footer .save').hide();
      layerBrowser.querySelector('footer .delete').hide();
      Array.from(layerList.querySelectorAll('li')).forEach(row=>{
        row.querySelector('.add').show();
        row.querySelector('.edit').show();
      })
      //for all rows
        //add after
        //show .add
        //show .edit
      //for inactive rows
        //show row if parent expanded
      //for active row
        //hide edit fields
      layerBrowser.classList.remove('editMode');
      layerBrowser.querySelector('[data-layer="'+this.layer+'"]').classList.remove('edit');
    },
  });
  ui.createState('layerDelete',{
    'overlay':'layerBrowser',
    open:function(oldState){
      const layer=geosvg.layers.getLayerById(this.layer);
      const layerBrowser=document.getElementById('layerBrowser');

      layerBrowser.querySelector('[data-layer="'+this.layer+'"]').classList.add('deleteRow');
      layerBrowser.classList.add('deleteMode')
    },
    close:function(newState){
      const layer=geosvg.layers.getLayerById(this.layer);
      const layerBrowser=document.getElementById('layerBrowser');
      layerBrowser.classList.remove('deleteMode')
      layerBrowser.querySelector('[data-layer="'+this.layer+'"]').classList.remove('deleteRow');
    },
  });


  ui.createState('layerBrowser',{
    'overlay':'layerBrowser',
    open:function(oldState){
      const layerBrowser=document.getElementById(this.overlay);
      console.log(layerBrowser)
      layerBrowser.querySelector('footer .done').show();
      this.populateList()
    },
    close:function(newState){
      layerBrowser.querySelector('footer .done').hide();
    },
    populateList(){
      let errorTimeout;
      const errorMessage=document.getElementById('layerBrowser').querySelector('.error')
      const layerList=document.getElementById('layerList');

      const createListItem=function(parentElement,layer){
        const createField=(name,value='',type)=>{
          const label=document.buildElement('label',{
            'innerHTML':name
          });
          const input=document.buildElement('input',{
            'type':type,
            'value':value,
            'name':name.toLowerCase()
          });
          const row=document.buildElement(`div.row.${name}Row`,{
            children:[label,input]
          })
          return { row,label,input }
        }

        const main=(()=>{
          const visibilityIcon=document.buildElement('i.fas')
          const visibilityButton=document.buildElement('button.visibility',{
            'children':[visibilityIcon],
            'events':{
              click:(event)=>{
                if(layer.visibility=='hidden'){
                  layer.visibility='visible';
                }
                else {
                  layer.visibility='hidden';
                }
              }
            }
          });

          const expanderIcon=document.buildElement('i.fas.fa-folder-open')
          const expanderButton=document.buildElement('button.expander.expanded',{
            children:[expanderIcon],
            events:{
              click:(event)=>{
                if(listItem.classList.contains('expanded')){
                  listItem.classList.remove('expanded')
                  expanderIcon.classList.remove('fa-folder-open');
                  expanderIcon.classList.add('fa-folder');
                }
                else {
                  listItem.classList.add('expanded')
                  expanderIcon.classList.remove('fa-folder');
                  expanderIcon.classList.add('fa-folder-open');
                }
              }
            }
          });

          const name=document.buildElement('div.name',{
            innerHTML:layer.name
          })

          const editIcon=document.buildElement('i.fas.fa-ellipsis-h');
          const editButton=document.buildElement('button.edit',{
            'children':[editIcon],
            'events':{
              click:(event)=>{
                ui.pushState('layerDetails',{'layer':layer.id},'');
              }
            }
          });

          const createIcon=document.buildElement('i.fas.fa-plus')
          const createButton=document.buildElement('button.add',{
            'children':[createIcon],
            'events':{
              click:(event)=>{
                let childList=listItem.querySelector('ul')
                if(!childList)listItem.insertChild(childList=document.buildElement('ul.tree'));

                const newNameField=document.buildElement('input',{
                  type:'text',
                  placeholder:'Enter the name...',
                  events:{
                    keyup:event=>{
                      if(event.key==='Enter')newConfirmButton.click()
                      else if(event.key==='Escape')newCancelButton.click()
                    }
                  }
                });

                const newExpanderButton=document.buildElement('button.expander',{
                  children:[document.buildElement('i.fas.fa-plus-square')]

                });

                const newCancelButton=document.buildElement('button.cancel',{
                  children:[document.buildElement('i.fas.fa-trash')],
                  events:{
                    click:event=>{
                      newRow.setAttribute('hidden','')
                      setTimeout(()=>{
                        newLayer.parentElement.removeChild(newLayer);
                        errorMessage.innerHTML='';
                      },1000);
                    }
                  }
                });

                const newConfirmButton=document.buildElement('button.confirm',{
                  children:[document.buildElement('i.fas.fa-check')],
                  events:{
                    click:event=>{
                      if(newNameField.value.length==0){
                        errorMessage.innerHTML='<i class="fas fa-exclamation-triangle"></i>You must enter a name';
                        if(errorTimeout)clearTimeout(errorTimeout);
                        errorTimeout=setTimeout(()=>errorMessage.innerHTML='',5000);
                        newNameField.focus();
                      }
                      else if(layer.children.find(child=>child.name==newNameField.value)){
                        errorMessage.innerHTML='<i class="fas fa-exclamation-triangle"></i>A layer already exists here with that name';
                        if(errorTimeout)clearTimeout(errorTimeout);
                        errorTimeout=setTimeout(()=>errorMessage.innerHTML='',5000);
                        newNameField.focus();
                      }
                      else {
                        const createdLayer=geosvg.layers.createLayer(newNameField.value);
                        layer.insertChild(createdLayer)
                        newLayer.parentElement.removeChild(newLayer);
                        errorMessage.innerHTML='';

                      }
                    }
                  }
                });

                const newRow=document.buildElement('div.row',{
                  hidden:true,
                  children:[newExpanderButton,newNameField,newConfirmButton,newCancelButton]
                })

                const newLayer=document.buildElement('li.newLayer',{
                  children:[newRow],
                });

                if(childList.children.length==0)childList.appendChild(newLayer)
                else childList.insertBefore(newLayer,childList.children[0])
                setTimeout(()=>{
                  newRow.show()
                  newNameField.focus()
                },1);
              }
            }
          });

          const row=document.buildElement('div.row',{
            'children':[visibilityButton,expanderButton,name,createButton,editButton]
          });

          if(layer.visibility==='visible'){
            visibilityButton.classList.add('on');
            visibilityIcon.classList.add('fa-eye');
          }
          else {
            visibilityButton.classList.add('off');
            visibilityIcon.classList.add('fa-eye-slash');
          }


          return {
            row,name,
            visibilityButton,expanderButton,editButton,createButton,
            visibilityIcon,expanderIcon,editIcon,createIcon,
          }
        })();



        const name=createField('name',layer.name,'text');

        const description=createField('description',layer.description,'text')

        const color=createField('color',layer.color,'color')

        const deleteConfirm=document.buildElement('.row.deleteConfirm',{
          innerHTML:'Are you sure you want to delete this layer?'
        });

        const listItem=document.buildElement('li.expanded',{
          'data-layer':layer.id,
          'children':[main.row,name.row,color.row,description.row,deleteConfirm,document.buildElement('ul.tree')],
        });
        parentElement.insertChild(listItem,(layer.parent)?layer.order:0);
        return listItem;
      }

      const printLayer=function(parentElement,layer){
        console.log(layer)
        let listItem=Array.from(parentElement.children).find(child=>child.dataset.layer==layer.id);
        if(!listItem) listItem=createListItem(...arguments);
        else {
          listItem.querySelector('.name').textContent=layer.name;
          listItem.querySelector('.nameRow input').value=layer.name;
          listItem.querySelector('.colorRow input').value=layer.color||'#000000';
          listItem.querySelector('.descriptionRow input').value=layer.description||'';
          //make sure the name is right
        }
        if(layer.children){
          const tree=listItem.querySelector('ul.tree');
          layer.children.forEach(childLayer=>printLayer(tree,childLayer));
        }
      }
      geosvg.layers.children.forEach(layer=>printLayer(layerList,layer))


    },
  });

})();
