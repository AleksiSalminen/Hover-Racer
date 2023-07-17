import THREE from "../../libs/Three.dev.js";

export default class ShipControls {
  // ATTRIBUTES
  active: boolean;
  destroyed: boolean;
  falling: boolean;
  dom: any;
  mesh: any;
  epsilon: number;
  zero: THREE.Vector3;
  airResist: number;
  airDrift: number;
  thrust: number;
  airBrake: number;
  maxSpeed: number;
  boosterSpeed: number;
  boosterDecay: number;
  angularSpeed: number;
  airAngularSpeed: number;
  repulsionRatio: number;
  repulsionCap: number;
  repulsionLerp: number;
  collisionSpeedDecrease: number;
  collisionSpeedDecreaseCoef: number;
  maxShield: number;
  shieldDelay: number;
  shieldTiming: number;
  shieldDamage: number;
  driftLerp: number;
  angularLerp: number;
  movement: THREE.Vector3;
  rotation: THREE.Vector3;
  roll: number;
  rollAxis: THREE.Vector3;
  drift: number;
  speed: number;
  speedRatio: number;
  boost: number;
  shield: number;
  angular: number;
  currentVelocity: THREE.Vector3;
  quaternion: THREE.Quaternion;
  dummy: THREE.Object3D;
  collisionMap: any;
  collisionPixelRatio: number;
  collisionDetection: boolean;
  collisionPreviousPosition: THREE.Vector3;
  heightMap: any;
  heightPixelRatio: number;
  heightBias: number;
  heightLerp: number;
  heightScale: number;
  rollAngle: number;
  rollLerp: number;
  rollDirection: THREE.Vector3;
  gradient: number;
  gradientTarget: number;
  gradientLerp: number;
  gradientScale: number;
  gradientVector: THREE.Vector3;
  gradientAxis: THREE.Vector3;
  tilt: number;
  tiltTarget: number;
  tiltLerp: number;
  tiltScale: number;
  tiltVector: THREE.Vector3;
  tiltAxis: THREE.Vector3;
  repulsionVLeft: THREE.Vector3;
  repulsionVRight: THREE.Vector3;
  repulsionVFront: THREE.Vector3;
  repulsionVScale: number;
  repulsionAmount: number;
  repulsionForce: THREE.Vector3;
  fallVector: THREE.Vector3;
  resetPos: any;
  resetRot: any;
  key: any;
  collision: any;
  touchController: any;
  orientationController: any;
  gamepadController: any;
  leapBridge: any;
  leapInfo: any;
  leapController: any;
  audio: any;

  // CONSTRUCTORS
  constructor(ctx: any, audio: any) {
    let self = this;
    let domElement = ctx.document;

    this.active = true;
    this.destroyed = false;
    this.falling = false;

    this.dom = domElement;
    this.mesh = null;

    this.epsilon = 0.00000001;
    this.zero = new THREE.Vector3(0, 0, 0);
    this.airResist = 0.02;
    this.airDrift = 0.1;
    this.thrust = 0.02;
    this.airBrake = 0.02;
    this.maxSpeed = 7.0;
    this.boosterSpeed = this.maxSpeed * 0.2;
    this.boosterDecay = 0.01;
    this.angularSpeed = 0.005;
    this.airAngularSpeed = 0.0065;
    this.repulsionRatio = 0.5;
    this.repulsionCap = 2.5;
    this.repulsionLerp = 0.1;
    this.collisionSpeedDecrease = 0.8;
    this.collisionSpeedDecreaseCoef = 0.8;
    this.maxShield = 1.0;
    this.shieldDelay = 60;
    this.shieldTiming = 0;
    this.shieldDamage = 0.25;
    this.driftLerp = 0.35;
    this.angularLerp = 0.35;

    this.movement = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);
    this.roll = 0.0;
    this.rollAxis = new THREE.Vector3();
    this.drift = 0.0;
    this.speed = 0.0;
    this.speedRatio = 0.0;
    this.boost = 0.0;
    this.shield = 1.0;
    this.angular = 0.0;

    this.currentVelocity = new THREE.Vector3();

    this.quaternion = new THREE.Quaternion();

    this.dummy = new THREE.Object3D();
    this.dummy.useQuaternion = true;

    this.collisionMap = null;
    this.collisionPixelRatio = 1.0;
    this.collisionDetection = false;
    this.collisionPreviousPosition = new THREE.Vector3();

    this.heightMap = null;
    this.heightPixelRatio = 1.0;
    this.heightBias = 0.0;
    this.heightLerp = 0.4;
    this.heightScale = 1.0;

    this.rollAngle = 0.6;
    this.rollLerp = 0.08;
    this.rollDirection = new THREE.Vector3(0, 0, 1);

    this.gradient = 0.0;
    this.gradientTarget = 0.0;
    this.gradientLerp = 0.05;
    this.gradientScale = 4.0;
    this.gradientVector = new THREE.Vector3(0, 0, 5);
    this.gradientAxis = new THREE.Vector3(1, 0, 0);

    this.tilt = 0.0;
    this.tiltTarget = 0.0;
    this.tiltLerp = 0.05;
    this.tiltScale = 4.0;
    this.tiltVector = new THREE.Vector3(5, 0, 0);
    this.tiltAxis = new THREE.Vector3(0, 0, 1);

    this.repulsionVLeft = new THREE.Vector3(1, 0, 0);
    this.repulsionVRight = new THREE.Vector3(-1, 0, 0);
    this.repulsionVFront = new THREE.Vector3(0, 0, 1);
    this.repulsionVScale = 4.0;
    this.repulsionAmount = 0.0;
    this.repulsionForce = new THREE.Vector3();

    this.fallVector = new THREE.Vector3(0, -20, 0);

    this.resetPos = null;
    this.resetRot = null;

    this.key = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      boost: false,
      shield: false,
      reset: false,
    };

    this.collision = {
      collision: false,
      collisionScale: 1.0,
      collisionRadius: 0.0,
      collisionVector: new THREE.Vector3(),
      collisionVectorNorm: new THREE.Vector3(),
      collisionType: 0,
    };

    this.touchController = null;
    this.orientationController = null;
    this.gamepadController = null;

    this.leapBridge = null;
    this.leapInfo = null;
    this.leapController = null;

    this.audio = audio;

    function bind(scope: any, fn: any) {
      return function () {
        fn.apply(scope, arguments);
      };
    }

    function keyDown(event: any) {
      if (event.altKey) return;
      switch (event.keyCode) {
        case 38: /*up*/
        case 87: /*W*/
          self.key.forward = true;
          break;

        case 37: /*left*/
        case 65: /*A*/
          self.key.left = true;
          break;

        case 40: /*down*/
        case 83: /*S*/
          self.key.backward = true;
          break;

        case 39: /*right*/
        case 68: /*D*/
          self.key.right = true;
          break;

        case 16: /*shift*/
          self.key.boost = true;
          break;

        case 32: /*space*/
          self.key.shield = true;
          break;

        case 82: /*R*/
          self.key.reset = true;
          break;
      }
    }

    function keyUp(event: any) {
      if (event.altKey) return;
      switch (event.keyCode) {
        case 38: /*up*/
        case 87: /*W*/
          self.key.forward = false;
          break;

        case 37: /*left*/
        case 65: /*A*/
          self.key.left = false;
          break;

        case 40: /*down*/
        case 83: /*S*/
          self.key.backward = false;
          break;

        case 39: /*right*/
        case 68: /*D*/
          self.key.right = false;
          break;

        case 16: /*shift*/
          self.key.boost = false;
          break;

        case 32: /*space*/
          self.key.shield = false;
          break;

        case 82: /*R*/
          self.key.reset = false;
          break;
      }
    }

    this.dom.addEventListener("keydown", bind(this, keyDown), false);
    this.dom.addEventListener("keyup", bind(this, keyUp), false);
  }

  // METHODS
  setCollisionMap(map: any) {
    this.collisionMap = map;
  }

  setHeightMap(map: any) {
    this.heightMap = map;
  }

  toggleCollisionDetection(enabled: boolean) {
    this.collisionDetection = enabled;
  }

  toggleTouchController(controller: any) {
    this.touchController = controller;
  }

  toggleOrientationController(controller: any) {
    this.orientationController = controller;
  }

  toggleGamepadController(controller: any) {
    this.gamepadController = controller;
  }

  toggleLeapMotion(bridge: any, info: any, controller: any) {
    this.leapBridge = bridge;
    this.leapInfo = info;
    this.leapController = controller;
  }

  reset() {
    this.mesh.position.set(this.resetPos.x, this.resetPos.y, this.resetPos.z);
    this.mesh.rotation.set(this.resetRot.x, this.resetRot.y, this.resetRot.z);

    this.movement.set(0, 0, 0);
    this.rotation.set(0, 0, 0);
    this.roll = 0.0;
    this.drift = 0.0;
    this.speed = 0.0;
    this.speedRatio = 0.0;
    this.boost = 0.0;
    this.shield = 1.0;
    this.angular = 0.0;
    this.currentVelocity.set(0, 0, 0);
  }

  update(dt: number) {
    if (!this.active || this.destroyed) return;

    let acc = new THREE.Vector3();

    let pos = new THREE.Vector3();
    let quat = new THREE.Quaternion();

    let velocity = new THREE.Vector3();
    let localVelocity = new THREE.Vector3();
    let worldVelocity = new THREE.Vector3();
    let direction = new THREE.Vector3();

    let axis = new THREE.Vector3();
    let rollAxis = new THREE.Vector3();
    let repulsionForce = new THREE.Vector3();
    let forward = new THREE.Vector3();
    let repulsion = new THREE.Vector3();

    let speed = this.speed;
    let currentVelocity = this.currentVelocity;

    if (this.collisionDetection) {
      let p = this.mesh.position;
      let px = p.x;
      let py = p.y;
      let pz = p.z;

      let hpx = px * this.heightPixelRatio;
      let hpz = pz * this.heightPixelRatio;

      let hx = Math.round(hpx);
      let hz = Math.round(hpz);

      let cpx = px * this.collisionPixelRatio;
      let cpz = pz * this.collisionPixelRatio;

      let cx = Math.round(cpx);
      let cz = Math.round(cpz);

      let ch = this.heightMap[(hz * this.heightMap.width + hx) * 4 + 0];
      let hs = this.heightScale;
      let hb = this.heightBias;
      let chy = (ch * hs) + hb;

      let height = py - chy;
      let threshold = 0.5;

      if (height < threshold) {
        let f = height / threshold;
        f = Math.pow(f, 0.5);
        f = f < 0 ? 0 : f;
        f = f > 1 ? 1 : f;

        let fall = this.fallVector.clone();
        fall.multiplyScalar(f);

        velocity.add(fall);
        currentVelocity.add(fall);

        this.falling = true;
      } else {
        this.falling = false;
      }

      let collision = this.collision;
      collision.collision = false;

      if (this.collisionMap) {
        if (cx >= 0 && cz >= 0 && cx < this.collisionMap.width && cz < this.collisionMap.height) {
          let collisionData = this.collisionMap[(cz * this.collisionMap.width + cx) * 4 + 0];
          collision.collision = collisionData > 0;
          collision.collisionType = collisionData;
          collision.collisionVector.copy(collisionData);

          if (collision.collision) {
            let cv = collision.collisionVector;
            let cd = collision.collisionVectorNorm;
            let cr = collision.collisionRadius;
            let cs = collision.collisionScale;

            let l = cv.length();
            let s = 1.0 / cs;

            if (l > cr) {
              let ratio = cr / l;
              cv.multiplyScalar(ratio);
            }

            cd.copy(cv).normalize();
            cv.multiplyScalar(s);

            let rd = new THREE.Vector3();
            rd.copy(cd).multiplyScalar(0.1);

            velocity.add(rd);
            currentVelocity.add(rd);

            speed *= this.collisionSpeedDecrease;
            this.boost *= this.collisionSpeedDecrease;
            this.shield -= this.shieldDamage;

            if (this.shield < 0.0) {
              this.destroyed = true;
            }
          }
        }
      }
    }

    let key = this.key;

    let airResist = this.airResist;
    let airDrift = this.airDrift;
    let thrust = this.thrust;
    let airBrake = this.airBrake;
    let maxSpeed = this.maxSpeed;
    let boosterSpeed = this.boosterSpeed;
    let boosterDecay = this.boosterDecay;
    let angularSpeed = this.angularSpeed;
    let airAngularSpeed = this.airAngularSpeed;
    let repulsionRatio = this.repulsionRatio;
    let repulsionCap = this.repulsionCap;
    let repulsionLerp = this.repulsionLerp;
    let driftLerp = this.driftLerp;
    let angularLerp = this.angularLerp;

    let rollAngle = this.rollAngle;
    let rollLerp = this.rollLerp;
    let rollDirection = this.rollDirection;

    let gradientTarget = this.gradientTarget;
    let gradientLerp = this.gradientLerp;
    let gradientScale = this.gradientScale;
    let gradientVector = this.gradientVector;
    let gradientAxis = this.gradientAxis;

    let tiltTarget = this.tiltTarget;
    let tiltLerp = this.tiltLerp;
    let tiltScale = this.tiltScale;
    let tiltVector = this.tiltVector;
    let tiltAxis = this.tiltAxis;

    let repulsionVLeft = this.repulsionVLeft;
    let repulsionVRight = this.repulsionVRight;
    let repulsionVFront = this.repulsionVFront;
    let repulsionVScale = this.repulsionVScale;
    let repulsionAmount = this.repulsionAmount;
    let repulsionForce = this.repulsionForce;

    let fallVector = this.fallVector;

    let moveDrift = false;
    let moveBoost = false;
    let moveShield = false;

    if (this.touchController) {
      if (this.touchController.drift) moveDrift = true;
      if (this.touchController.boost) moveBoost = true;
      if (this.touchController.shield) moveShield = true;
    }

    if (this.orientationController) {
      let o = this.orientationController;
      let oqv = o.quaternion;
      let oq = this.dummy.quaternion;

      let qy = new THREE.Quaternion();
      let qx = new THREE.Quaternion();
      let qz = new THREE.Quaternion();

      qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -o.drift * driftLerp);
      qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -o.boost * driftLerp);
      qz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -o.shield * driftLerp);

      oq.multiply(qy);
      oq.multiply(qx);
      oq.multiply(qz);

      moveDrift = o.drift;
      moveBoost = o.boost;
      moveShield = o.shield;
    }

    if (this.gamepadController) {
      let g = this.gamepadController;

      let x = g.leftJoystickX;
      let y = g.leftJoystickY;
      let z = g.rightJoystickX;

      let d = g.dPad;

      moveDrift = y < -0.5 || d === "up";
      moveBoost = x > 0.5 || d === "right";
      moveShield = z > 0.5 || d === "left";
    }

    if (this.leapBridge && this.leapController) {
      let bridge = this.leapBridge;
      let info = this.leapInfo;

      let d = bridge.getDirection(info);
      let dX = d.x;
      let dZ = d.z;

      moveDrift = dX < -0.5;
      moveBoost = dZ > 0.5;
    }

    let useDrift = key.left || key.right || moveDrift;
    let useBoost = key.boost || moveBoost;
    let useShield = key.shield || moveShield;

    if (this.falling) {
      let fs = this.fallVector;
      let fr = fs.length() * 0.5;

      let factor = 1.0 / (fr + 1.0);
      let factor2 = 1.0 - factor;

      acc.add(fs.clone().multiplyScalar(factor).add(fs.clone().normalize().multiplyScalar(factor2)));
    } else {
      if (key.forward) acc.z -= thrust;
      if (key.backward) acc.z += thrust;
      if (key.left) acc.x -= thrust;
      if (key.right) acc.x += thrust;

      if (moveDrift) acc.z += airDrift;

      let l = acc.length();
      if (l > 0.0) acc.normalize();

      let h = Math.abs(l) < this.epsilon ? 0.0 : l > 0.0 ? 1.0 : -1.0;

      if (h !== 0.0) {
        let d = Math.max(0.0, Math.min(1.0, l));
        let r = (h === 1.0 ? driftLerp : angularLerp) * d * (useDrift ? 1.0 : airAngularSpeed);
        let s = Math.max(0.0, Math.min(1.0, Math.abs(l / (h === 1.0 ? driftLerp : angularLerp))));

        if (useDrift && !this.falling) {
          let qy = new THREE.Quaternion();
          let qx = new THREE.Quaternion();
          let qz = new THREE.Quaternion();

          qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -acc.x * r);
          qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -acc.z * r);
          qz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -acc.y * r);

          let tq = new THREE.Quaternion();
          tq.multiply(qy);
          tq.multiply(qx);
          tq.multiply(qz);

          this.quaternion.multiply(tq);
        } else {
          let qy = new THREE.Quaternion();
          let qx = new THREE.Quaternion();
          let qz = new THREE.Quaternion();

          qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -acc.x * r);
          qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -acc.z * r);
          qz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -acc.y * r);

          let tq = new THREE.Quaternion();
          tq.multiply(qy);
          tq.multiply(qx);
          tq.multiply(qz);

          this.quaternion.multiply(tq);
        }

        if (useDrift && !this.falling) {
          acc.multiplyScalar(s);
        }

        if (!this.falling) {
          let ra = useDrift ? rollAngle * r : 0.0;
          this.roll += (h === 1.0 ? rollLerp : angularLerp) * (ra - this.roll);
        }
      }

      let u = this.quaternion.clone();
      let up = new THREE.Vector3(0, 1, 0);
      up.applyQuaternion(u);

      let qy = new THREE.Quaternion();
      let qx = new THREE.Quaternion();
      let qz = new THREE.Quaternion();

      let dr = useDrift ? driftLerp : angularLerp;

      qy.setFromAxisAngle(up, -acc.x * dr);
      qx.setFromAxisAngle(right, -acc.z * dr);
      qz.setFromAxisAngle(forward, -acc.y * dr);

      let tq = new THREE.Quaternion();
      tq.multiply(qy);
      tq.multiply(qx);
      tq.multiply(qz);

      this.quaternion.multiply(tq);
    }

    let f = this.quaternion.clone().multiply(new THREE.Vector3(0, 0, -1));

    let axis = f.clone().normalize();
    let angle = Math.atan2(axis.x, axis.y);

    let direction = f.clone();

    let currentVelocity = currentVelocity.clone();
    let currentSpeed = currentVelocity.length();

    let boost = useBoost ? 1.0 : 0.0;

    let decay = currentSpeed > maxSpeed ? boosterDecay : 1.0;

    let speed = currentSpeed - (decay * (currentSpeed - maxSpeed));

    let ratio = speed / maxSpeed;
    let s = boost > 0.0 ? boosterSpeed : maxSpeed;

    let cs = currentSpeed > maxSpeed ? maxSpeed : currentSpeed;

    let thrust = currentVelocity.clone().multiplyScalar(-s);

    let l = currentVelocity.length();

    if (l > 0.0) {
      let s = 1.0 / (l * airResist);
      let f = currentVelocity.clone().multiplyScalar(-s);
      let d = Math.max(0.0, Math.min(1.0, l / airResist));
      let r = (useDrift ? driftLerp : angularLerp) * d;

      let tq = new THREE.Quaternion();
      tq.setFromAxisAngle(axis, r);

      this.quaternion.multiply(tq);

      let qy = new THREE.Quaternion();
      let qx = new THREE.Quaternion();
      let qz = new THREE.Quaternion();

      let dr = useDrift ? driftLerp : angularLerp;

      qy.setFromAxisAngle(up, -acc.x * dr);
      qx.setFromAxisAngle(right, -acc.z * dr);
      qz.setFromAxisAngle(forward, -acc.y * dr);

      let tq = new THREE.Quaternion();
      tq.multiply(qy);
      tq.multiply(qx);
      tq.multiply(qz);

      this.quaternion.multiply(tq);
    }

    let repulsion = this.repulsionForce.clone();

    let force = new THREE.Vector3();

    let hit = false;

    if (key.left) {
      hit = true;
      force.add(repulsionVLeft.clone().multiplyScalar(repulsionAmount));
    }

    if (key.right) {
      hit = true;
      force.add(repulsionVRight.clone().multiplyScalar(repulsionAmount));
    }

    if (key.forward) {
      hit = true;
      force.add(repulsionVFront.clone().multiplyScalar(repulsionAmount));
    }

    if (hit) {
      let repulsion = force.clone().multiplyScalar(repulsionLerp);

      let tq = new THREE.Quaternion();
      tq.setFromAxisAngle(repulsion.normalize(), repulsion.length());

      this.quaternion.multiply(tq);
    }

    let rollAxis = rollDirection.clone().applyQuaternion(this.quaternion);

    let roll = this.roll * Math.PI * 0.5;
    let rollQuaternion = new THREE.Quaternion();
    rollQuaternion.setFromAxisAngle(rollAxis, roll);

    this.quaternion.multiply(rollQuaternion);

    let quaternion = this.quaternion;
    let movement = this.movement;

    let dummy = this.dummy;

    dummy.position.copy(this.mesh.position);
    dummy.quaternion.copy(quaternion);

    dummy.translateZ(speed * dt);

    this.currentVelocity.set(dummy.position.x - this.mesh.position.x, dummy.position.y - this.mesh.position.y, dummy.position.z - this.mesh.position.z);

    this.mesh.position.copy(dummy.position);
    this.mesh.rotation.copy(dummy.rotation);

    this.speed = speed;
  }

  destroy() {
    this.active = false;

    this.dom.removeEventListener("keydown", this.keyDown);
    this.dom.removeEventListener("keyup", this.keyUp);

    this.mesh = null;

    this.dummy = null;
    this.quaternion = null;

    this.collisionMap = null;

    this.heightMap = null;

    this.touchController = null;
    this.orientationController = null;
    this.gamepadController = null;

    this.leapBridge = null;
    this.leapInfo = null;
    this.leapController = null;

    this.audio = null;
  }
}
