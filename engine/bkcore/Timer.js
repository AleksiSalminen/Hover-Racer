/*
 new Date().getTime() wrapper to use as timer.

 @class bkcore.Timer
 @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
*/


export default class Timer {

  // ATTRIBUTES

  time;
  active;

  // CONSTRUCTORS

  constructor() {
    this.time = {
      start: 0,
      current: 0,
      previous: 0,
      elapsed: 0,
      delta: 0
    };
    this.active = false;
  }

  // METHODS

  start = function () {
    let now;
    now = (new Date).getTime();
    this.time.start = now;
    this.time.current = now;
    this.time.previous = now;
    this.time.elapsed = 0;
    this.time.delta = 0;
    return this.active = true;
  }

  pause = function (doPause) {
    return this.active = !doPause;
  }

  update = function () {
    let now;
    if (!this.active) {
      return;
    }
    now = (new Date).getTime();
    this.time.current = now;
    this.time.elapsed = this.time.current - this.time.start;
    this.time.delta = now - this.time.previous;
    return this.time.previous = now;
  }

  getElapsedTime = function () {
    return this.msToTime(this.time.elapsed);
  }

  msToTime = function (t) {
    let h, m, ms, s;
    ms = t % 1000;
    s = Math.floor((t / 1000) % 60);
    m = Math.floor((t / 60000) % 60);
    h = Math.floor(t / 3600000);
    return {
      h: h,
      m: m,
      s: s,
      ms: ms,
      ms: ms
    };
  }

  msToTimeString = function (t) {
    let time;
    time = this.msToTime(t);
    time.h = this.zfill(time.h, 2);
    time.m = this.zfill(time.m, 2);
    time.s = this.zfill(time.s, 2);
    time.ms = this.zfill(time.ms, 4);
    return time;
  }

  zfill = function (num, size) {
    let len;
    len = size - num.toString().length;
    if (len > 0) {
      return new Array(len + 1).join('0') + num;
    } else {
      return num.toString();
    }
  }

}

