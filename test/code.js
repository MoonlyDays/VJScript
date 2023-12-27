class Light {
    Color = '';
    /** @type {CBaseAnimating} */
    LightProp;
    /** @type {CBaseEntity} */
    SoundEnt;

    constructor(color) {
        this.Color = color;
        this.LightProp = Entities.FindByName(null, `light_${color}`);
        this.SoundEnt = Entities.FindByName(null, `snd_${color}`);
    }

    turnOn() {
        this.LightProp.SetSkin(0);
        EntFireByHandle(this.SoundEnt, 'PlaySound', '', -1, null, null);
    }

    turnOff() {
        this.LightProp.SetSkin(1);
    }
}

const g_kScoreText = Entities.FindByName(null, 'text_score');
const g_kRecordText = Entities.FindByName(null, 'text_record');

const g_kColors = ['red', 'green', 'yellow', 'blue'];
const g_kLights = {};
for (const color of g_kColors) {
    g_kLights[color] = new Light(color);
}

/**
 * Returns a light by its color.
 * @param {'red' | 'green' | 'yellow' | 'blue'}  color
 */
function getLight(color) {
    return g_kLights[color];
}

const l = getLight('blue');
l.turnOn();

function PlayerThink() {
    console.log(self.GetName());
    return -1;
}