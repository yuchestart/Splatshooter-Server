import * as THREE from 'three';
import { SplatshooterClient } from '../client/SplatshooterClient.js';

class Renderer
{

    /**
     * The client.
     * @param {SplatshooterClient}
     */
    client;

    /**
     * Creates a new client renderer.
     * @param {SplatshooterClient} client
     */
    constructor(client)
    {
        this.client = client;

        this.client.logger.info("Initializing renderer...");

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();

        this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.debugMaterial = new THREE.MeshNormalMaterial();

        this.mesh = new THREE.Mesh(this.geometry, this.debugMaterial);
        this.scene.add(this.mesh);

        this.renderer3D = new THREE.WebGLRenderer({ antialias: true });
        this.renderer3D.setSize(window.innerWidth, window.innerHeight);
        this.renderer3D.domElement.classList.add("overlay3d");
        document.getElementById("renderingContainer").appendChild(this.renderer3D.domElement);

        // 2D
        this.canvas2D = document.createElement("canvas");
        this.canvas2D.width = window.innerWidth;
        this.canvas2D.height = window.innerHeight;
        this.canvas2D.classList.add("overlay2d");
        document.getElementById("renderingContainer").appendChild(this.canvas2D);
        this.renderer2D = this.canvas2D.getContext("2d");

        window.addEventListener("resize", (event) =>
        {
            this.renderer3D.setSize(window.innerWidth, window.innerHeight);
            this.canvas2D.width = window.innerWidth;
            this.canvas2D.height = window.innerHeight;
        });

        this.client.logger.info("Renderer intialization complete!");
    }

    render3D()
    {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.mesh.rotation.z += 0.01;
        this.renderer3D.render(this.scene, this.camera);
    }

    render2D()
    {
        requestAnimationFrame(this.render2D.bind(this));
        this.renderer2D.clearRect(0, 0, this.renderer2D.canvas.width, this.renderer2D.canvas.height);



    }

    // Split into a seperate function due to external initialization happening between the renderer starting and the game starting
    beginRendering()
    {
        // After everything is finished rendering, begin the animation loop.
        requestAnimationFrame(this.render2D.bind(this));
        this.renderer3D.setAnimationLoop(this.render3D.bind(this));
    }
}

export { Renderer };