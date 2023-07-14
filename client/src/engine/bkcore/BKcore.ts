import { Track, Ship, ControlType, Quality, HUD, Godmode, Difficulty } from "../config/Config.ts";
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

    init(document: Document, track: Track, ship: Ship, difficulty: Difficulty, quality: Quality, controlType: ControlType, hud: HUD, godmode: Godmode, gameEndCallback: Function, container: HTMLElement | null, overlay: HTMLElement | null) {
        const options = {
            document: document,
            width: window.innerWidth,
            height: window.innerHeight,
            container: container,
            overlay: overlay,
            track: track,
            ship: ship,
            quality: quality,
            difficulty: difficulty,
            hud: hud === "ON",
            controlType: controlType,
            godmode: godmode,
            gameEndCallback: gameEndCallback
        };

        const HexGL = new HexGLC(options);
        this.hexgl = { HexGL };
    }

}

