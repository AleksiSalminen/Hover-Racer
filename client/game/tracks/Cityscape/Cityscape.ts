
const tracksRoot = "../game/tracks/";
const trackID = "Cityscape";


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
                'track.normal': tracksRoot + trackID + "/textures.full/normal.jpg",
                'track.specular': tracksRoot + trackID + "/textures.full/specular.jpg",
                'track.diffuse': tracksRoot + trackID + "/textures.full/diffuse.jpg",
                'track.scrapers1.normal': tracksRoot+ trackID + "/textures.full/scrapers1/normal.jpg",
                'track.scrapers1.specular': tracksRoot+ trackID + "/textures.full/scrapers1/specular.jpg",
                'track.scrapers1.diffuse': tracksRoot+ trackID + "/textures.full/scrapers1/diffuse.jpg",
                'track.scrapers2.normal': tracksRoot + trackID + "/textures.full/scrapers2/normal.jpg",
                'track.scrapers2.specular': tracksRoot + trackID + "/textures.full/scrapers2/specular.jpg",
                'track.scrapers2.diffuse': tracksRoot + trackID + "/textures.full/scrapers2/diffuse.jpg",
                'track.start.normal': tracksRoot + trackID + "/textures.full/start/normal.jpg",
                'track.start.specular': tracksRoot + trackID + "/textures.full/start/specular.jpg",
                'track.start.diffuse': tracksRoot + trackID + "/textures.full/start/diffuse.jpg",
                'track.start.banner': tracksRoot + trackID + "/textures.full/start/start.jpg",
            },
            texturesCube: {
                'skybox.dawnclouds': tracksRoot + trackID + "/textures.full/skybox/dawnclouds/%1.jpg"
            },
            geometries: {
                'track': tracksRoot + trackID + "/geometries/track.json",
                'track.scrapers1': tracksRoot + trackID + "/geometries/scrapers1.json",
                'track.scrapers2': tracksRoot + trackID + "/geometries/scrapers2.json",
                'track.start': tracksRoot + trackID + "/geometries/start.json",
                'track.start.banner': tracksRoot + trackID + "/geometries/startbanner.json",
                'track.bonus.speed': tracksRoot + trackID + "/geometries/bonus/speed.json"
            },
            analysers: {
                'track.collision': tracksRoot + trackID + "/textures.full/collision.png",
                'track.height': tracksRoot + trackID + "/textures.full/height.png"
            },
            sounds: {
                bg: {
                    src: tracksRoot + trackID + "/audio/bg.ogg",
                    loop: true,
                    usePanner: false
                },
                wind: {
                    src: tracksRoot + trackID + "/audio/wind.ogg",
                    loop: true,
                    usePanner: true
                }
            }
        },
        low: {
            textures: {
                'track.normal': tracksRoot + trackID + "/textures/normal.jpg",
                'track.specular': tracksRoot + trackID + "/textures/specular.jpg",
                'track.diffuse': tracksRoot + trackID + "/textures/diffuse.jpg",
                'track.scrapers1.normal': tracksRoot+ trackID + "/textures/scrapers1/normal.jpg",
                'track.scrapers1.specular': tracksRoot+ trackID + "/textures/scrapers1/specular.jpg",
                'track.scrapers1.diffuse': tracksRoot+ trackID + "/textures/scrapers1/diffuse.jpg",
                'track.scrapers2.normal': tracksRoot + trackID + "/textures/scrapers2/normal.jpg",
                'track.scrapers2.specular': tracksRoot + trackID + "/textures/scrapers2/specular.jpg",
                'track.scrapers2.diffuse': tracksRoot + trackID + "/textures/scrapers2/diffuse.jpg",
                'track.start.normal': tracksRoot + trackID + "/textures/start/normal.jpg",
                'track.start.specular': tracksRoot + trackID + "/textures/start/specular.jpg",
                'track.start.diffuse': tracksRoot + trackID + "/textures/start/diffuse.jpg",
                'track.start.banner': tracksRoot + trackID + "/textures/start/start.jpg",
            },
            texturesCube: {
                'skybox.dawnclouds': tracksRoot + trackID + "/textures/skybox/dawnclouds/%1.jpg"
            },
            geometries: {
                'track': tracksRoot + trackID + "/geometries/track.json",
                'track.scrapers1': tracksRoot + trackID + "/geometries/scrapers1.json",
                'track.scrapers2': tracksRoot + trackID + "/geometries/scrapers2.json",
                'track.start': tracksRoot + trackID + "/geometries/start.json",
                'track.start.banner': tracksRoot + trackID + "/geometries/startbanner.json",
                'track.bonus.speed': tracksRoot + trackID + "/geometries/bonus/speed.json"
            },
            analysers: {
                'track.collision': tracksRoot + trackID + "/textures/collision.png",
                'track.height': tracksRoot + trackID + "/textures/height.png"
            },
            sounds: {
                bg: {
                    src: tracksRoot + trackID + "/audio/bg.ogg",
                    loop: true,
                    usePanner: false
                },
                wind: {
                    src: tracksRoot + trackID + "/audio/wind.ogg",
                    loop: true,
                    usePanner: true
                }
            }
        }
    }
}

export default Cityscape;
