
import {Logger} from "src/loudmotion/utils/debug/Logger";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import Container = PIXI.Container;
import Sprite = PIXI.Sprite;

export class ProxyBase extends Sprite {
    protected _armature:  dragonBones.Armature;
    proxyName: string;

    constructor() {
        super();
        this.interactive = true;

    }

    //get proxyDisplay(): Container {
    //    //return AssetLoader.getInstance().stage;
    //}

    public getDecoArmature = ():dragonBones.Armature => {
        let armature:dragonBones.Armature = AssetLoader.getInstance().typeddb._factory.buildArmature("deco/kiwiDrag");
        return armature;
    }

    public setSlotChildArmature() {
        // Logger.log(this, "ProxyBase setSlotChildArmature this._armature.getSlots().length == " + this._armature.getSlots().length);
        let length: number = this._armature.getSlots().length;
        for (let i: number = 0; i < length; i++) {
            let slot: dragonBones.Slot = this._armature.getSlots()[i];
            this[slot.name] = slot.childArmature;


            // Logger.log(this, "ProxyBase -> slot == " + slot);
            // Logger.log(this, "ProxyBase -> slot.name == " + slot.name);
            // Logger.log(this, "ProxyBase -> slot.display == " + slot.display);
            // Logger.log(this, "ProxyBase -> slot.childArmature == " + slot.childArmature);
            //
            // try{
            //     Logger.log(this, "ProxyBase -> slot.childArmature.name == " + slot.childArmature.name);
            // } catch (Error) {
            //     Logger.log(this, "ERROR setSlotChildArmature slot.childArmature.name");
            // }
            //
            // Logger.log(this, "ProxyBase -> this[slot.name] == " + this[slot.name]);

        }
    }
}





// if(slot.name == "charCardFrame0"){
// 	Logger.log(this, "Scene1_pickCharProxy -> FOUND charCardFrame0 slot.childArmature == "+slot.childArmature);
// 	// Logger.log(this, "Scene1_pickCharProxy -> FOUND slot.displayList == "+slot.displayList.toString());
// 	// return slot;
// }
// if(slot.name == "charCardFrame1"){
// 	Logger.log(this, "Scene1_pickCharProxy -> FOUND charCardFrame1 slot.childArmature == "+slot.childArmature);
// 	this.charCardFrame1Display = slot.childArmature;
// 	// Logger.log(this, "Scene1_pickCharProxy -> FOUND slot.displayList == "+slot.displayList.toString());
// 	Logger.log(this, "Scene1_pickCharProxy -> FOUND slot.displayList.length == "+slot.displayList.length);
//
// 	for(let j:number = 0;j < slot.displayList.length;j++) {
// 		let slotDisplay: any = slot.displayList[j];
// 		Logger.log(this, "Scene1_pickCharProxy -> slotDisplay == " + slotDisplay);
// 		Logger.log(this, "Scene1_pickCharProxy -> slotDisplay.name == " + slotDisplay.name);
// 		Logger.log(this, "Scene1_pickCharProxy -> slotDisplay.name == " + slotDisplay.display());
// 	}
// 	// return slot;
// }
