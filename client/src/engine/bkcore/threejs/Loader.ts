import THREE from "../../libs/Three.dev.js";
import ImageData from "../utils/ImageData.js";

/*!
 * @class bkcore.threejs.Loader
 *
 * Loads multiple resources, get progress, callback friendly.
 * Supports textures, texturesCube, geometries, analysers, images.
 * 
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 */


export default class LoaderC {

	// ATTRIBUTES

	jsonLoader: THREE.JSONLoader;
	errorCallback: (s: string) => void;
	loadCallback: () => void;
	progressCallback: (progress: any, type?: string, name?: string) => void;
	types: {
		textures: null | any;
		texturesCube: null | any;
		geometries: null | any;
		analysers: null | any;
		images: null | any;
		sounds: null | any;
	};
	states: { [key: string]: any | {} };
	data: { [key: string]: any | {} };
	progress: {
		total: number;
		remaining: number;
		loaded: number;
		finished: boolean;
	};

	// CONSTRUCTORS

	constructor(opts: any) {
		this.jsonLoader = new THREE.JSONLoader();

		this.errorCallback =
			opts.onError == undefined
				? function (s: string) {
					console.warn("Error while loading %s.".replace("%s", s));
				}
				: opts.onError;
		this.loadCallback =
			opts.onLoad == undefined
				? function () {
					console.log("Loaded.");
				}
				: opts.onLoad;
		this.progressCallback = opts.onProgress;

		this.types = {
			textures: null,
			texturesCube: null,
			geometries: null,
			analysers: null,
			images: null,
			sounds: null,
		};

		this.states = {};
		this.data = {};

		for (let t in this.types) {
			this.data[t] = {};
			this.states[t] = {};
		}

		this.progress = {
			total: 0,
			remaining: 0,
			loaded: 0,
			finished: false,
		};
	}

	// METHODS

	/**
	 * Load the given list of resources
	 * @param  {textures, texturesCube, geometries, analysers, images} data
	 */
	load(data: { [key: string]: any }, audio?: any) {
		for (let k in this.types) {
			if (k in data) {
				let size = 0;
				for (let j in data[k]) size++;
				this.progress.total += size;
				this.progress.remaining += size;
			}
		}

		for (let t in data.textures) this.loadTexture(t, data.textures[t]);

		for (let c in data.texturesCube)
			this.loadTextureCube(c, data.texturesCube[c]);

		for (let g in data.geometries) this.loadGeometry(g, data.geometries[g]);

		for (let a in data.analysers) this.loadAnalyser(a, data.analysers[a]);

		for (let i in data.images) this.loadImage(i, data.images[i]);

		for (let s in data.sounds)
			this.loadSound(
				audio,
				data.sounds[s].src,
				s,
				data.sounds[s].loop,
				data.sounds[s].usePanner
			);

		this.progressCallback.call(this, this.progress);
	}

	updateState(type: string, name: string, state: boolean) {
		if (!(type in this.types)) {
			console.warn("Unknown loader type.");
			return;
		}

		if (state == true) {
			this.progress.remaining--;
			this.progress.loaded++;
			this.progressCallback.call(this, this.progress, type, name);
		}

		this.states[type][name] = state;

		if (this.progress.loaded == this.progress.total) {
			this.loadCallback.call(this);
		}
	}

	/**
	 * Get loaded resource
	 * @param  string type [textures, texturesCube, geometries, analysers, images]
	 * @param  string name
	 * @return Mixed
	 */
	get(type: string, name: string) {
		if (!(type in this.types)) {
			console.warn("Unknown loader type: " + type);
			return null;
		}
		if (!(name in this.data[type])) {
			console.warn("Unknown file: " + name);
			return null;
		}

		return this.data[type][name];
	}

	loaded(type: string, name: string) {
		if (!(type in this.types)) {
			console.warn("Unknown loader type.");
			return null;
		}
		if (!(name in this.states[type])) {
			console.warn("Unknown file.");
			return null;
		}

		return this.states[type][name];
	}

	loadTexture(name: string, url: string) {
		let self = this;
		let bkcore = { NONE: undefined }; // This is changed, weird
		this.updateState("textures", name, false);
		this.data.textures[name] = THREE.ImageUtils.loadTexture(
			url,
			bkcore.NONE,
			function () {
				self.updateState("textures", name, true);
			},
			function () {
				self.errorCallback.call(self, name);
			}
		);
	}

	loadTextureCube(name: string, url: string) {
		let self = this;

		let urls = [
			url.replace("%1", "px"),
			url.replace("%1", "nx"),
			url.replace("%1", "py"),
			url.replace("%1", "ny"),
			url.replace("%1", "pz"),
			url.replace("%1", "nz"),
		];

		this.updateState("texturesCube", name, false);
		this.data.texturesCube[name] = THREE.ImageUtils.loadTextureCube(
			urls,
			new THREE.CubeRefractionMapping(),
			function () {
				self.updateState("texturesCube", name, true);
			}
		);
	}

	loadGeometry(name: string, url: string) {
		let self = this;
		this.data.geometries[name] = null;
		this.updateState("geometries", name, false);
		this.jsonLoader.load(url, function (a: any) {
			self.data.geometries[name] = a;
			self.updateState("geometries", name, true);
		});
	}

	loadAnalyser(name: string, url: string) {
		let self = this;
		this.updateState("analysers", name, false);
		this.data.analysers[name] = new ImageData(url, function () {
			self.updateState("analysers", name, true);
		});
	}

	loadImage(name: string, url: string) {
		let self = this;
		this.updateState("images", name, false);
		let e = new Image();
		e.onload = () => {
			self.updateState("images", name, true);
		};
		e.crossOrigin = "anonymous";
		e.src = url;
		this.data.images[name] = e;
	}

	loadSound(audio: any, src: string, name: string, loop: boolean, usePanner: boolean) {
		let self = this;
		this.updateState("sounds", name, false);

		audio.addSound(src, name, loop, function () {
			self.updateState("sounds", name, true);
		});

		this.data.sounds[name] = {
			play: function () {
				audio.play(name);
			},
			stop: function () {
				audio.stop(name);
			},
			volume: function (vol: number) {
				audio.volume(name, vol);
			},
		};
	}
}
