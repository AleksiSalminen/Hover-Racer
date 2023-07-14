import THREE from "../../libs/Three.dev.js";
import RenderPass from "../../libs/postprocessing/RenderPass.js";
THREE.RenderPass = RenderPass;
import EffectComposer from "../../libs/postprocessing/EffectComposer.js";
THREE.EffectComposer = EffectComposer;
import BloomPass from "../../libs/postprocessing/BloomPass.js";
THREE.BloomPass = BloomPass;

import { ControlType, Difficulty, Quality, Godmode, settings } from "../../config/Config.ts";
import RenderManagerC from "../threejs/RenderManager.js";
import Shaders from "../threejs/Shaders.js";
import HUD from "./HUD.js";
import Gameplay from "./Gameplay.js";
import Timer from "../utils/Timer.js";
import AudioPlayer from "../audio/AudioPlayer.js";
import { load, buildMaterials, buildScenes } from "./Tracks.js";

import Cityscape from "../../../../game/tracks/Cityscape/Cityscape.ts";


export default class HexGLC {

	// ATTRIBUTES

	document;
	a;
	active;
	gameEndCallback;
	displayHUD;
	width;
	height;
	difficulty;
	player;
	track;
	tracks;
	mode;
	controlType;
	quality;
	settings;
	renderer;
	manager;
	lib;
	materials;
	components;
	extras;
	containers;
	godmode;
	hud;
	gameplay;
	composers;
	audio;

	// CONSTRUCTORS

	constructor(opts) {
		let self = this;

		this.document = opts.document;

		this.a = window.location.href;

		this.gameEndCallback = opts.gameEndCallback;

		this.active = true;
		this.displayHUD = opts.hud == undefined ? true : opts.hud;
		this.width = opts.width == undefined ? window.innerWidth : opts.width;
		this.height = opts.height == undefined ? window.innerHeight : opts.height;

		this.difficulty = opts.difficulty == undefined ? Difficulty.NORMAL : opts.difficulty;
		this.player = opts.player == undefined ? "Anonym" : opts.player;

		this.track = Cityscape;

		this.mode = opts.mode == undefined ? 'timeattack' : opts.mode;

		this.controlType = opts.controlType == undefined ? ControlType.KEYBOARD : opts.controlType;

		// 0 == low, 1 == mid, 2 == high, 3 == very high
		// the old platform+quality combinations map to these new quality values
		// as follows:
		// mobile + low quality => 0 (LOW)
		// mobile + mid quality OR desktop + low quality => 1 (MID)
		// mobile + high quality => 2 (HIGH)
		// desktop + mid or high quality => 3 (VERY HIGH)
		this.quality = opts.quality == undefined ? Quality.MEDIUM : opts.quality;

		settings.quality.forEach((quality) => {
			if (quality.name === this.quality) {
				this.quality = quality;
			}
		});

		// Set the resolution according to scale
		this.width *= this.quality.resolutionScale;
		this.height *= this.quality.resolutionScale;

		this.settings = null;
		this.renderer = null;
		this.manager = null;
		this.lib = null;
		this.materials = {};
		this.components = {};
		this.extras = {
			vignetteColor: new THREE.Color(0x458ab1),
			bloom: null,
			fxaa: null
		};

		this.containers = {};
		this.containers.main = opts.container == undefined ? document.body : opts.container;
		this.containers.overlay = opts.overlay == undefined ? document.body : opts.overlay;

		this.godmode = opts.godmode == undefined ? Godmode.OFF : opts.godmode;

		this.hud = null;

		this.gameplay = null;

		this.composers = {
			game: null
		};

		this.audio = new AudioPlayer();

		this.initRenderer();

		function onKeyPress(event) {
			if (event.keyCode == 27/*escape*/) {
				self.reset();
			}
		}

		this.document.addEventListener('keydown', onKeyPress, false);
	}

	// METHODS

	start() {
		this.manager.setCurrent("game");
		let self = this;
		function raf() {
			if (self && self.active) requestAnimationFrame(raf);
			self.update();
		}

		//if(this.a[15] == "o")
		raf();

		this.initGameplay();
	}

	reset() {
		this.manager.get('game').objects.lowFPS = 0;
		this.gameplay.start();

		this.audio.stop('bg');
		this.audio.stop('wind');
		this.audio.volume('wind', 0.35);
		this.audio.play('bg');
		this.audio.play('wind');
	}

	restart() {
		this.reset();
	}

	update() {
		if (!this.active) {
			this.end();
			return;
		}

		if (this.gameplay != null)
			this.gameplay.update();

		this.manager.renderCurrent();
	}

	end() {
		this.gameEndCallback();
	}

	init() {
		this.initHUD();
		buildMaterials(this.track, this.quality);
		buildScenes(this, this.track, this.quality, this.audio);
		this.initGameComposer();
	}

	load(opts) {
		load(this.track, opts, this.quality, this.audio);
		//this.track.load(opts, this.quality, this.audio);
	}

	initGameplay() {
		let self = this;

		this.gameplay = new Gameplay({
			mode: this.mode,
			hud: this.hud,
			shipControls: this.components.shipControls,
			cameraControls: this.components.cameraChase,
			analyser: this.track.analyser,
			pixelRatio: this.track.pixelRatio,
			track: this.track,
			onFinish: function () {
				self.components.shipControls.terminate();
				self.displayScore(this.finishTime, this.lapTimes);
			}
		});

		this.gameplay.start();

		this.audio.play('bg');
		this.audio.play('wind');
		this.audio.volume('wind', 0.35);
	}

	displayScore(f, l) {
		this.active = false;
	}

	initRenderer() {
		let renderer = new THREE.WebGLRenderer({
			antialias: false,
			clearColor: 0x000000
		});

		// Add shading if high enough quality
		if (this.quality.renderer.useShading) {
			renderer.physicallyBasedShading = this.quality.renderer.physicallyBasedShading;
			renderer.gammaInput = this.quality.renderer.gammaInput;
			renderer.gammaOutput = this.quality.renderer.gammaOutput;
			renderer.shadowMapEnabled = this.quality.renderer.shadowMapEnabled;
			renderer.shadowMapSoft = this.quality.renderer.shadowMapSoft;
		}

		renderer.autoClear = false;
		renderer.sortObjects = false;
		renderer.setSize(this.width, this.height);
		renderer.domElement.style.position = "relative";

		this.containers.main.appendChild(renderer.domElement);
		this.canvas = renderer.domElement;
		this.renderer = renderer;
		this.manager = new RenderManagerC(renderer);
	}

	initHUD() {
		if (!this.displayHUD) return;
		this.hud = new HUD({
			width: this.width,
			height: this.height,
			font: "BebasNeueRegular",
			bg: this.track.lib.get("images", "hud.bg"),
			speed: this.track.lib.get("images", "hud.speed"),
			shield: this.track.lib.get("images", "hud.shield")
		});
		this.containers.overlay.appendChild(this.hud.canvas);
	}

	initGameComposer() {
		let renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
		let renderTarget = new THREE.WebGLRenderTarget(this.width, this.height, renderTargetParameters);

		// GAME COMPOSER
		let renderSky = new THREE.RenderPass(this.manager.get("sky").scene, this.manager.get("sky").camera);

		let renderModel = new THREE.RenderPass(this.manager.get("game").scene, this.manager.get("game").camera);
		renderModel.clear = false;

		this.composers.game = new THREE.EffectComposer(this.renderer, renderTarget);

		let effectScreen = new THREE.ShaderPass(THREE.ShaderExtras["screen"]);
		effectScreen.renderToScreen = true;
		let effectVignette = new THREE.ShaderPass(THREE.ShaderExtras["vignette"]);

		let effectHex = new THREE.ShaderPass(Shaders["hexvignette"]);
		effectHex.uniforms['size'].value = 512.0 * (this.width / 1633);
		effectHex.uniforms['rx'].value = this.width;
		effectHex.uniforms['ry'].value = this.height;
		effectHex.uniforms['tHex'].texture = this.track.lib.get("textures", "hex");
		effectHex.uniforms['color'].value = this.extras.vignetteColor;

		effectHex.renderToScreen = true;

		this.composers.game.addPass(renderSky);
		this.composers.game.addPass(renderModel);

		// if(this.quality > 0 && !this.mobile)
		// {
		// 	let effectFXAA = new THREE.ShaderPass( THREE.ShaderExtras[ "fxaa" ] );
		// 	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / this.width, 1 / this.height );

		// 	this.composers.game.addPass( effectFXAA );

		// 	this.extras.fxaa = effectFXAA;

		// }

		// Add bloom if high enough quality
		if (this.quality.showBloom) {
			let effectBloom = new THREE.BloomPass(0.8, 25, 4, 256);
			this.composers.game.addPass(effectBloom);
			this.extras.bloom = effectBloom;
		}

		// Add hex view if high enough quality
		if (this.quality.showHex)
			this.composers.game.addPass(effectHex);
		else
			this.composers.game.addPass(effectScreen);	
	}

	createMesh(parent, geometry, x, y, z, mat) {
		geometry.computeTangents();

		let mesh = new THREE.Mesh(geometry, mat);
		mesh.position.set(x, y, z);
		parent.add(mesh);

		// Add mesh shadows if high enough quality
		mesh.castShadow = this.quality.mesh.castShadow;
		mesh.receiveShadow = this.quality.mesh.receiveShadow;

		return mesh;
	}

	tweakShipControls() {
		let c = this.components.shipControls;
		settings.difficulty.forEach((setting) => {
			if (setting.name === this.difficulty) {
				c.airResist = setting.airResist;
				c.airDrift = setting.airDrift;
				c.thrust = setting.thrust;
				c.airBrake = setting.airBrake;
				c.maxSpeed = setting.maxSpeed;
				c.boosterSpeed = setting.boosterSpeed;
				c.boosterDecay = setting.boosterDecay;
				c.angularSpeed = setting.angularSpeed;
				c.airAngularSpeed = setting.airAngularSpeed;
				c.rollAngle = setting.rollAngle;
				c.shieldDamage = setting.shieldDamage;
				c.collisionSpeedDecrease = setting.collisionSpeedDecrease;
				c.collisionSpeedDecreaseCoef = setting.collisionSpeedDecreaseCoef;
				c.rollLerp = setting.rollLerp;
				c.driftLerp = setting.driftLerp;
				c.angularLerp = setting.angularLerp;
			}
		});

		if (this.godmode === Godmode.ON)
			c.shieldDamage = 0.0;
	}

}

