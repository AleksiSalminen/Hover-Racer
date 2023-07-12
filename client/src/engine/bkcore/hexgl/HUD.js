

export default class HUD {

	// ATTRIBUTES

	visible;
	messageOnly;
	width;
	height;
	canvas;
	ctx;
	bg;
	fgspeed;
	fgshield;
	speedFontRatio;
	speedBarRatio;
	shieldFontRatio;
	shieldBarYRatio;
	shieldBarWRatio;
	shieldBarHRatio;
	timeMarginRatio;
	timeFontRatio;
	font;
	time;
	message;
	previousMessage;
	messageTiming;
	messagePos;
	messagePosTarget;
	messagePosTargetRatio;
	messageA;
	messageAS;
	messageDuration;
	messageDurationD;
	messageDurationS;
	messageYRatio;
	messageFontRatio;
	messageFontRatioStart;
	messageFontRatioEnd;
	messageFontLerp;
	messageLerp;
	messageFontAlpha;y
	lapMarginRatio;
	lap;
	lapSeparator;
	timeSeparators;
	step;
	maxStep;

	// CONSTRUCTORS

	constructor(opts) {
		let self = this;

		this.visible = true;
		this.messageOnly = false;

		this.width = opts.width;
		this.height = opts.height;

		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.ctx = this.canvas.getContext('2d');
		this.ctx.textAlign = "center";

		this.bg = opts.bg;//"textures/hud/hud-bg.png";

		this.fgspeed = opts.speed;//"textures/hud/hud-fg-speed.png";

		this.fgshield = opts.shield;//"textures/hud/hud-fg-shield.png";

		this.speedFontRatio = 24;
		this.speedBarRatio = 2.91;
		this.shieldFontRatio = 64;
		this.shieldBarYRatio = 34;
		this.shieldBarWRatio = 18.3;
		this.shieldBarHRatio = 14.3;
		this.timeMarginRatio = 18;
		this.timeFontRatio = 19.2;

		this.font = opts.font || "Arial";

		this.time = "";

		this.message = "";
		this.previousMessage = "";
		this.messageTiming = 0;
		this.messagePos = 0.0;
		this.messagePosTarget = 0.0;
		this.messagePosTargetRatio = 12;
		this.messageA = 1.0;
		this.messageAS = 1.0;
		this.messageDuration = 2 * 60;
		this.messageDurationD = 2 * 60;
		this.messageDurationS = 30;
		this.messageYRatio = 34;
		this.messageFontRatio = 10;
		this.messageFontRatioStart = 6;
		this.messageFontRatioEnd = 10;
		this.messageFontLerp = 0.4;
		this.messageLerp = 0.4;
		this.messageFontAlpha = 0.8;

		this.lapMarginRatio = 14;
		this.lap = "";
		this.lapSeparator = "/";

		this.timeSeparators = ["", "'", "''", ""];

		this.step = 0;
		this.maxStep = 2;
	}

	// METHODS

	resize(w, h) {
		this.width = w;
		this.height = h;
		this.canvas.width = w;
		this.canvas.height = h;
	}

	display(msg, duration) {
		this.messageTiming = 0;

		if (this.message != "") {
			this.messageA = this.messageFontAlpha;
			this.messagePos = 0.0;
			this.messagePosTarget = this.width / this.messagePosTargetRatio;
			this.previousMessage = this.message;
		}

		this.messageFontRatio = this.messageFontRatioStart;
		this.messageAS = 0.0;
		this.message = msg;
		this.messageDuration = duration == undefined ? this.messageDurationD : duration * 60;
	}

	updateLap(current, total) {
		this.lap = current + this.lapSeparator + total;
	}

	resetLap() {
		this.lap = "";
	}

	updateTime(time) {
		this.time = this.timeSeparators[0] + time.m + this.timeSeparators[1] + time.s + this.timeSeparators[2] + time.ms + this.timeSeparators[3];
	}

	resetTime() {
		this.time = "";
	}

	update(speed, speedRatio, shield, shieldRatio) {
		let SCREEN_WIDTH = this.width;
		let SCREEN_HEIGHT = this.height;

		let SCREEN_HW = SCREEN_WIDTH / 2;
		let SCREEN_HH = SCREEN_HEIGHT / 2;

		if (!this.visible) {
			this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
			return;
		}

		let w = this.bg.width;
		let h = this.bg.height;
		let r = h / w;
		let nw = SCREEN_WIDTH;
		let nh = nw * r;
		let oh = SCREEN_HEIGHT - nh;
		let o = 0;
		//speedbar
		let ba = nh;
		let bl = SCREEN_WIDTH / this.speedBarRatio;
		let bw = bl * speedRatio;
		//shieldbar
		let sw = SCREEN_WIDTH / this.shieldBarWRatio;
		let sho = SCREEN_WIDTH / this.shieldBarHRatio;
		let sh = sho * shieldRatio;
		let sy = (SCREEN_WIDTH / this.shieldBarYRatio) + sho - sh;


		if (this.step == 0) {
			this.ctx.clearRect(0, oh, SCREEN_WIDTH, nh);

			if (!this.messageOnly) {
				this.ctx.drawImage(this.bg, o, oh, nw, nh);

				this.ctx.save();
				this.ctx.beginPath();
				this.ctx.moveTo(bw + ba + SCREEN_HW, oh);
				this.ctx.lineTo(-(bw + ba) + SCREEN_HW, oh);
				this.ctx.lineTo(-bw + SCREEN_HW, SCREEN_HEIGHT);
				this.ctx.lineTo(bw + SCREEN_HW, SCREEN_HEIGHT);
				this.ctx.lineTo(bw + ba + SCREEN_HW, oh);
				this.ctx.clip();
				this.ctx.drawImage(this.fgspeed, o, oh, nw, nh);
				this.ctx.restore();

				this.ctx.save();
				this.ctx.beginPath();
				this.ctx.moveTo(-sw + SCREEN_HW, oh + sy);
				this.ctx.lineTo(sw + SCREEN_HW, oh + sy);
				this.ctx.lineTo(sw + SCREEN_HW, oh + sh + sy);
				this.ctx.lineTo(-sw + SCREEN_HW, oh + sh + sy);
				this.ctx.lineTo(-sw + SCREEN_HW, oh + sh);
				this.ctx.clip();
				this.ctx.drawImage(this.fgshield, o, oh, nw, nh);
				this.ctx.restore();

				// SPEED
				this.ctx.font = (SCREEN_WIDTH / this.speedFontRatio) + "px " + this.font;
				this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				this.ctx.fillText(speed, SCREEN_HW, SCREEN_HEIGHT - nh * 0.57);

				// SHIELD
				this.ctx.font = (SCREEN_WIDTH / this.shieldFontRatio) + "px " + this.font;
				this.ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
				this.ctx.fillText(shield, SCREEN_HW, SCREEN_HEIGHT - nh * 0.44);
			}
		}
		else if (this.step == 1) {
			this.ctx.clearRect(0, 0, SCREEN_WIDTH, oh);

			// TIME
			if (this.time != "") {
				this.ctx.font = (SCREEN_WIDTH / this.timeFontRatio) + "px " + this.font;
				this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				this.ctx.fillText(this.time, SCREEN_HW, SCREEN_WIDTH / this.timeMarginRatio);
			}

			// LAPS
			if (this.lap != "") {
				this.ctx.font = (SCREEN_WIDTH / this.timeFontRatio) + "px " + this.font;
				this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				this.ctx.fillText(this.lap, SCREEN_WIDTH - SCREEN_WIDTH / this.lapMarginRatio, SCREEN_WIDTH / this.timeMarginRatio);
			}

			// MESSAGE
			let my = SCREEN_HH - SCREEN_WIDTH / this.messageYRatio;

			if (this.messageTiming > this.messageDuration + 2000) {
				this.previousMessage = "";
				this.message = "";
				this.messageA = 0.0;
			}
			else if (this.messageTiming > this.messageDuration && this.message != "") {
				this.previousMessage = this.message;
				this.message = "";
				this.messagePos = 0.0;
				this.messagePosTarget = SCREEN_WIDTH / this.messagePosTargetRatio;
				this.messageA = this.messageFontAlpha;
			}

			if (this.previousMessage != "") {
				if (this.messageA < 0.001)
					this.messageA = 0.0;
				else
					this.messageA += (0.0 - this.messageA) * this.messageLerp;

				this.messagePos += (this.messagePosTarget - this.messagePos) * this.messageLerp;

				this.ctx.font = (SCREEN_WIDTH / this.messageFontRatioEnd) + "px " + this.font;
				this.ctx.fillStyle = "rgba(255, 255, 255, " + this.messageA + ")";
				this.ctx.fillText(this.previousMessage, SCREEN_HW, my + this.messagePos);
			}

			if (this.message != "") {
				if (this.messageTiming < this.messageDurationS) {
					this.messageAS += (this.messageFontAlpha - this.messageAS) * this.messageFontLerp;
					this.messageFontRatio += (this.messageFontRatioEnd - this.messageFontRatio) * this.messageFontLerp;
				}
				else {
					this.messageAS = this.messageFontAlpha;
					this.messageFontRatio = this.messageFontRatioEnd;
				}

				this.ctx.font = (SCREEN_WIDTH / this.messageFontRatio) + "px " + this.font;
				this.ctx.fillStyle = "rgba(255, 255, 255, " + this.messageAS + ")";
				this.ctx.fillText(this.message, SCREEN_HW, my);
			}
		}

		this.messageTiming++;

		this.step++;
		if (this.step == this.maxStep) this.step = 0;
	}

}
