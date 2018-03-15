
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";

export class PolaroidProgressProxy extends ProxyBase implements IArmatureProxy {
	
	protected _bone:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		Logger.log(this, "PolaroidProgressProxy armature.animation.animationNames.toString() == "+armature.animation.animationNames.toString());
		TypedDBFactory.setProxyFromDisplay(this._armature, this);
	}

// < Child Armatures >
// </ Child Armatures >
// < Animations >
public goto_0():void {
		if (this._armature.animation.lastAnimationName != "_0") {
			Logger.log(this, "PolaroidProgressProxy goto_0");
			this._armature.animation.play("_0");
		}
	}
public goto_1():void {
		if (this._armature.animation.lastAnimationName != "_1") {
			Logger.log(this, "PolaroidProgressProxy goto_1");
			this._armature.animation.play("_1");
		}
	}
public goto_2():void {
		if (this._armature.animation.lastAnimationName != "_2") {
			Logger.log(this, "PolaroidProgressProxy goto_2");
			this._armature.animation.play("_2");
		}
	}
public goto_3():void {
		if (this._armature.animation.lastAnimationName != "_3") {
			Logger.log(this, "PolaroidProgressProxy goto_3");
			this._armature.animation.play("_3");
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
