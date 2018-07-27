document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('collections').addEventListener('click',function(){
    if(this.classList.contains('active')){
      this.classList.remove('active')
      document.getElementById('sidebar').setAttribute('hidden','');
    }
    else {
      this.classList.add('active')
      document.getElementById('asset').classList.remove('active')
      document.getElementById('addPoint').classList.remove('active')
      document.getElementById('sidebar').removeAttribute('hidden');
    }
  });

  document.getElementById('asset').addEventListener('click',function(){
    if(this.classList.contains('active')){
      this.classList.remove('active')
      document.getElementById('sidebar').setAttribute('hidden','');
    }
    else {
      this.classList.add('active')
      document.getElementById('collections').classList.remove('active')
      document.getElementById('addPoint').classList.remove('active')
      document.getElementById('sidebar').removeAttribute('hidden');
    }
  })

  document.getElementById('addPoint').addEventListener('click',function(){
    if(this.classList.contains('active')){
      this.classList.remove('active')
      document.getElementById('sidebar').setAttribute('hidden','');
    }
    else {
      this.classList.add('active')
      document.getElementById('collections').classList.remove('active')
      document.getElementById('asset').classList.remove('active')
      document.getElementById('sidebar').removeAttribute('hidden');
    }
  })
});
