/*
 * Copyright (C) Moonly Days
 * https://github.com/MoonlyDays
 */

const player = GetListenServerHost();
console.log(player, "POGGERS", player);

const $A = 2;

AddThinkToEnt(player, (ent) => {
    console.log(ent);
    return -1;
});