
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {HandMixerBodyProxy} from "src/rosa/generated/common/armatures/proxies/HandMixerBodyProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class HandMixerArmProxy extends ProxyBase implements IArmatureProxy {


	protected mixerObj:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getMixerObj():HandMixerBodyProxy
	{
		return new HandMixerBodyProxy(this.mixerObj);
	}
// </ Child Armatures >
// < Animations >
public gotoOff():void
	{
		if (this._armature.animation.lastAnimationName != "off")
		{
			this._armature.animation.play("off");
		}
	}
public gotoSpeed1():void
	{
		if (this._armature.animation.lastAnimationName != "speed1")
		{
			this._armature.animation.play("speed1");
		}
	}
public gotoSpeed2():void
	{
		if (this._armature.animation.lastAnimationName != "speed2")
		{
			this._armature.animation.play("speed2");
		}
	}
public gotoSpeed3():void
	{
		if (this._armature.animation.lastAnimationName != "speed3")
		{
			this._armature.animation.play("speed3");
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
