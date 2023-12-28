/*
 * Copyright (C) Moonly Days
 * https://github.com/MoonlyDays
 */

export class Light {
    /** @type {string} */
    Color;
    /** @type {CBaseAnimating} */
    Prop;
    /** @type {CBaseAnimating} */
    SoundEnt;
    Enabled = false;

    constructor(color) {
        this.Color = color;
        this.Prop = Entities.FindByName(null, `light_${color}`);
        this.SoundEnt = Entities.FindByName(null, `snd_${color}`);
    }

    turnOn() {
        if (this.Enabled)
            return;

        this.Prop.SetSkin(0);
        EntFireByHandle(this.SoundEnt, 'PlaySound', '', -1, null, null);
        this.Enabled = true;
    }

    turnOff() {
        if (!this.Enabled)
            return;

        this.Prop.SetSkin(1);
        this.Enabled = false;
    }
}