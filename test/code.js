function DeleteAllPropDynamic() {
    let ent;
    while (ent = Entities.FindByClassname(ent, "item_ammopack_full")) {
        ent.Kill();
    }
}

DeleteAllPropDynamic();