import THREE from "../Three.dev.js";

/**
 * @author alteredq / http://alteredqualia.com/
 */


const ShaderPass = function (shader, textureID) {

	this.textureID = (textureID !== undefined) ? textureID : "tDiffuse";

	this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

	this.material = new THREE.ShaderMaterial({

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	});

	this.renderToScreen = false;

	this.enabled = true;
	this.needsSwap = true;
	this.clear = false;

};

ShaderPass.prototype = {

	render: function (renderer, writeBuffer, readBuffer, delta) {

		if (this.uniforms[this.textureID]) {

			this.uniforms[this.textureID].texture = readBuffer;

		}

		THREE.EffectComposer.quad.material = this.material;

		if (this.renderToScreen) {

			renderer.render(THREE.EffectComposer.scene, THREE.EffectComposer.camera);

		} else {

			renderer.render(THREE.EffectComposer.scene, THREE.EffectComposer.camera, writeBuffer, this.clear);

		}

	}

};


export default ShaderPass;
