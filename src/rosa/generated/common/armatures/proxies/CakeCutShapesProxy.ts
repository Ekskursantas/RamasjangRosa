
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {BadGuy_skaeg__cakeShapeProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_skaeg__cakeShapeProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {Model} from "../../../../model/Model";
import {BadGuy_christian__cakeShapeProxy} from "./BadGuy_christian__cakeShapeProxy";
import {BadGuy_bamse__cakeShapeProxy} from "./BadGuy_bamse__cakeShapeProxy";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class CakeCutShapesProxy extends ProxyBase implements IArmatureProxy {


	protected cakeShape:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);
		Logger.log(this, "CakeCutShapesProxy constructor");
		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getCakeShape():IArmatureProxy {
		let toReturn:IArmatureProxy;
		Logger.log(this, "CakeCutShapesProxy getCakeShape Model.getInstance().selectedChar ==" + Model.getInstance().selectedChar);
		switch (Model.getInstance().selectedChar) {
			case Model.CHAR_CHRISTIAN:
				toReturn = new BadGuy_christian__cakeShapeProxy(this.cakeShape);
				Logger.log(this, "getCakeShape Model.Model.CHAR_CHRISTIAN");
				break;
			case Model.CHAR_BAMSE:
				toReturn = new BadGuy_bamse__cakeShapeProxy(this.cakeShape);
				break;
			case Model.CHAR_SKAEG:
				toReturn = new BadGuy_skaeg__cakeShapeProxy(this.cakeShape);
				break;
			// case Model.CHAR_MILLE:
			// 	// toReturn = new BadGuy_skaeg__cakeShapeProxy(this.cakeShape);
			// 	break;
		}
		return toReturn;
	}
	// </ Child Armatures >
	// < Animations >
	public gotoEmpty():void {
		if (this._armature.animation.lastAnimationName != "empty")
		{
			this._armature.animation.play("empty");
		}
	}
	public gotoSkaeg():void {
		if (this._armature.animation.lastAnimationName != "skaeg")
		{
			this._armature.animation.play("skaeg");
		}
	}
	public gotoChristian():void {
		Logger.log(this, "CakeCutShapesProxy gotoChristian   this._armature.animation.lastAnimationName == "+this._armature.animation.lastAnimationName);
		if (this._armature.animation.lastAnimationName != "christian")
		{
			this._armature.animation.play("christian");
		}
	}
	public gotoBamse():void {
		if (this._armature.animation.lastAnimationName != "bamse")
		{
			this._armature.animation.play("bamse");
		}
	}
	public gotoMille():void {
		if (this._armature.animation.lastAnimationName != "mille")
		{
			this._armature.animation.play("mille");
		}
	}
	// </ Animations >
	// < Animations aliases >
	// </ Animations aliases >
	public get armature():dragonBones.Armature {
		return this._armature;
	}
	public get display():PIXI.Sprite {
		return this._armature.display as PIXI.Sprite;
	}
	public set display(newDisplay:PIXI.Sprite) {
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
	public show(container:PIXI.Container):void {
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void {
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
