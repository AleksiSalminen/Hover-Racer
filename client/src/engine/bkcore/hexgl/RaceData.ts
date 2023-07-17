import THREE from "../../libs/Three.dev.js";
import ShipControls from "./ShipControls.js";


export default class RaceData {

	// ATTRIBUTES

	track: any;
	mode: any;
	shipControls: ShipControls;
	rate: number; // 1 / rate
	rateState: number;
	data: any[];
	last: number;
	seek: number;
	_p: THREE.Vector3;
	_pp: THREE.Vector3;
	_np: THREE.Vector3;
	_q: THREE.Quaternion;
	_pq: THREE.Quaternion;
	_nq: THREE.Quaternion;

	// CONSTRUCTORS

	constructor(track: any, mode: any, shipControls: ShipControls) {
		this.track = track;
		this.mode = mode;
		this.shipControls = shipControls;

		this.rate = 2; // 1 / rate
		this.rateState = 1;

		this.data = [];
		this.last = -1;
		this.seek = 0;

		this._p = new THREE.Vector3();
		this._pp = new THREE.Vector3();
		this._np = new THREE.Vector3();
		this._q = new THREE.Quaternion();
		this._pq = new THREE.Quaternion();
		this._nq = new THREE.Quaternion();
	}

	// METHODS

	tick(time: number) {
		if (this.rateState === 1) {
			let p = this.shipControls.getPosition();
			let q = this.shipControls.getQuaternion();
			this.data.push([
				time,
				p.x,
				p.y,
				p.z,
				q.x,
				q.y,
				q.z,
				q.w
			]);
			++this.last;
		} else if (this.rateState === this.rate) {
			this.rateState = 0;
		}

		this.rate++;
	}

	applyInterpolated(time: number) {
		while (this.seek < this.last && this.data[this.seek + 1][0] < time) {
			++this.seek;
		}

		let prev = this.data[this.seek];
		this._pp.set(prev[1], prev[2], prev[3]);
		this._pq.set(prev[4], prev[5], prev[6], prev[7]);

		if (this.seek < 0) {
			console.warn('Bad race data.');
			return;
		}

		// no interpolation
		if (this.seek === this.last || this.seek === 0) {
			this.shipControls.teleport(this._pp, this._pq);
		}

		// interpolation
		let next = this.data[this.seek + 1];
		this._np.set(next[1], next[2], next[3]);
		this._nq.set(next[4], next[5], next[6], next[7]);

		let t = (time - prev[0]) / (next[0] - prev[0]);
		this._p.copy(this._pp).lerp(this._np, t);
		this._q.copy(this._pq).slerp(this._nq, t);

		this.shipControls.teleport(this._p, this._q);
	}

	reset() {
		this.seek = 0;
	}

	exportData() {
		return this.data;
	}

	importData(imp: any) {
		this.data = imp;
		this.last = this.data.length - 1;
		console.log(this.data);
	}
}
