const player = GetListenServerHost();
AddThinkToEnt(player, self => {
    console.log(self);
})