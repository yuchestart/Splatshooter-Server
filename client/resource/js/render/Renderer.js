import * as THREE from 'three';

export default { Renderer };

class Renderer
{
    constructor()
    {

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();

        this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.debugMaterial = new THREE.MeshNormalMaterial();

        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(animation);
        document.getElementById("renderingContainer").appendChild(renderer.domElement);
    }

    render()
    {
        this.renderer.render(this.scene, this.camera);
    }
}