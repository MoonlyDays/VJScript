const player = GetListenServerHost();

const __js_JSArray = {};

const __js_resolveEntThink = 1;

AddThinkToEnt(player, player => {
    console.log(player.GetName(), [1, 2, Math.random()]);
})
