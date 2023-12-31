import { Track, Ship, ControlType, Quality, HUD, Godmode, Difficulty } from "./config/Config.ts";
import BKcoreC from "./bkcore/BKcore.js";
import HexGLC from "./bkcore/hexgl/HexGL.js";

const BKcore = new BKcoreC();
let loaded = false;

// CORE FUNCTIONALITY

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

function start(track: Track, ship: Ship, difficulty: Difficulty, controlType: ControlType, quality: Quality, hud: HUD, godmode: Godmode, gameEndCallback: Function, container: HTMLElement | null, overlay: HTMLElement | null) {
    if (!hasWebGL()) {
        console.log("WebGL is not supported! Cannot launch the game!");
        alert("WebGL is not supported! Cannot launch the game!");
    }
    else {
        BKcore.init(document, track, ship, difficulty, quality, controlType, hud, godmode, gameEndCallback, container, overlay);
        let hexGL: HexGLC | null = BKcore.hexgl.HexGL;
        if (hexGL !== null) {
            return hexGL.load({
                onLoad: function () {
                    if (!loaded) {
                        loaded = true;
                        console.log('LOADED.');
                        if (hexGL !== null) {
                            hexGL.init();
                            return hexGL.start();
                        }
                        else {
                            return Error("HexGL is null!");
                        }
                    }
                },
                onError: function (error: Error) {
                    return console.error("Error loading " + error + ".");
                },
                onProgress: function (parts: { loaded: number, total: number }, type: string, name: string) {
                    console.log("LOADED " + type + " : " + name + " ( " + parts.loaded + " / " + parts.total + " ).");
                }
            });
        }
        else {
            return Error("HexGL is null!");
        }
    }
}

// GETTERS

function getConfig() { return { track: getTrackInfo(), ship: getShipInfo(), controls: getControlTypeInfo(), quality: getQualityInfo(), hud: getHUDInfo(), godmode: getGodmodeInfo(), difficulty: getDifficultyInfo() } }
function getTrackInfo() { return Track; }
function getShipInfo() { return Ship; }
function getControlTypeInfo() { return ControlType; }
function getQualityInfo() { return Quality; }
function getHUDInfo() { return HUD; }
function getGodmodeInfo() { return Godmode; }
function getDifficultyInfo() { return Difficulty; }
function getURLParameter() { return BKcore.Utils.getURLParameter(); }
function getDefaultControls() { return BKcore.Utils.isTouchDevice() ? 1 : 0; }

// EXPORTS

const Engine = {
    start, getURLParameter, getDefaultControls, getConfig, getTrackInfo, 
    getShipInfo, getControlTypeInfo, getQualityInfo, getHUDInfo,
    getGodmodeInfo, getDifficultyInfo
};
export default Engine;
