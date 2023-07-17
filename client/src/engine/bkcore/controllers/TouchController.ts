

class Vec2 {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  subtract(vec: Vec2): Vec2 {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  copy(vec: Vec2): Vec2 {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }

  set(x: number, y: number): Vec2 {
    this.x = x;
    this.y = y;
    return this;
  }
}


export default class TouchController {

  // ATTRIBUTES

  dom: HTMLElement;
  stickMargin: number;
  buttonCallback: ((isActive: boolean, touch: Touch, event: TouchEvent) => void) | null;
  active: boolean;
  touches: TouchList | null;
  stickID: number;
  stickPos: Vec2;
  stickStartPos: Vec2;
  stickVector: Vec2;

  // CONSTRUCTORS

  constructor(dom: HTMLElement, stickMargin: number, buttonCallback: ((isActive: boolean, touch: Touch, event: TouchEvent) => void) | null) {
    this.dom = dom;
    this.stickMargin = stickMargin != null ? stickMargin : 200;
    this.buttonCallback = buttonCallback != null ? buttonCallback : null;
    this.active = true;
    this.touches = null;
    this.stickID = -1;
    this.stickPos = new Vec2(0, 0);
    this.stickStartPos = new Vec2(0, 0);
    this.stickVector = new Vec2(0, 0);
    this.dom.addEventListener('touchstart', ((e) => this.touchStart(e)), false);
    this.dom.addEventListener('touchmove', ((e) => this.touchMove(e)), false);
    this.dom.addEventListener('touchend', ((e) => this.touchEnd(e)), false);
  }

  // METHODS
  
  touchStart(event: TouchEvent): boolean {
    let touch: Touch;
    if (!this.active) {
      return false;
    }
    const changedTouches = event.changedTouches;
    for (let i = 0, len = changedTouches.length; i < len; i++) {
      touch = changedTouches[i];
      if (this.stickID < 0 && touch.clientX < this.stickMargin) {
        this.stickID = touch.identifier;
        this.stickStartPos.set(touch.clientX, touch.clientY);
        this.stickPos.copy(this.stickStartPos);
        this.stickVector.set(0, 0);
      } else {
        if (typeof this.buttonCallback === "function") {
          this.buttonCallback(true, touch, event);
        }
      }
    }
    this.touches = event.touches;
    return false;
  }

  touchMove(event: TouchEvent): boolean {
    let touch: Touch;
    event.preventDefault();
    if (!this.active) {
      return false;
    }
    const changedTouches = event.changedTouches;
    for (let i = 0, len = changedTouches.length; i < len; i++) {
      touch = changedTouches[i];
      if (this.stickID === touch.identifier && touch.clientX < this.stickMargin) {
        this.stickPos.set(touch.clientX, touch.clientY);
        this.stickVector.copy(this.stickPos).subtract(this.stickStartPos);
        break;
      }
    }
    this.touches = event.touches;
    return false;
  }

  touchEnd(event: TouchEvent): boolean {
    let touch: Touch;
    if (!this.active) {
      return false;
    }
    this.touches = event.touches;
    const changedTouches = event.changedTouches;
    for (let i = 0, len = changedTouches.length; i < len; i++) {
      touch = changedTouches[i];
      if (this.stickID === touch.identifier) {
        this.stickID = -1;
        this.stickVector.set(0, 0);
        break;
      } else {
        if (typeof this.buttonCallback === "function") {
          this.buttonCallback(false, touch, event);
        }
      }
    }
    return false;
  }

  isCompatible(): boolean {
    return 'ontouchstart' in document.documentElement;
  }
}
