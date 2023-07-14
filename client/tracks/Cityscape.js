
const Cityscape = {
    lib: null,
    materials: {},
    name: "Cityscape",
    checkpoints: {
        list: [
            0,
            1,
            2
        ],
        start: 0,
        last: 2
    },
    spawn: {
        x: -1134 * 2,
        y: 387,
        z: -443 * 2
    },
    spawnRotation: {
        x: 0,
        y: 0,
        z: 0
    },
    analyser: null,
    pixelRatio: 2048.0 / 6000.0,
    resources: {
        high: {
            textures: {
                'hex': "../textures.full/hud/hex.jpg",
                'spark': "../textures.full/particles/spark.png",
                'cloud': "../textures.full/particles/cloud.png",
                'ship.feisar.diffuse': "../textures.full/ships/feisar/diffuse.jpg",
                'booster.diffuse': "../textures.full/ships/feisar/booster/booster.png",
                'booster.sprite': "../textures.full/ships/feisar/booster/boostersprite.jpg",
                'track.diffuse': "../textures.full/tracks/cityscape/diffuse.jpg",
                'track.scrapers1.diffuse': "../textures.full/tracks/cityscape/scrapers1/diffuse.jpg",
                'track.scrapers2.diffuse': "../textures.full/tracks/cityscape/scrapers2/diffuse.jpg",
                'track.start.diffuse': "../textures.full/tracks/cityscape/start/diffuse.jpg",
                'track.start.banner': "../textures.full/tracks/cityscape/start/start.jpg",
                'bonus.base.diffuse': "../textures.full/bonus/base/diffuse.jpg"
            },
            texturesCube: {
                'skybox.dawnclouds': "../textures.full/skybox/dawnclouds/%1.jpg"
            },
            geometries: {
                'bonus.base': "../geometries/bonus/base/base.json",
                'booster': "../geometries/booster/booster.json",
                'ship.feisar': "../geometries/ships/feisar/feisar.json",
                'track': "../geometries/tracks/cityscape/track.json",
                'track.scrapers1': "../geometries/tracks/cityscape/scrapers1.json",
                'track.scrapers2': "../geometries/tracks/cityscape/scrapers2.json",
                'track.start': "../geometries/tracks/cityscape/start.json",
                'track.start.banner': "../geometries/tracks/cityscape/startbanner.json",
                'track.bonus.speed': "../geometries/tracks/cityscape/bonus/speed.json"
            },
            analysers: {
                'track.collision': "../textures.full/tracks/cityscape/collision.png",
                'track.height': "../textures.full/tracks/cityscape/height.png"
            },
            images: {
                'hud.bg': "../textures.full/hud/hud-bg.png",
                'hud.speed': "../textures.full/hud/hud-fg-speed.png",
                'hud.shield': "../textures.full/hud/hud-fg-shield.png"
            },
            sounds: {
                bg: {
                    src: '../audio/bg.ogg',
                    loop: true,
                    usePanner: false
                },
                crash: {
                    src: '../audio/crash.ogg',
                    loop: false,
                    usePanner: true
                },
                destroyed: {
                    src: '../audio/destroyed.ogg',
                    loop: false,
                    usePanner: false
                },
                boost: {
                    src: '../audio/boost.ogg',
                    loop: false,
                    usePanner: true
                },
                wind: {
                    src: '../audio/wind.ogg',
                    loop: true,
                    usePanner: true
                }
            }
        },
        low: {
            textures: {
                'hex': "../textures/hud/hex.jpg",
                'spark': "../textures/particles/spark.png",
                'cloud': "../textures/particles/cloud.png",
                'ship.feisar.diffuse': "../textures/ships/feisar/diffuse.jpg",
                'booster.diffuse': "../textures/ships/feisar/booster/booster.png",
                'booster.sprite': "../textures/ships/feisar/booster/boostersprite.jpg",
                'track.diffuse': "../textures/tracks/cityscape/diffuse.jpg",
                'track.scrapers1.diffuse': "../textures/tracks/cityscape/scrapers1/diffuse.jpg",
                'track.scrapers2.diffuse': "../textures/tracks/cityscape/scrapers2/diffuse.jpg",
                'track.start.diffuse': "../textures/tracks/cityscape/start/diffuse.jpg",
                'track.start.banner': "../textures/tracks/cityscape/start/start.jpg",
                'bonus.base.diffuse': "../textures/bonus/base/diffuse.jpg"
            },
            texturesCube: {
                'skybox.dawnclouds': "../textures/skybox/dawnclouds/%1.jpg"
            },
            geometries: {
                'bonus.base': "../geometries/bonus/base/base.json",
                'booster': "../geometries/booster/booster.json",
                'ship.feisar': "../geometries/ships/feisar/feisar.json",
                'track': "../geometries/tracks/cityscape/track.json",
                'track.scrapers1': "../geometries/tracks/cityscape/scrapers1.json",
                'track.scrapers2': "../geometries/tracks/cityscape/scrapers2.json",
                'track.start': "../geometries/tracks/cityscape/start.json",
                'track.start.banner': "../geometries/tracks/cityscape/startbanner.json",
                'track.bonus.speed': "../geometries/tracks/cityscape/bonus/speed.json"
            },
            analysers: {
                'track.collision': "../textures/tracks/cityscape/collision.png",
                'track.height': "../textures/tracks/cityscape/height.png"
            },
            images: {
                'hud.bg': "../textures/hud/hud-bg.png",
                'hud.speed': "../textures/hud/hud-fg-speed.png",
                'hud.shield': "../textures/hud/hud-fg-shield.png"
            },
            sounds: {
                bg: {
                    src: '../audio/bg.ogg',
                    loop: true,
                    usePanner: false
                },
                crash: {
                    src: '../audio/crash.ogg',
                    loop: false,
                    usePanner: true
                },
                destroyed: {
                    src: '../audio/destroyed.ogg',
                    loop: false,
                    usePanner: false
                },
                boost: {
                    src: '../audio/boost.ogg',
                    loop: false,
                    usePanner: true
                },
                wind: {
                    src: '../audio/wind.ogg',
                    loop: true,
                    usePanner: true
                }
            }
        }
    }
}

export default Cityscape;
