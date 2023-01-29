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
function notify(){
    
}