
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {Pic_placeholderProxy} from "src/rosa/generated/common/armatures/proxies/Pic_placeholderProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";

export class PolaroidProxy extends ProxyBase implements IArmatureProxy {
	

	protected _placeholder:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;

		try{
			Logger.log(this, "PolaroidProxy armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());
		} catch (error) {
			Logger.log(this, "ERROR : PolaroidProxy : PolaroidProxy armature.animation.animationNames.toString");
		}

		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();

	}

// < Child Armatures >
public get_placeholder():Pic_placeholderProxy {
		return new Pic_placeholderProxy(this._placeholder);
	}
// </ Child Armatures >
// < Animations >
public gotoSmag():void {
		Logger.log(this, "PolaroidProxy gotoSmag");
		if (this._armature.animation.lastAnimationName != "smag")
		{
			this._armature.animation.play("smag");
		}
	}
public gotoForm():void {
	Logger.log(this, "PolaroidProxy gotoForm  this._armature.animation.lastAnimationName  ==== "+this._armature.animation.lastAnimationName);
	Logger.log(this, "PolaroidProxy gotoForm  this._armature.animation.getState(form)  ==== "+this._armature.animation.getState("form"));
		if (this._armature.animation.lastAnimationName != "form" || this._armature.animation.lastAnimationName == null)
		{
			this._armature.animation.play("form");
			// this._armature.animation.stop("form");
		}
	Logger.log(this, "PolaroidProxy gotoForm AFTER this._armature.animation.getState(puzzle)  ==== "+this._armature.animation.getState("puzzle"));
	Logger.log(this, "PolaroidProxy gotoForm AFTER this._armature.animation.getState(form)  ==== "+this._armature.animation.getState("form"));
	Logger.log(this, "PolaroidProxy gotoForm AFTER this._armature.animation.getState(smag)  ==== "+this._armature.animation.getState("smag"));
	Logger.log(this, "PolaroidProxy gotoForm AFTER this._armature.animation.getState(farve)  ==== "+this._armature.animation.getState("farve"));
	}
public gotoFarve():void {
	Logger.log(this, "PolaroidProxy gotoFarve  this._armature.animation.lastAnimationName  ==== "+this._armature.animation.lastAnimationName);
		if (this._armature.animation.lastAnimationName != "farve")
		{
			this._armature.animation.play("farve");
		}
	}
public gotoFreemode():void {
	Logger.log(this, "PolaroidProxy gotoFreemode  this._armature.animation.lastAnimationName  ==== "+this._armature.animation.lastAnimationName);
		if (this._armature.animation.lastAnimationName != "freemode")
		{
			this._armature.animation.play("freemode");
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
		if (this._armature.getSlots().length == 1) {
			let slot:dragonBones.Slot = this._armature.getSlots()[0];
			if (!slot) {
				throw new Error("Could not find the armature slot");
			}
			if (slot.display) {
				//slot.display.dispose();
			}
			slot.display = newDisplay;
		} else {
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
