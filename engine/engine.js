import BKcoreC from "./bkcore/BKcore.js";

const BKcore = new BKcoreC();

function $(_) {
    return document.getElementById(_);
};

function getURLParameter() {
    return BKcore.Utils.getURLParameter();
}

function getDefaultControls() {
    return BKcore.Utils.isTouchDevice() ? 1 : 0
}

function init(controlType, quality, hud, godmode) {
    BKcore.init($, document, quality, controlType, hud, godmode);
    let hexGL, progressbar;
    hexGL = BKcore.hexgl.HexGL;
    window.hexGL = hexGL;
    progressbar = $('progressbar');
    return hexGL.load({
        onLoad: function () {
            console.log('LOADED.');
            hexGL.init();
            $('step-3').style.display = 'none';
            $('step-4').style.display = 'block';
            return hexGL.start();
        },
        onError: function (s) {
            return console.error("Error loading " + s + ".");
        },
        onProgress: function (p, t, n) {
            console.log("LOADED " + t + " : " + n + " ( " + p.loaded + " / " + p.total + " ).");
            return progressbar.style.width = "" + (p.loaded / p.total * 100) + "%";
        }
    });
}

function hasWebGL() {
    let canvas, gl;
    gl = null;
    canvas = document.createElement('canvas');
    try {
        gl = canvas.getContext("webgl");
    } catch (_error) { }
    if (gl == null) {
        try {
            gl = canvas.getContext("experimental-webgl");
        } catch (_error) { }
    }
    return gl != null;
};

function start(controlType, quality, hud, godmode) {
    if (!hasWebGL()) {
        let getWebGL = $('start');
        getWebGL.innerHTML = 'WebGL is not supported!';
        getWebGL.onclick = function () {
            return window.location.href = 'http://get.webgl.org/';
        };
    }
    else {
        init(controlType, quality, hud, godmode);
    }
}


const Engine = {
    start, getURLParameter, getDefaultControls
};
export default Engine;
