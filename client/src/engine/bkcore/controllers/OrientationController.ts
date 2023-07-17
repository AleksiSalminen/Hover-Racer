

export default class OrientationController {

  // ATTRIBUTES

  dom: HTMLElement;
  registerTouch: boolean;
  touchCallback: ((arg0: boolean, arg1: Touch, arg2: Event) => void) | null;
  active: boolean;
  alpha: number;
  beta: number;
  gamma: number;
  dalpha: number | null;
  dbeta: number | null;
  dgamma: number | null;
  touches: TouchList | null;

  // CONSTRUCTORS

  constructor(
    dom: HTMLElement,
    registerTouch?: boolean,
    touchCallback?: ((arg0: boolean, arg1: Touch, arg2: Event) => void) | null
  ) {
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
    window.addEventListener(
      'deviceorientation',
      (function (e) {
        return _this.orientationChange(e);
      }),
      false
    );
    if (this.registerTouch) {
      this.dom.addEventListener(
        'touchstart',
        (function (e) {
          return _this.touchStart(e);
        }),
        false
      );
      this.dom.addEventListener(
        'touchend',
        (function (e) {
          return _this.touchEnd(e);
        }),
        false
      );
    }
  }

  // METHODS

  orientationChange(event: DeviceOrientationEvent) {
    if (!this.active) {
      return;
    }
    if (this.dalpha === null) {
      console.log('calibrate', event.beta);
      this.dalpha = event.alpha;
      this.dbeta = event.beta;
      this.dgamma = event.gamma;
    }
    if (event.alpha === null || event.beta === null || event.gamma === null ||
      this.dalpha === null || this.dbeta === null || this.dgamma === null) {
      return;
    }
    this.alpha = event.alpha - this.dalpha;
    this.beta = event.beta - this.dbeta;
    this.gamma = event.gamma - this.dgamma;
    return false;
  }

  touchStart(event: TouchEvent) {
    let touch: Touch;
    if (!this.active) {
      return;
    }
    for (let i = 0, len = event.changedTouches.length; i < len; i++) {
      touch = event.changedTouches[i];
      if (typeof this.touchCallback === 'function') {
        this.touchCallback(true, touch, event);
      }
    }
    this.touches = event.touches;
    return false;
  }

  touchEnd(event: TouchEvent) {
    let touch: Touch;
    if (!this.active) {
      return;
    }
    for (let i = 0, len = event.changedTouches.length; i < len; i++) {
      touch = event.changedTouches[i];
      if (typeof this.touchCallback === 'function') {
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
