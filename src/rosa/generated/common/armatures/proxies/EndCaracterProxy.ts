
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {SkaegInDoorProxy} from "src/rosa/generated/common/armatures/proxies/SkaegInDoorProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {Logger} from "src/loudmotion/utils/debug/Logger";

export class EndCaracterProxy extends ProxyBase implements IArmatureProxy {


	protected caracter:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getCaracter():SkaegInDoorProxy {
		Logger.log(this, "EndCaracterProxy getCaracter this.caracter== "+this.caracter);
		return new SkaegInDoorProxy(this.caracter);
	}


	// public getCaracterSkaeg():SkaegInDoorProxy {
	// 	Logger.log(this, "EndCaracterProxy getCaracter this.caracter== "+this.caracter);
	// 	// return new SkaegInDoorProxy(this.caracter);
	// 	return new SkaegInDoorProxy(this.caracter);
	// }
    //
	// public getCaracterChristian():ChristianInDoorProxy {
	// 	Logger.log(this, "EndCaracterProxy getCaracterChristian this.caracter== "+this.caracter);
	// 	// return new SkaegInDoorProxy(this.caracter);
	// 	return new ChristianInDoorProxy(this.caracter);
	// }
    //
	// public getCaracterBamse():BamseInDoorProxy {
	// 	Logger.log(this, "EndCaracterProxy getCaracterBamse this.caracter== "+this.caracter);
	// 	// return new SkaegInDoorProxy(this.caracter);
	// 	return new BamseInDoorProxy(this.caracter);
	// }


	// </ Child Armatures >
	// < Animations >
	public gotoSkaeg():void {
		if (this._armature.animation.lastAnimationName != "skaeg") {
			this._armature.animation.play("skaeg");
		}
	}
	public gotoChristian():void {
		Logger.log(this, "EndCaracterProxy gotoChristian");
		if (this._armature.animation.lastAnimationName != "christian") {
			this._armature.animation.play("christian");
		}
	}
	public gotoBamse():void
	{
		if (this._armature.animation.lastAnimationName != "bamse")
		{
			this._armature.animation.play("bamse");
		}
	}
	public gotoMille():void
	{
		if (this._armature.animation.lastAnimationName != "mille")
		{
			this._armature.animation.play("mille");
		}
	}
// </ Animations >
// < Animations aliases >
// </ Animations aliases >
public get armature():dragonBones.Armature
	{
		return this._armature;
	}
	public get display():PIXI.Sprite
	{
		return this._armature.display as PIXI.Sprite;
	}
	public set display(newDisplay:PIXI.Sprite)
	{
		if (this._armature.getSlots().length == 1)
		{
			let slot:dragonBones.Slot = this._armature.getSlots()[0];
			if (!slot) {
				throw new Error("Could not find the armature slot");
			}
			if (slot.display) {
				//slot.display.dispose();
			}
			slot.display = newDisplay;
		}
		else
		{
			throw new Error("You cannot change display of armature containing more than one bone!")
		}
	}
	public show(container:PIXI.Container):void
	{
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void
	{
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
