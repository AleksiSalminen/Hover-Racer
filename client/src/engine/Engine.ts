import { ControlType, Quality, HUD, Godmode } from "./config/Config.ts";
import BKcoreC from "./bkcore/BKcore.js";
import HexGLC from "./bkcore/hexgl/HexGL.js";

const BKcore = new BKcoreC();

// CORE FUNCTIONALITY

function init(controlType: ControlType, quality: Quality, hud: HUD, godmode: Godmode, gameEndCallback: Function) {
    BKcore.init($, document, quality, controlType, hud, godmode, gameEndCallback);
    let hexGL: HexGLC = BKcore.hexgl.HexGL;
    return hexGL.load({
        onLoad: function () {
            console.log('LOADED.');
            hexGL.init();
            return hexGL.start();
        },
        onError: function (error: Error) {
            return console.error("Error loading " + error + ".");
        },
        onProgress: function (parts: { loaded: number, total: number}, type: string, name: string) {
            console.log("LOADED " + type + " : " + name + " ( " + parts.loaded + " / " + parts.total + " ).");
        }
    });
}

function hasWebGL() {
    let canvas: HTMLCanvasElement;
    let gl: WebGLRenderingContext | RenderingContext | null = null;
    canvas = document.createElement('canvas');
    try {
        gl = canvas.getContext("webgl");
    } catch (error) { }
    if (gl === null) {
        try {
            gl = canvas.getContext("experimental-webgl");
        } catch (error) { }
    }
    return gl !== null;
};

function start(controlType: ControlType, quality: Quality, hud: HUD, godmode: Godmode, gameEndCallback: Function) {
    if (!hasWebGL()) {
        console.log("WebGL is not supported! Cannot launch the game!");
        alert("WebGL is not supported! Cannot launch the game!");
    }
    else {
        init(controlType, quality, hud, godmode, gameEndCallback);
    }
}

// GETTERS

function $(_: string) { return document.getElementById(_); };
function getURLParameter() { return BKcore.Utils.getURLParameter(); }
function getDefaultControls() { return BKcore.Utils.isTouchDevice() ? 1 : 0; }
function getControlTypeInfo() { return ControlType; }
function getQualityInfo() { return Quality; }
function getHUDInfo() { return HUD; }
function getGodmodeInfo() { return Godmode; }

// EXPORTS

const Engine = {
    start, getURLParameter, getDefaultControls, getControlTypeInfo,
    getQualityInfo, getHUDInfo, getGodmodeInfo
};
export default Engine;
