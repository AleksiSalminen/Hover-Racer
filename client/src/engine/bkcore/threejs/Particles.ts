import THREE from "../../libs/Three.dev.js";
import Particle from "./Particle.js";

/*!
 * @class Particles
 *
 * Particle system wrapper/helper
 * 
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 */

type GeometryPlus = THREE.Geometry & {
	lerp: any, verticesNeedUpdate: boolean,
	colorsNeedUpdate: boolean
}


export default class Particles {

	// ATTRIBUTES

	black: THREE.Color;
	white: THREE.Color;
	material: THREE.ParticleBasicMaterial;
	max: number;
	spawnRate: number;
	spawn: THREE.Vector3;
	velocity: THREE.Vector3;
	randomness: THREE.Vector3;
	force: THREE.Vector3;
	spawnRadius: THREE.Vector3;
	life: number;
	ageing: number;
	friction: number;
	color: THREE.Color;
	color2: THREE.Color | null;
	position: THREE.Vector3;
	rotation: THREE.Vector3;
	sort: boolean;
	pool: Particle[];
	buffer: Particle[];
	geometry: GeometryPlus;
	system: THREE.ParticleSystem;

	// CONSTRUCTORS

	constructor(opts?: {
		tint?: number;
		texture?: any;
		size?: number;
		blending?: number;
		depthTest?: boolean;
		transparent?: boolean;
		opacity?: number;
		max?: number;
		spawnRate?: number;
		spawn?: THREE.Vector3;
		velocity?: THREE.Vector3;
		randomness?: THREE.Vector3;
		force?: THREE.Vector3;
		spawnRadius?: THREE.Vector3;
		life?: number;
		friction?: number;
		color?: number;
		color2?: number;
		position?: THREE.Vector3;
		rotation?: THREE.Vector3;
		sort?: boolean;
	}) {
		if (opts) {
			this.black = new THREE.Color(0x000000);
			this.white = new THREE.Color(0xffffff);

			this.material = new THREE.ParticleBasicMaterial({
				color: opts.tint == undefined ? 0xffffff : opts.tint,
				map: opts.texture == undefined ? null : opts.texture,
				size: opts.size == undefined ? 4 : opts.size,
				blending: opts.blending == undefined ? THREE.AdditiveBlending : opts.blending,
				depthTest: opts.depthTest == undefined ? false : opts.depthTest,
				transparent: opts.transparent == undefined ? true : opts.transparent,
				vertexColors: true,
				opacity: opts.opacity == undefined ? 1.0 : opts.opacity,
				sizeAttenuation: true
			});

			this.max = opts.max == undefined ? 1000 : opts.max;
			this.spawnRate = opts.spawnRate == undefined ? 0 : opts.spawnRate;

			this.spawn = opts.spawn == undefined ? new THREE.Vector3() : opts.spawn;
			this.velocity = opts.velocity == undefined ? new THREE.Vector3() : opts.velocity;
			this.randomness = opts.randomness == undefined ? new THREE.Vector3() : opts.randomness;
			this.force = opts.force == undefined ? new THREE.Vector3() : opts.force;
			this.spawnRadius = opts.spawnRadius == undefined ? new THREE.Vector3() : opts.spawnRadius;
			this.life = opts.life == undefined ? 60 : opts.life;
			this.ageing = 1 / this.life;
			this.friction = opts.friction == undefined ? 1.0 : opts.friction;
			this.color = new THREE.Color(opts.color == undefined ? 0xffffff : opts.color);
			this.color2 = opts.color2 == undefined ? null : new THREE.Color(opts.color2);

			this.position = opts.position == undefined ? new THREE.Vector3() : opts.position;
			this.rotation = opts.rotation == undefined ? new THREE.Vector3() : opts.rotation;
			this.sort = opts.sort == undefined ? false : opts.sort;

			this.pool = [];
			this.buffer = [];
			this.geometry = new THREE.Geometry();
			this.system = null;

			this.build();
		}
		else {
			throw Error("Options not given");
		}
	}

	// METHODS

	build() {
		this.geometry = new THREE.Geometry();
		this.geometry.dynamic = true;

		this.pool = [];
		this.buffer = [];

		for (let i = 0; i < this.max; ++i) {
			let p = new Particle();
			this.pool.push(p);
			this.buffer.push(p);
			this.geometry.vertices.push(p.position);
			this.geometry.colors.push(p.color);
		}

		this.system = new THREE.ParticleSystem(this.geometry, this.material);
		this.system.position = this.position;
		this.system.rotation = this.rotation;
		this.system.sort = this.sort;
	}

	/**
	 * Emits given number of particles
	 * @param  int count
	 */
	emit(count: number) {
		let emitable = Math.min(count, this.pool.length);
		for (let i = 0; i < emitable; ++i) {
			let p = this.pool.pop();
			if (p !== undefined && p !== null) {
				p.available = false;
				p.position.copy(this.spawn)
					.add(
						this.randomVector()
							.multiply(this.spawnRadius)
					);
				p.velocity.copy(this.velocity)
					.add(
						this.randomVector()
							.multiply(this.randomness)
					);
				p.force.copy(this.force);
				p.basecolor.copy(this.color);
				if (this.color2 != undefined) p.basecolor.lerp(this.color2, Math.random());
				p.life = 1.0;
			}
		}
	}

	randomVector() {
		return new THREE.Vector3(
			Math.random() * 2 - 1,
			Math.random() * 2 - 1,
			Math.random() * 2 - 1
		);
	}

	/**
	 * Updates particles (should be call in a RAF loop)
	 * @param  float dt time delta ~1.0
	 */
	update(dt: number) {
		let p, l;
		let df = new THREE.Vector3();
		let dv = new THREE.Vector3();
		for (let i = 0; i < this.buffer.length; ++i) {

			p = this.buffer[i];

			if (p.available) continue;

			p.life -= this.ageing;

			if (p.life <= 0 && !p.available) {
				p.reset();
				this.pool.push(p);
				continue;
			}

			l = p.life > 0.5 ? 1.0 : p.life + 0.5;
			p.color.setRGB(
				l * p.basecolor.r,
				l * p.basecolor.g,
				l * p.basecolor.b
			);

			if (this.friction != 1.0)
				p.velocity.multiplyScalar(this.friction);

			df.copy(p.force).multiplyScalar(dt);
			p.velocity.add(df);

			dv.copy(p.velocity).multiplyScalar(dt);
			p.position.add(dv);
		}

		if (this.spawnRate > 0)
			this.emit(this.spawnRate);

		this.geometry.verticesNeedUpdate = true;
		this.geometry.colorsNeedUpdate = true;
	}

}
