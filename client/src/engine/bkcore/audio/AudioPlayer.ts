
type Vector3 = {
	x: number, y: number, z: number, normalize: Function
};

type SoundObj = {
	[key: string]: HTMLAudioElement & {
		src: AudioBuffer | null, gainNode: GainNode | null,
		bufferNode: object | null, loop: boolean
	}
};


export default class AudioPlayer {

	// ATTRIBUTES

	_ctx: AudioContext;
	_panner: PannerNode;
	posMultipler: number;
	sounds: SoundObj;

	// CONSTRUCTORS

	constructor() {
		if (window.AudioContext) {
			this._ctx = new (window.AudioContext)();
			this._panner = this._ctx.createPanner();
			this._panner.connect(this._ctx.destination);
			this.posMultipler = 1.5;
			this.sounds = {};
		}
		else {
			throw new Error("Cannot create audio context: No browser support");
		}
	}

	// METHODS

	addSound(src: string, id: string, loop: boolean, callback: Function, usePanner?: boolean) {
		let self = this;
		let ctx = this._ctx;
		let audio = new Audio();

		if (ctx) {
			let audio: HTMLAudioElement & { src: AudioBuffer | null, gainNode: GainNode | null, bufferNode: object | null, loop: boolean };
			audio = { src: null, gainNode: null, bufferNode: null, loop: loop };
			let xhr = new XMLHttpRequest();
			xhr.responseType = 'arraybuffer';

			xhr.onload = () => {
				ctx.decodeAudioData(xhr.response, function (b) {
					// Create Gain Node
					let gainNode = ctx.createGain();

					if (usePanner === true) {
						gainNode.connect(self._panner);
					}
					else {
						gainNode.connect(ctx.destination);
					}

					// Add the audio source
					audio.src = b;

					//Remember the gain node
					audio.gainNode = gainNode;

					self.sounds[id] = audio;

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

	play(id: string) {
		let ctx = this._ctx;

		if (ctx && this.sounds[id].gainNode) {
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

	stop(id: string) {
		let ctx = this._ctx;
		if (ctx) {
			if (this.sounds[id].bufferNode !== null && this.sounds[id].bufferNode !== undefined) {
				let bufferNode = this.sounds[id].bufferNode;
				bufferNode.stop ? bufferNode.stop(ctx.currentTime) : bufferNode.noteOff(ctx.currentTime);
			}
		}
		else {
			this.sounds[id].pause();
			this.sounds[id].currentTime = 0;
		}
	}

	volume(id:string, volume: number) {
		let ctx = this._ctx;

		if (ctx && this.sounds[id].gainNode) {
			this.sounds[id].gainNode.gain.value = volume;
		}
		else {
			this.sounds[id].volume = volume;
		}
	}

	setListenerPos(vec: Vector3) {
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

	setListenerVelocity(vec: Vector3) {
		if (this._ctx) {
			let panner = this._panner;
			//panner.setVelocity(vec.x, vec.y, vec.z);
		}
	}

}

