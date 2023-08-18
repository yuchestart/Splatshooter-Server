
function main(){
    var renderer = new Renderer(document.getElementById("playingcanvas"))
    var scene = new Scene(renderer)
    var mat = new SingleColorMaterial("#00FF00",50)
    var objid = scene.addObject(new Sphere(1,20,mat));
    var lightid = scene.addLight(new PointLight([0,8,0],1,1))
    scene.addLight(new AmbientLight(7))
    scene.moveCamera([0,2,5])
    scene.objects[objid].rotate([45,0,0])
    function frame(){
        scene.objects[objid].rotate([1,1,0])
        scene.render();
        requestAnimationFrame(frame)
    }
    frame()
}
window.onload = main;