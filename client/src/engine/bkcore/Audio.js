

export default class Audio {

	// ATTRIBUTES

	_ctx;
	_panner;
	posMultipler;
	sounds;

	// CONSTRUCTORS

	constructor() {
		if (window.AudioContext || window.webkitAudioContext) {
			this._ctx = new (window.AudioContext || window.webkitAudioContext)();
			this._panner = this._ctx.createPanner();
			this._panner.connect(this._ctx.destination);
		}
		else {
			this._ctx = null;
		}

		this.posMultipler = 1.5;
		this.sounds = [];
	}

	// METHODS

	addSound(src, id, loop, callback, usePanner) {
		let ctx = this._ctx;
		let audio = new Audio();

		if (ctx) {
			let audio = { src: null, gainNode: null, bufferNode: null, loop: loop };
			let xhr = new XMLHttpRequest();
			xhr.responseType = 'arraybuffer';

			xhr.onload = () => {
				ctx.decodeAudioData(xhr.response, function (b) {
					// Create Gain Node
					let gainNode = ctx.createGain();

					if (usePanner === true) {
						gainNode.connect(this._panner);
					}
					else {
						gainNode.connect(ctx.destination);
					}

					// Add the audio source
					audio.src = b;

					//Remember the gain node
					audio.gainNode = gainNode;

					callback();
				}, function (e) {
					console.error('Audio decode failed!', e);
				});
			};

			xhr.open('GET', src, true);
			xhr.send(null);
		}
		else {
			// Workaround for old Safari
			audio.addEventListener('canplay', function () {
				audio.pause();
				audio.currentTime = 0;

				callback();
			}, false);

			audio.autoplay = true;
			audio.loop = loop;
			audio.src = src;
		}

		this.sounds[id] = audio;
	}

	play(id) {
		let ctx = this._ctx;

		if (ctx) {
			let sound = ctx.createBufferSource();
			sound.connect(this.sounds[id].gainNode);

			sound.buffer = this.sounds[id].src;
			sound.loop = this.sounds[id].loop;

			this.sounds[id].gainNode.gain.value = 1;
			this.sounds[id].bufferNode = sound;

			sound.start ? sound.start(0) : sound.noteOn(0);
		}
		else {
			if (this.sounds[id].currentTime > 0) {
				this.sounds[id].pause();
				this.sounds[id].currentTime = 0;
			}

			this.sounds[id].play();
		}
	}

	stop(id) {
		let ctx = this._ctx;

		if (ctx) {
			if (this.sounds[id].bufferNode !== null) {
				let bufferNode = this.sounds[id].bufferNode;
				bufferNode.stop ? bufferNode.stop(ctx.currentTime) : bufferNode.noteOff(ctx.currentTime);
			}
		}
		else {
			this.sounds[id].pause();
			this.sounds[id].currentTime = 0;
		}
	}

	volume(id, volume) {
		let ctx = this._ctx;

		if (ctx) {
			this.sounds[id].gainNode.gain.value = volume;
		}
		else {
			this.sounds[id].volume = volume;
		}
	}

	setListenerPos(vec) {
		if (this._ctx) {
			let panner = this._panner;
			let vec2 = vec.normalize();
			panner.setPosition(
				vec2.x * this.posMultipler,
				vec2.y * this.posMultipler,
				vec2.z * this.posMultipler
			);
		}
	}

	setListenerVelocity(vec) {
		if (this._ctx) {
			let panner = this._panner;
			//panner.setVelocity(vec.x, vec.y, vec.z);
		}
	}

}

