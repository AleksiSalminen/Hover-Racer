import THREE from "../Three.dev.js";
import ShaderExtras from "../ShaderExtras.js";
THREE.ShaderExtras = ShaderExtras;
import ShaderPass from "./ShaderPass.js";
THREE.ShaderPass = ShaderPass;

/**
 * @author alteredq / http://alteredqualia.com/
 */


const EffectComposer = function (renderer, renderTarget) {

	this.renderer = renderer;

	this.renderTarget1 = renderTarget;

	if (this.renderTarget1 === undefined) {

		var width = window.innerWidth || 1;
		var height = window.innerHeight || 1;

		this.renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
		this.renderTarget1 = new THREE.WebGLRenderTarget(width, height, this.renderTargetParameters);

	}

	this.renderTarget2 = this.renderTarget1.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	this.copyPass = new THREE.ShaderPass(THREE.ShaderExtras["screen"]);

};

EffectComposer.prototype = {

	swapBuffers: function () {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	},

	addPass: function (pass) {

		this.passes.push(pass);

	},

	render: function (delta) {

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for (i = 0; i < il; i++) {

			pass = this.passes[i];

			if (!pass.enabled) continue;

			pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

			if (pass.needsSwap) {

				if (maskActive) {

					var context = this.renderer.context;

					context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

					this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);

					context.stencilFunc(context.EQUAL, 1, 0xffffffff);

				}

				this.swapBuffers();

			}

			if (pass instanceof THREE.MaskPass) {

				maskActive = true;

			} else if (pass instanceof THREE.ClearMaskPass) {

				maskActive = false;

			}

		}

	},

	reset: function (renderTarget) {

		this.renderTarget1 = renderTarget;

		if (this.renderTarget1 === undefined) {

			this.renderTarget1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, this.renderTargetParameters);

		}

		this.renderTarget2 = this.renderTarget1.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

		EffectComposer.quad.scale.set(window.innerWidth, window.innerHeight, 1);

		EffectComposer.camera.left = window.innerWidth / - 2;
		EffectComposer.camera.right = window.innerWidth / 2;
		EffectComposer.camera.top = window.innerHeight / 2;
		EffectComposer.camera.bottom = window.innerHeight / - 2;

		EffectComposer.camera.updateProjectionMatrix();

	}

};

// shared ortho camera

EffectComposer.initWidth = window.innerWidth || 1;
EffectComposer.initHeight = window.innerHeight || 1;

EffectComposer.camera = new THREE.OrthographicCamera(EffectComposer.initWidth / - 2, EffectComposer.initWidth / 2, EffectComposer.initHeight / 2, EffectComposer.initHeight / - 2, -10000, 10000);

// shared fullscreen quad scene

EffectComposer.geometry = new THREE.PlaneGeometry(1, 1);
EffectComposer.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));

EffectComposer.quad = new THREE.Mesh(EffectComposer.geometry, null);
EffectComposer.quad.position.z = -100;
EffectComposer.quad.scale.set(EffectComposer.initWidth, EffectComposer.initHeight, 1);

EffectComposer.scene = new THREE.Scene();
EffectComposer.scene.add(EffectComposer.quad);
EffectComposer.scene.add(EffectComposer.camera);


export default EffectComposer;
