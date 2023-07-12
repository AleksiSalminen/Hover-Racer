import Utils from "../utils/Utils.js";
import Timer from "../utils/Timer.js";


export default class Ladder {

	// ATTRIBUTES

	global;

	// CONSTRUCTORS

	constructor() {
		this.global = {};
	}

	// METHODS

	load = function (callback) {
		let s = encodeURIComponent(window.location.href);
		Utils.request("nothing", false, function (req) {
			try {
				this.global = JSON.parse(req.responseText);
				if (callback) callback.call(window);
			}
			catch (e) {
				console.warn('Unable to load ladder. ' + e);
			}
		},
		{
			u: s
		});
	}

	displayLadder = function (id, track, mode, num) {
		let d = document.getElementById(id);
		if (d == undefined || this.global[track] == undefined || !this.global[track][mode] == undefined) {
			console.warn('Undefined ladder.');
			return;
		}
	
		let l = this.global[track][mode];
		let h = '';
		let m = Math.min((num == undefined ? 10 : num), l.length - 1);
		let timer = new Timer();
		for (let i = 0; i < l.length - 1; i++) {
			let t = timer.msToTime(l[i]['score']);
			h += '<span class="ladder-row"><b>' + (i + 1) + '. ' + l[i]['name'] + '</b><i>' + t.m + '\'' + t.s + '\'\'' + t.ms + '</i></span>';
		}
	
		d.innerHTML = h;
	}

}

