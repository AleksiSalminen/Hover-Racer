import THREE from "../Three.dev.js";

/**
 * @author alteredq / http://alteredqualia.com/
 */


const TexturePass = function (texture, opacity) {

	var shader = THREE.ShaderExtras["screen"];

	this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

	this.uniforms["opacity"].value = (opacity !== undefined) ? opacity : 1.0;
	this.uniforms["tDiffuse"].texture = texture;

	this.material = new THREE.ShaderMaterial({

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	});

	this.enabled = true;
	this.needsSwap = false;

};

TexturePass.prototype = {

	render: function (renderer, writeBuffer, readBuffer, delta) {

		THREE.EffectComposer.quad.material = this.material;

		renderer.render(THREE.EffectComposer.scene, THREE.EffectComposer.camera, readBuffer);

	}

};


export default TexturePass;
