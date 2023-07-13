
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
    EASY = "EASY", NORMAL = "NORMAL"
}

export interface Settings {
    controls: ControlType;
    quality: Quality;
    hud: HUD;
    godmode: Godmode;
    difficulty: Difficulty;
}

export {
    ControlType, Quality, HUD, Godmode, Difficulty
};
