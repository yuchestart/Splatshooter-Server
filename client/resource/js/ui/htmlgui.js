function $(name, parent)
{
    return parent ? {
        tag: parent.getElementsByTagName(name),
        class: parent.getElementsByClassName(name)
    } : {
        tag: document.getElementsByTagName(name),
        class: document.getElementsByClassName(name),
        id: document.getElementById(name)
    }
}
export function loadModalHide()
{
    $("loadmodal").class[0].style.animationPlayState = "running"
    $('gui').class[0].classList.toggle("hidden");
    $('beforegame').class[0].hidden = false;
}