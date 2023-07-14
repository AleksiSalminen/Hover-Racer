
const shipsRoot = "../game/ships/";
const shipID = "Feisar";


const Feisar = {
    resources: {
        high: {
            textures: {
                'ship.feisar.normal': shipsRoot + shipID + "/textures.full/normal.jpg",
                'ship.feisar.specular': shipsRoot + shipID + "/textures.full/specular.jpg",
                'ship.feisar.diffuse': shipsRoot + shipID + "/textures.full/diffuse.jpg",
                'booster.diffuse': shipsRoot + shipID + "/textures.full/booster/booster.png",
                'booster.sprite': shipsRoot + shipID + "/textures.full/booster/boostersprite.jpg",
            },
            geometries: {
                'bonus.base': shipsRoot + shipID + "/geometries/bonus/base/base.json",
                'booster': shipsRoot + shipID + "/geometries/booster/booster.json",
                'ship.feisar': shipsRoot + shipID + "/geometries/feisar.json",
            },
            sounds: {
                crash: {
                    src: shipsRoot + shipID + "/audio/crash.ogg",
                    loop: false,
                    usePanner: true
                },
                destroyed: {
                    src: shipsRoot + shipID + "/audio/destroyed.ogg",
                    loop: false,
                    usePanner: false
                },
                boost: {
                    src: shipsRoot + shipID + "/audio/boost.ogg",
                    loop: false,
                    usePanner: true
                }
            }
        },
        low: {
            textures: {
                'ship.feisar.normal': shipsRoot + shipID + "/textures/normal.jpg",
                'ship.feisar.specular': shipsRoot + shipID + "/textures/specular.jpg",
                'ship.feisar.diffuse': shipsRoot + shipID + "/textures/diffuse.jpg",
                'booster.diffuse': shipsRoot + shipID + "/textures/booster/booster.png",
                'booster.sprite': shipsRoot + shipID + "/textures/booster/boostersprite.jpg",
            },
            geometries: {
                'bonus.base': shipsRoot + shipID + "/geometries/bonus/base/base.json",
                'booster': shipsRoot + shipID + "/geometries/booster/booster.json",
                'ship.feisar': shipsRoot + shipID + "/geometries/feisar.json",
            },
            sounds: {
                crash: {
                    src: shipsRoot + shipID + "/audio/crash.ogg",
                    loop: false,
                    usePanner: true
                },
                destroyed: {
                    src: shipsRoot + shipID + "/audio/destroyed.ogg",
                    loop: false,
                    usePanner: false
                },
                boost: {
                    src: shipsRoot + shipID + "/audio/boost.ogg",
                    loop: false,
                    usePanner: true
                }
            }
        }
    }
};

export default Feisar;
