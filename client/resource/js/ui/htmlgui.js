function $(name, parent)
{
    return parent ? {
        tag: parent.getElementsByTagName(name),
        class: parent.getElementsByClassName(name)
    } : {
        tag: document.getElementsByTagName(name),
        class: document.getElementsByClassName(name),
        id: document.getElementById(name)
    };
}
export function loadModalHide()
{
    $("loadmodal").class[0].style.animationPlayState = "running";
}
export function hideOverviewModal()
{
    $("mainmenu").class[0].classList.add("hidden");
    $("renderingContainer").id.classList.remove("hidden");
}