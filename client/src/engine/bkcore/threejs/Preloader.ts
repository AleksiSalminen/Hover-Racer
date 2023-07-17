import THREE from "../../libs/Three.dev.js";


type ScenePlus = THREE.Scene & {
	add: any
}

type MeshPlus = THREE.Mesh & {
	add: any, scale: any, rotation: any
}

type CameraPlus = THREE.PerspectiveCamera & {
	position: any
}


export default class Preloader {

	// ATTRIBUTES

	private document: Document;
	private end: boolean;
	private time: number;
	private y: number;
	private ratio: number;
	private height: number;
	private width: number;
	private scale: number;
	private line: number;
	private container: HTMLElement;
	private renderer: THREE.CanvasRenderer;
	private ctx: CanvasRenderingContext2D;
	private scene: ScenePlus;
	private camera: CameraPlus;
	private stage: THREE.Object3D;
	private cube: MeshPlus;
	private cubew: MeshPlus;
	private outercube: MeshPlus;
	private mmsave: (e: MouseEvent) => void;

	// CONSTRUCTORS

	constructor(opts: {
		document?: Document;
		height: number;
		width: number;
		scale?: number;
		line?: number;
		container: HTMLElement;
	}) {
		this.document = opts.document || document;
		this.end = false;
		this.time = 0.0;
		this.y = 0.3;
		this.ratio = 0.0;
		this.height = opts.height;
		this.width = opts.width;
		this.scale = opts.scale === undefined ? 10 : opts.scale;
		this.line = opts.line === undefined ? 3 : opts.line;
		this.container = opts.container;
		this.renderer = new THREE.CanvasRenderer({
			clearColor: 0xffffff,
		});
		this.renderer.setSize(opts.width, opts.height);
		this.container.appendChild(this.renderer.domElement);
		this.ctx = this.renderer.domElement.getContext("2d");
		this.ctx.textAlign = "center";
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			70,
			opts.width / opts.height,
			1,
			1000
		);
		this.camera.position.z = 100;
		this.scene.add(this.camera);
		this.stage = new THREE.Object3D();
		this.stage.position.set(0, 10, 0);
		this.scene.add(this.stage);
		this.cube = new THREE.Mesh(
			new THREE.CubeGeometry(this.scale, this.scale, this.scale, 1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0x999999 })
		);
		this.cube.scale.set(0.0, 0.0, 0.0);
		this.stage.add(this.cube);
		this.cubew = new THREE.Mesh(
			new THREE.CubeGeometry(this.scale, this.scale, this.scale, 1, 1, 1),
			new THREE.MeshBasicMaterial({
				wireframe: true,
				wireframeLinewidth: this.line,
				color: 0xffffff,
			})
		);
		this.cube.add(this.cubew);
		this.outercube = new THREE.Mesh(
			new THREE.CubeGeometry(this.scale, this.scale, this.scale, 1, 1, 1),
			new THREE.MeshBasicMaterial({
				wireframe: true,
				wireframeLinewidth: this.line,
				color: 0x0093d8,
			})
		);
		this.stage.add(this.outercube);
		const self = this;
		function raf() {
			if (!self.end) {
				requestAnimationFrame(raf);
				self.render();
			}
		}
		raf();
		function mm(e: MouseEvent) {
			self.mouseMove.call(self, e);
		}
		this.mmsave = mm;
		this.document.addEventListener("mousemove", mm, false);
	}

	// METHODS

	private render() {
		this.time += 0.02;
		this.ctx.clearRect(0, 0, this.width, this.height);
		const s = (this.ratio - this.cube.scale.x) * 0.3;
		this.cube.scale.addScalar(s);
		this.cube.rotation.y = this.time;
		this.outercube.rotation.y = this.time;
		this.stage.rotation.x += (this.y - this.stage.rotation.x) * 0.3;
		this.renderer.render(this.scene, this.camera);
		this.ctx.save();
		this.ctx.font = "40px Arial";
		this.ctx.fillStyle = "rgb(200, 200, 200)";
		this.ctx.fillText(
			Math.round(this.ratio * 100).toString(),
			this.width / 2,
			this.height / 2 + 30
		);
		this.ctx.restore();
	}

	private mouseMove(event: MouseEvent) {
		const h2 = this.height / 2;
		this.y = -(event.clientY - h2) / h2 + 0.3;
	}

	remove() {
		this.document.removeEventListener("mousemove", this.mmsave, false);
		this.end = true;
		this.renderer = null;
		this.container.innerHTML = "";
	}
}
