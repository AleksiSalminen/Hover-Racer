import Engine from "./engine/Engine.js";

///////

function $(_) {
    return document.getElementById(_);
};

function _fn(setting, url) {
    let e, f, _ref;
    setting[3] = (_ref = url(setting[0])) != null ? _ref : a[2];
    e = $("s-" + setting[0]);
    (f = function () {
        return e.innerHTML = setting[4] + setting[1][setting[3]];
    })();
    return e.onclick = function () {
        return f(setting[3] = (setting[3] + 1) % setting[1].length);
    };
};

///////

let defaultControls, url, setting, settings;
url = Engine.getURLParameter();
defaultControls = Engine.getDefaultControls();
settings = [['controlType', ['KEYBOARD', 'TOUCH', 'LEAP MOTION CONTROLLER', 'GAMEPAD'], defaultControls, defaultControls, 'Controls: '], ['quality', ['LOW', 'MID', 'HIGH', 'VERY HIGH'], 3, 3, 'Quality: '], ['hud', ['OFF', 'ON'], 1, 1, 'HUD: '], ['godmode', ['OFF', 'ON'], 0, 1, 'Godmode: ']];
/*
for (let i = 0;i < settings.length;i++) {
    setting = settings[i];
    _fn(setting, url);
}
*/
///////

$('start').onclick = function () {
    $('step-1').style.display = 'none';
    $('step-2').style.display = 'block';
    return $('step-2').style.backgroundImage = "url(engine/css/help-" + settings[0][3] + ".png)";
};

$('step-2').onclick = function () {
    $('step-2').style.display = 'none';
    $('step-3').style.display = 'block';
    return Engine.start(settings[0][3], settings[1][3], settings[2][3], settings[3][3]);
};

$('step-5').onclick = function () {
    return window.location.reload();
};

$('s-credits').onclick = function () {
    $('step-1').style.display = 'none';
    return $('credits').style.display = 'block';
};

$('credits').onclick = function () {
    $('step-1').style.display = 'block';
    return $('credits').style.display = 'none';
};

///////
