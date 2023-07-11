

export default class OrientationController {

  // ATTRIBUTES

  dom;
  registerTouch;
  touchCallback;
  active;
  alpha;
  beta;
  gamma;
  dalpha;
  dbeta;
  dgamma;
  touches;

  // CONSTRUCTORS

  constructor(dom, registerTouch, touchCallback) {
    let _this = this;
    this.dom = dom;
    this.registerTouch = registerTouch != null ? registerTouch : true;
    this.touchCallback = touchCallback != null ? touchCallback : null;
    this.active = true;
    this.alpha = 0.0;
    this.beta = 0.0;
    this.gamma = 0.0;
    this.dalpha = null;
    this.dbeta = null;
    this.dgamma = null;
    this.touches = null;
    window.addEventListener('deviceorientation', (function (e) {
      return _this.orientationChange(e);
    }), false);
    if (this.registerTouch) {
      this.dom.addEventListener('touchstart', (function (e) {
        return _this.touchStart(e);
      }), false);
      this.dom.addEventListener('touchend', (function (e) {
        return _this.touchEnd(e);
      }), false);
    }
  }

  // METHODS

  orientationChange(event) {
    if (!this.active) {
      return;
    }
    if (this.dalpha === null) {
      console.log("calbrate", event.beta);
      this.dalpha = event.alpha;
      this.dbeta = event.beta;
      this.dgamma = event.gamma;
    }
    this.alpha = event.alpha - this.dalpha;
    this.beta = event.beta - this.dbeta;
    this.gamma = event.gamma - this.dgamma;
    return false;
  }

  touchStart(event) {
    let touch, _i, _len, _ref;
    if (!this.active) {
      return;
    }
    _ref = event.changedTouches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      if (typeof this.touchCallback === "function") {
        this.touchCallback(true, touch, event);
      }
    }
    this.touches = event.touches;
    return false;
  }

  touchEnd(event) {
    let touch, _i, _len, _ref;
    if (!this.active) {
      return;
    }
    _ref = event.changedTouches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      if (typeof this.touchCallback === "function") {
        this.touchCallback(true, touch, event);
      }
    }
    this.touches = event.touches;
    return false;
  }

  isCompatible() {
    return 'DeviceOrientationEvent' in window;
  }

}

