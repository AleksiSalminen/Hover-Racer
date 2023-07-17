import THREE from "../../libs/Three.dev.js";


type CameraPlus = THREE.Camera & {
	position: THREE.Vector3,
	rotation: THREE.Vector3
};


export default class CameraChase {

  // ATTRIBUTES

  private dir: THREE.Vector3;
  private up: THREE.Vector3;
  private target: THREE.Vector3;
  private speedOffset: number;
  private speedOffsetMax: number;
  private speedOffsetStep: number;
  private modes: { CHASE: number; ORBIT: number };
  private mode: number;
  private camera: CameraPlus;
  private targetObject: THREE.Object3D;
  private cameraCube: THREE.Object3D | null;
  private yoffset: number;
  private zoffset: number;
  private viewOffset: number;
  private orbitOffset: number;
  private lerp: number;
  private time: number;

  // CONSTRUCTORS

  constructor(opts: {
    camera: CameraPlus;
    target: THREE.Object3D;
    cameraCube?: THREE.Object3D | null;
    yoffset?: number;
    zoffset?: number;
    viewOffset?: number;
    lerp?: number;
  }) {
    this.dir = new THREE.Vector3(0, 0, 1);
    this.up = new THREE.Vector3(0, 1, 0);
    this.target = new THREE.Vector3();
    this.speedOffset = 0;
    this.speedOffsetMax = 10;
    this.speedOffsetStep = 0.05;

    this.modes = {
      CHASE: 0,
      ORBIT: 1,
    };
    this.mode = this.modes.CHASE;

    this.camera = opts.camera;
    this.targetObject = opts.target;
    this.cameraCube = opts.cameraCube === undefined ? null : opts.cameraCube;

    this.yoffset = opts.yoffset === undefined ? 8.0 : opts.yoffset;
    this.zoffset = opts.zoffset === undefined ? 10.0 : opts.zoffset;
    this.viewOffset = opts.viewOffset === undefined ? 10.0 : opts.viewOffset;
    this.orbitOffset = 12;
    this.lerp = opts.lerp === undefined ? 0.5 : opts.lerp;
    this.time = 0.0;
  }

  // METHODS

  update(dt: number, ratio: number): void {
    if (this.mode == this.modes.CHASE) {
			this.dir.set(0, 0, 1);
			this.up.set(0, 1, 0);
	
			this.targetObject.matrix.rotateAxis(this.up);
			this.targetObject.matrix.rotateAxis(this.dir);
	
			this.speedOffset += (this.speedOffsetMax * ratio - this.speedOffset) * Math.min(1, 0.3 * dt);
	
			this.target.copy(this.targetObject.position);
			this.target.subSelf(this.dir.multiplyScalar(this.zoffset + this.speedOffset));
			this.target.addSelf(this.up.multiplyScalar(this.yoffset));
			this.target.y += -this.up.y + this.yoffset;
			this.camera.position.copy(this.target);
	
			this.camera.lookAt(this.dir.normalize().multiplyScalar(this.viewOffset).addSelf(this.targetObject.position));
		}
		else if (this.mode == this.modes.ORBIT) {
			this.time += dt * .008;
			this.dir.set(
				Math.cos(this.time) * this.orbitOffset,
				this.yoffset / 2,
				Math.sin(this.time) * this.orbitOffset
			);
			this.target.copy(this.targetObject.position).addSelf(this.dir);
			this.camera.position.copy(this.target);
			this.camera.lookAt(this.targetObject.position);
		}
	
		if (this.cameraCube != null)
			this.cameraCube.rotation.copy(this.camera.rotation);
  }
}
