const log = "log";
function DeleteAllPropDynamic() {
    let ent;
    while (ent = Entities.FindByClassname(ent, "item_ammopack_full")) {
        console.log(`Deleting: ${ent.toString()}. sin: ${Math.sin(123)}`);
        ent.Kill();
    }
}

DeleteAllPropDynamic();