
/** Available settings enums, interfaces and types */

enum ControlType {
    KEYBOARD = "KEYBOARD", TOUCH = "TOUCH", GAMEPAD = "GAMEPAD"
}

enum Quality {
    LOWEST = "LOWEST", LOW = "LOW", MEDIUM = "MEDIUM", HIGH = "HIGH",
    ULTIMATE = "ULTIMATE"
}

enum HUD {
    OFF = "OFF", ON = "ON"
}

enum Godmode {
    OFF = "OFF", ON = "ON"
}

enum Difficulty {
    EASY = "EASY", NORMAL = "NORMAL", HARD = "HARD", INSANE = "INSANE"
}

export interface Settings {
    controls: ControlType;
    quality: Quality;
    hud: HUD;
    godmode: Godmode;
    difficulty: Difficulty;
}


/** Settings configurations */

const settings = {
    difficulty: [
        {
            name: Difficulty.INSANE,
            airResist: 0.065,
			airDrift: 0.09,
			thrust: 0.065,
			airBrake: 0.07,
			maxSpeed: 14.8,
			boosterSpeed: 14.8 * 0.35,
			boosterDecay: 0.007,
			angularSpeed: 0.017,
			airAngularSpeed: 0.0225,
			rollAngle: 0.6,
			shieldDamage: 0.01,
			collisionSpeedDecrease: 0.8,
			collisionSpeedDecreaseCoef: 0.5,
			rollLerp: 0.18,
			driftLerp: 0.6,
			angularLerp: 0.4
        },
        {
            name: Difficulty.HARD,
            airResist: 0.05,
			airDrift: 0.08,
			thrust: 0.05,
			airBrake: 0.055,
			maxSpeed: 12.2,
			boosterSpeed: 12.2 * 0.35,
			boosterDecay: 0.007,
			angularSpeed: 0.0155,
			airAngularSpeed: 0.0195,
			rollAngle: 0.6,
			shieldDamage: 0.02,
			collisionSpeedDecrease: 0.8,
			collisionSpeedDecreaseCoef: 0.5,
			rollLerp: 0.14,
			driftLerp: 0.5,
			angularLerp: 0.4
        },
        {
            name: Difficulty.NORMAL,
            airResist: 0.035,
			airDrift: 0.07,
			thrust: 0.035,
			airBrake: 0.04,
			maxSpeed: 9.6,
			boosterSpeed: 9.6 * 0.35,
			boosterDecay: 0.007,
			angularSpeed: 0.0140,
			airAngularSpeed: 0.0165,
			rollAngle: 0.6,
			shieldDamage: 0.03,
			collisionSpeedDecrease: 0.8,
			collisionSpeedDecreaseCoef: 0.5,
			rollLerp: 0.1,
			driftLerp: 0.4,
			angularLerp: 0.4
        },
        {
            name: Difficulty.EASY,
            airResist: 0.02,
			airDrift: 0.06,
			thrust: 0.02,
			airBrake: 0.025,
			maxSpeed: 7.0,
			boosterSpeed: 7.0 * 0.35,
			boosterDecay: 0.007,
			angularSpeed: 0.0125,
			airAngularSpeed: 0.0135,
			rollAngle: 0.6,
			shieldDamage: 0.06,
			collisionSpeedDecrease: 0.8,
			collisionSpeedDecreaseCoef: 0.5,
			rollLerp: 0.07,
			driftLerp: 0.3,
			angularLerp: 0.4
        }
    ]
};


/** ---------- */

export {
    ControlType, Quality, HUD, Godmode, Difficulty, settings
};
