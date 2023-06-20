function $(name,parent){
    return parent?{
        tag:parent.getElementsByTagName(name),
        class:parent.getElementsByClassName(name)
    }:{
        tag:document.getElementsByTagName(name),
        class:document.getElementsByClassName(name),
        id:document.getElementById(name)
    }
}
function loadModalHide(){
    $("loadmodal").class[0].style.animationPlayState="running"
    $('gui').class[0].hidden = false;
    $('beforegame').class[0].hidden = false;
}