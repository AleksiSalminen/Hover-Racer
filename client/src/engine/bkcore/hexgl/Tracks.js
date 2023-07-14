import THREE from "../../libs/Three.dev.js";
import LoaderC from "../threejs/Loader.js";
import Utils from "../utils/Utils.js";
import ShipControls from "./ShipControls.js";
import ShipEffects from "./ShipEffects.js";
import CameraChase from "./CameraChase.js";
import { Quality } from "../../config/Config.ts";


function load(track, ship, ui, opts, quality, audio) {
    track.lib = new LoaderC(opts);
    ship.lib = new LoaderC(opts);
    ui.lib = new LoaderC(opts);

    if (quality.name === Quality.LOWEST || quality.name === Quality.LOW) {
        track.lib.load(track.resources.low, audio);
        ship.lib.load(ship.resources.low, audio);
        ui.lib.load(ui.resources.low, audio);
    }
    else {
        track.lib.load(track.resources.high, audio);
        ship.lib.load(ship.resources.high, audio);
        ui.lib.load(ui.resources.high, audio);
    }
}

function buildMaterials(track, ship, ui, quality) {
    ui.materials = {};
    ship.materials = {};

    if (quality.name === Quality.LOWEST || quality.name === Quality.LOW) {
        track.materials.track = new THREE.MeshBasicMaterial({
            map: track.lib.get("textures", "track.diffuse"),
            ambient: 0xcccccc
        });

        ui.materials.bonusBase = new THREE.MeshBasicMaterial({
            map: ui.lib.get("textures", "bonus.base.diffuse"),
            ambient: 0xcccccc
        });

        ui.materials.bonusSpeed = new THREE.MeshBasicMaterial({
            color: 0x0096ff
        });

        ship.materials.ship = new THREE.MeshBasicMaterial({
            map: ship.lib.get("textures", "ship.feisar.diffuse"),
            ambient: 0xaaaaaa
        });

        ship.materials.booster = new THREE.MeshBasicMaterial({
            map: ship.lib.get("textures", "booster.diffuse"),
            transparent: true
        });

        track.materials.scrapers1 = new THREE.MeshBasicMaterial({
            map: track.lib.get("textures", "track.scrapers1.diffuse"),
            ambient: 0xcccccc
        });

        track.materials.scrapers2 = new THREE.MeshBasicMaterial({
            map: track.lib.get("textures", "track.scrapers2.diffuse"),
            ambient: 0xcccccc
        });

        track.materials.start = new THREE.MeshBasicMaterial({
            map: track.lib.get("textures", "track.start.diffuse"),
            ambient: 0xcccccc
        });

        track.materials.startBanner = new THREE.MeshBasicMaterial({
            map: track.lib.get("textures", "track.start.banner"),
            transparent: false
        });
    }
    else {
        track.materials.track = Utils.createNormalMaterial({
            diffuse: track.lib.get("textures", "track.diffuse"),
            specular: track.lib.get("textures", "track.specular"),
            normal: track.lib.get("textures", "track.normal"),
            ambient: 0xffffff,
            shininess: 42,
            metal: true,
            perPixel: true
        });

        ui.materials.bonusBase = Utils.createNormalMaterial({
            diffuse: ui.lib.get("textures", "bonus.base.diffuse"),
            specular: ui.lib.get("textures", "bonus.base.specular"),
            normal: ui.lib.get("textures", "bonus.base.normal"),
            normalScale: 3.0,
            ambient: 0x444444,
            shininess: 42,
            metal: false,
            perPixel: false
        });

        ui.materials.bonusSpeed = new THREE.MeshBasicMaterial({
            color: 0x0096ff
        });

        ship.materials.ship = Utils.createNormalMaterial({
            diffuse: ship.lib.get("textures", "ship.feisar.diffuse"),
            specular: ship.lib.get("textures", "ship.feisar.specular"),
            normal: ship.lib.get("textures", "ship.feisar.normal"),
            ambient: 0x444444,
            shininess: 42,
            metal: true,
            perPixel: false
        });

        ship.materials.booster = new THREE.MeshBasicMaterial({
            map: ship.lib.get("textures", "booster.diffuse"),
            transparent: true
        });

        track.materials.scrapers1 = Utils.createNormalMaterial({
            diffuse: track.lib.get("textures", "track.scrapers1.diffuse"),
            specular: track.lib.get("textures", "track.scrapers1.specular"),
            normal: track.lib.get("textures", "track.scrapers1.normal"),
            cube: track.lib.get("texturesCube", "skybox.dawnclouds"),
            reflectivity: 0.8,
            ambient: 0x444444,
            shininess: 42,
            metal: false,
            perPixel: false
        });

        track.materials.scrapers2 = Utils.createNormalMaterial({
            diffuse: track.lib.get("textures", "track.scrapers2.diffuse"),
            specular: track.lib.get("textures", "track.scrapers2.specular"),
            normal: track.lib.get("textures", "track.scrapers2.normal"),
            cube: track.lib.get("texturesCube", "skybox.dawnclouds"),
            reflectivity: 0.8,
            ambient: 0x000000,
            shininess: 42,
            metal: false,
            perPixel: false
        });

        track.materials.start = Utils.createNormalMaterial({
            diffuse: track.lib.get("textures", "track.start.diffuse"),
            specular: track.lib.get("textures", "track.start.specular"),
            normal: track.lib.get("textures", "track.start.normal"),
            ambient: 0xaaaaaa,
            shininess: 42,
            metal: false,
            perPixel: false
        });

        track.materials.startBanner = new THREE.MeshBasicMaterial({
            map: track.lib.get("textures", "track.start.banner"),
            transparent: false
        });
    }
}

function buildScenes(ctx, track, ship, ui, quality, audio) {
    // IMPORTANT
    track.analyser = track.lib.get("analysers", "track.collision");

    // SKYBOX
    let sceneCube = new THREE.Scene();

    let cameraCube = new THREE.PerspectiveCamera(70, ctx.width / ctx.height, 1, 6000);
    sceneCube.add(cameraCube);

    let skyshader = THREE.ShaderUtils.lib["cube"];
    skyshader.uniforms["tCube"].texture = track.lib.get("texturesCube", "skybox.dawnclouds");

    let skymaterial = new THREE.ShaderMaterial(
        {
            fragmentShader: skyshader.fragmentShader,
            vertexShader: skyshader.vertexShader,
            uniforms: skyshader.uniforms,
            depthWrite: false
        });

    let mesh = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), skymaterial);
    mesh.flipSided = true;

    sceneCube.add(mesh);

    ctx.manager.add("sky", sceneCube, cameraCube);

    let ambient = 0xbbbbbb, diffuse = 0xffffff, specular = 0xffffff, shininess = 42, scale = 23;

    // MAIN SCENE
    let camera = new THREE.PerspectiveCamera(70, ctx.width / ctx.height, 1, 60000);

    let scene = new THREE.Scene();
    scene.add(camera);
    scene.add(new THREE.AmbientLight(ambient));

    // SUN
    let sun = new THREE.DirectionalLight(diffuse, 1.5, 30000);
    sun.position.set(-4000, 1200, 1800);
    sun.lookAt(new THREE.Vector3());

    // Cast sun shadows if high quality
    if (quality.sun.castShadow) {
        sun.castShadow = quality.sun.castShadow;
        sun.shadowCameraNear = quality.sun.shadowCameraNear;
        sun.shadowCameraFar = eval(quality.sun.shadowCameraFar);
        sun.shadowCameraRight = quality.sun.shadowCameraRight;
        sun.shadowCameraLeft = -quality.sun.shadowCameraLeft;
        sun.shadowCameraTop = quality.sun.shadowCameraTop;
        sun.shadowCameraBottom = -quality.sun.shadowCameraBottom;
        //sun.shadowCameraVisible = quality.sun.shadowCameraVisible;
        sun.shadowBias = quality.sun.shadowBias;
        sun.shadowDarkness = quality.sun.shadowDarkness;
        sun.shadowMapWidth = quality.sun.shadowMapWidth;
        sun.shadowMapHeight = quality.sun.shadowMapHeight;
    }

    scene.add(sun);

    // SHIP
    let shipMesh = ctx.createMesh(scene, ship.lib.get("geometries", "ship.feisar"), -1134 * 2, 10, -443 * 2, ship.materials.ship);

    let booster = ctx.createMesh(shipMesh, ship.lib.get("geometries", "booster"), 0, 0.665, -3.8, ship.materials.booster);
    booster.depthWrite = false;

    let boosterSprite = new THREE.Sprite({
        map: ship.lib.get("textures", "booster.sprite"),
        blending: THREE.AdditiveBlending,
        useScreenCoordinates: false,
        color: 0xffffff
    });
    boosterSprite.scale.set(0.02, 0.02, 0.02);
    boosterSprite.mergeWith3D = false;
    booster.add(boosterSprite);

    let boosterLight = new THREE.PointLight(0x00a2ff, 4.0, 60);
    boosterLight.position.set(0, 0.665, -4);

    // Show booster light if not very low quality
    if (quality.showBoosterLight) {
        shipMesh.add(boosterLight);
    }

    // SHIP CONTROLS
    let shipControls = new ShipControls(ctx, audio);
    shipControls.collisionMap = track.lib.get("analysers", "track.collision");
    shipControls.collisionPixelRatio = 2048.0 / 6000.0;
    shipControls.collisionDetection = true;
    shipControls.heightMap = track.lib.get("analysers", "track.height");;
    shipControls.heightPixelRatio = 2048.0 / 6000.0;
    shipControls.heightBias = 4.0;
    shipControls.heightScale = 10.0;
    shipControls.control(shipMesh);
    ctx.components.shipControls = shipControls;
    ctx.tweakShipControls();

    // SHIP EFFECTS AND PARTICLES
    let fxParams = {
        scene: scene,
        shipControls: shipControls,
        booster: booster,
        boosterSprite: boosterSprite,
        boosterLight: boosterLight,
        useParticles: false
    };

    // Show particles if high enough quality
    if (quality.useParticles) {
        fxParams.textureCloud = track.lib.get("textures", "cloud");
        fxParams.textureSpark = track.lib.get("textures", "spark");
        fxParams.useParticles = true;
    }

    ctx.components.shipEffects = new ShipEffects(fxParams);

    // TRACK
    let trackMesh = ctx.createMesh(scene, track.lib.get("geometries", "track"), 0, -5, 0, track.materials.track);
    let bonusBase = ctx.createMesh(scene, ship.lib.get("geometries", "bonus.base"), 0, -5, 0, ship.materials.bonusBase);
    let bonusSpeed = ctx.createMesh(scene, track.lib.get("geometries", "track.bonus.speed"), 0, -5, 0, track.materials.bonusSpeed);
    bonusSpeed.receiveShadow = false;
    let scrapers1 = ctx.createMesh(scene, track.lib.get("geometries", "track.scrapers1"), 0, 0, 0, track.materials.scrapers1);
    let scrapers2 = ctx.createMesh(scene, track.lib.get("geometries", "track.scrapers2"), 0, 0, 0, track.materials.scrapers2);
    let start = ctx.createMesh(scene, track.lib.get("geometries", "track.start"), 0, -5, 0, track.materials.start);
    let startbanner = ctx.createMesh(scene, track.lib.get("geometries", "track.start.banner"), 0, -5, 0, track.materials.startBanner);
    startbanner.doubleSided = true;

    // CAMERA
    ctx.components.cameraChase = new CameraChase({
        target: ship,
        camera: camera,
        cameraCube: ctx.manager.get("sky").camera,
        lerp: 0.5,
        yoffset: 8.0,
        zoffset: 10.0,
        viewOffset: 10.0
    });

    ctx.manager.add("game", scene, camera, function (delta, renderer) {
        if (delta > 25 && this.objects.lowFPS < 1000) this.objects.lowFPS++;

        let dt = delta / 16.6;

        this.objects.components.shipControls.update(dt);

        this.objects.components.shipEffects.update(dt);

        this.objects.components.cameraChase.update(dt, this.objects.components.shipControls.getSpeedRatio());
        /*this.objects.time += 0.002;
        let c = this.objects.components.cameraChase.camera;
        c.position.set(
            Math.cos(this.objects.time)*15+this.objects.components.shipControls.dummy.position.x,
            10+this.objects.components.shipControls.dummy.position.y,
            Math.sin(this.objects.time)*15+this.objects.components.shipControls.dummy.position.z
        );
        c.lookAt(this.objects.components.shipControls.dummy.position);
        this.objects.components.cameraChase.cameraCube.rotation.copy(c.rotation);*/

        this.objects.composers.game.render(dt);
        if (this.objects.hud) this.objects.hud.update(
            this.objects.components.shipControls.getRealSpeed(100),
            this.objects.components.shipControls.getRealSpeedRatio(),
            this.objects.components.shipControls.getShield(100),
            this.objects.components.shipControls.getShieldRatio()
        );
        if (this.objects.components.shipControls.getShieldRatio() < 0.2)
            this.objects.extras.vignetteColor.setHex(0x992020);
        else
            this.objects.extras.vignetteColor.setHex(0x458ab1);
    },
    {
        components: ctx.components,
        composers: ctx.composers,
        extras: ctx.extras,
        quality: quality,
        hud: ctx.hud,
        time: 0.0,
        lowFPS: 0
    });
}


export {
    load, buildMaterials, buildScenes
};
