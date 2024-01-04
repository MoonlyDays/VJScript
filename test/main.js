import {Player} from "./player";

const player = GetListenServerHost();
const ent = new Player(player);
console.log(ent.base);