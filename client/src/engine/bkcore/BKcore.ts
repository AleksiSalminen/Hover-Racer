import { ControlType, Quality, HUD, Godmode, Difficulty } from "../config/Config.ts";
import Utils from "./utils/Utils.js";
import HexGLC from "./hexgl/HexGL.js";


export default class BKcoreC {

    // ATTRIBUTES

    Utils: typeof Utils;
	hexgl: { HexGL: HexGLC | null };

	// CONSTRUCTORS

	constructor() {
        this.Utils = Utils;
        this.hexgl = { HexGL: null }
    }

    init(document: Document, quality: Quality, controlType: ControlType, hud: HUD, godmode: Godmode, gameEndCallback: Function, container: HTMLElement | null, overlay: HTMLElement | null, track: string, difficulty: Difficulty) {
        const options = {
            document: document,
            width: window.innerWidth,
            height: window.innerHeight,
            container: container,
            overlay: overlay,
            quality: quality,
            difficulty: difficulty,
            hud: hud === 1,
            controlType: controlType,
            godmode: godmode,
            track: track,
            gameEndCallback: gameEndCallback
        };

        const HexGL = new HexGLC(options);
        this.hexgl = { HexGL };
    }

}

