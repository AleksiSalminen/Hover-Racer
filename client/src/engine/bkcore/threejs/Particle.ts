import THREE from "../../libs/Three.dev.js";


export default class Particle {

    // ATTRIBUTES

    position: THREE.Vector3;
    velocity: THREE.Vector3;
    force: THREE.Vector3;
    color: THREE.Color;
    basecolor: THREE.Color;
    life: number;
    available: boolean;

    // CONSTRUCTORS

    constructor() {
        this.position = new THREE.Vector3(-10000, -10000, -10000);
        this.velocity = new THREE.Vector3();
        this.force = new THREE.Vector3();
        this.color = new THREE.Color(0x000000);
        this.basecolor = new THREE.Color(0x000000);
        this.life = 0.0;
        this.available = true;
    }

    // METHODS
    
    reset() {
        this.position.set(0, -100000, 0);
        this.velocity.set(0, 0, 0);
        this.force.set(0, 0, 0);
        this.color.setRGB(0, 0, 0);
        this.basecolor.setRGB(0, 0, 0);
        this.life = 0.0;
        this.available = true;
    }
}
