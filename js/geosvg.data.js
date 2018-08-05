(function(){

  const lokiDB=new loki();

  class Collection {
    constructor(parent,name){
      if(parent)this.parent=parent;
      if(name)this.name=name;
    }
    get address(){
      let address=this.name,
          parent=this.parent;
      while(parent && parent.name){
        address=parent.name+'.'+address;
        parent=parent.parent
      }
      return address;
    }
    get collection(){
      if(!this.loki.getCollection(this.address)){
        this.loki.addCollection(this.address);
        this.parent.collection.insert({
          type:'collection',
          name:this.name
        });
      }
      return this.loki.getCollection(this.address);
    }
    get loki(){
      return lokiDB;
    }
    get root(){
      let root=this.parent;
      while(root.parent)root=root.parent;
      return root;
    }
    get children(){
      return this.collection.find({'type':'collection'}).map((result)=>{
        return new Collection(this,result.name);
      });

    }
    addCollection(name){
      let newCollection=new Collection(this,name);
      this.collection.insert({name:name,type:'collection'});
      return newCollection;
    }
    moveTo(newParent){
      let oldAddress=this.address

      this.parent.chain().find({
        'and':[
          {name:this.name},
          {type:'collection'}
        ]
      }).remove();
      this.parent=newParent;
      this.parent.insert({'type':'collection','name':this.name});
      this.loki.renameCollection(oldAddress,this.address);
    }
  }

  class Database extends Collection{
    constructor(){
      super()
      Object.defineProperty(this,'collection',{value:this.loki.addCollection('assets')})
    }
    get collection(){
      return this.loki.getCollection('assets')
    }
  }


  GeoSvg.Database=Database;
})()
