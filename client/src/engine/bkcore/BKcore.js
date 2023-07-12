import Utils from "./utils/Utils.js";
import HexGLC from "./hexgl/HexGL.js";


export default class BKcoreC {

    // ATTRIBUTES

    Utils;
	hexgl;

	// CONSTRUCTORS

	constructor() {
        this.Utils = Utils;
    }

    init($, document, quality, controlType, hud, godmode) {
        const options = {
            document: document,
            width: window.innerWidth,
            height: window.innerHeight,
            container: $('main'),
            overlay: $('overlay'),
            gameover: $('step-5'),
            quality: quality,
            difficulty: 0,
            hud: hud === 1,
            controlType: controlType,
            godmode: godmode,
            track: 'Cityscape'
        };

        const HexGL = new HexGLC(options);
        this.hexgl = { HexGL };
    }

}

