import THREE from "../../libs/Three.dev.js";
import RenderPass from "../../libs/postprocessing/RenderPass.js";
THREE.RenderPass = RenderPass;
import EffectComposer from "../../libs/postprocessing/EffectComposer.js";
THREE.EffectComposer = EffectComposer;
import BloomPass from "../../libs/postprocessing/BloomPass.js";
THREE.BloomPass = BloomPass;

import RenderManagerC from "../threejs/RenderManager.js";
import Shaders from "../threejs/Shaders.js";
import HUD from "./HUD.js";
import tracks from "./Tracks.js";
import Gameplay from "./Gameplay.js";
import Timer from "../utils/Timer.js";


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
	gameover;
	godmode;
	hud;
	gameplay;
	composers;

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

		this.difficulty = opts.difficulty == undefined ? 0 : opts.difficulty;
		this.player = opts.player == undefined ? "Anonym" : opts.player;

		this.tracks = tracks;
		this.track = this.tracks[opts.track == undefined ? 'Cityscape' : opts.track];

		this.mode = opts.mode == undefined ? 'timeattack' : opts.mode;

		this.controlType = opts.controlType == undefined ? 1 : opts.controlType;

		// 0 == low, 1 == mid, 2 == high, 3 == very high
		// the old platform+quality combinations map to these new quality values
		// as follows:
		// mobile + low quality => 0 (LOW)
		// mobile + mid quality OR desktop + low quality => 1 (MID)
		// mobile + high quality => 2 (HIGH)
		// desktop + mid or high quality => 3 (VERY HIGH)
		this.quality = opts.quality == undefined ? 3 : opts.quality;

		if (this.quality === 0) {
			this.width /= 2;
			this.height /= 2;
		}

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

		this.gameover = opts.gameover == undefined ? null : opts.gameover;

		this.godmode = opts.godmode == undefined ? false : opts.godmode;

		this.hud = null;

		this.gameplay = null;

		this.composers = {
			game: null
		};

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

		//bkcore.Audio.stop('bg');
		//bkcore.Audio.stop('wind');
		//bkcore.Audio.volume('wind', 0.35);
		//bkcore.Audio.play('bg');
		//bkcore.Audio.play('wind');
	}

	restart() {
		try { this.document.getElementById('finish').style.display = 'none'; }
		catch (e) { };
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
		this.track.buildMaterials(this.quality);
		this.track.buildScenes(this, this.quality);
		this.initGameComposer();
	}

	load(opts) {
		this.track.load(opts, this.quality);
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

		//bkcore.Audio.play('bg');
		//bkcore.Audio.play('wind');
		//bkcore.Audio.volume('wind', 0.35);
	}

	displayScore(f, l) {
		this.active = false;
	}

	initRenderer() {
		let renderer = new THREE.WebGLRenderer({
			antialias: false,
			clearColor: 0x000000
		});

		// desktop + quality mid or high
		if (this.quality > 2) {
			renderer.physicallyBasedShading = true;
			renderer.gammaInput = true;
			renderer.gammaOutput = true;
			renderer.shadowMapEnabled = true;
			renderer.shadowMapSoft = true;
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

		// desktop + quality mid or high
		if (this.quality > 2) {
			let effectBloom = new THREE.BloomPass(0.8, 25, 4, 256);

			this.composers.game.addPass(effectBloom);

			this.extras.bloom = effectBloom;
		}

		// desktop + quality low, mid or high
		// OR
		// mobile + quality mid or high
		if (this.quality > 0)
			this.composers.game.addPass(effectHex);
		else
			this.composers.game.addPass(effectScreen);
	}

	createMesh(parent, geometry, x, y, z, mat) {
		geometry.computeTangents();

		let mesh = new THREE.Mesh(geometry, mat);
		mesh.position.set(x, y, z);
		parent.add(mesh);

		// desktop + quality mid or high
		if (this.quality > 2) {
			mesh.castShadow = true;
			mesh.receiveShadow = true;
		}

		return mesh;
	}

	tweakShipControls() {
		let c = this.components.shipControls;
		if (this.difficulty == 1) {
			c.airResist = 0.035;
			c.airDrift = 0.07;
			c.thrust = 0.035;
			c.airBrake = 0.04;
			c.maxSpeed = 9.6;
			c.boosterSpeed = c.maxSpeed * 0.35;
			c.boosterDecay = 0.007;
			c.angularSpeed = 0.0140;
			c.airAngularSpeed = 0.0165;
			c.rollAngle = 0.6;
			c.shieldDamage = 0.03;
			c.collisionSpeedDecrease = 0.8;
			c.collisionSpeedDecreaseCoef = 0.5;
			c.rollLerp = 0.1;
			c.driftLerp = 0.4;
			c.angularLerp = 0.4;
		}
		else if (this.difficulty == 0) {
			c.airResist = 0.02;
			c.airDrift = 0.06;
			c.thrust = 0.02;
			c.airBrake = 0.025;
			c.maxSpeed = 7.0;
			c.boosterSpeed = c.maxSpeed * 0.5;
			c.boosterDecay = 0.007;
			c.angularSpeed = 0.0125;
			c.airAngularSpeed = 0.0135;
			c.rollAngle = 0.6;
			c.shieldDamage = 0.06;
			c.collisionSpeedDecrease = 0.8;
			c.collisionSpeedDecreaseCoef = 0.5;
			c.rollLerp = 0.07;
			c.driftLerp = 0.3;
			c.angularLerp = 0.4;
		}

		if (this.godmode)
			c.shieldDamage = 0.0;
	}

}

