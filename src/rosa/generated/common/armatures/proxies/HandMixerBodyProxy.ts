
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {MixerButton2ArmProxy} from "src/rosa/generated/common/armatures/proxies/MixerButton2ArmProxy";
import {MixerButton3ArmProxy} from "src/rosa/generated/common/armatures/proxies/MixerButton3ArmProxy";
import {MixerButton1ArmProxy} from "src/rosa/generated/common/armatures/proxies/MixerButton1ArmProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class HandMixerBodyProxy extends ProxyBase implements IArmatureProxy {


	protected mixerButton2Arm:dragonBones.Armature;
	protected mixerButton3Arm:dragonBones.Armature;
	protected mixerButton1Arm:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getMixerButton2Arm():MixerButton2ArmProxy
	{
		return new MixerButton2ArmProxy(this.mixerButton2Arm);
	}
public getMixerButton3Arm():MixerButton3ArmProxy
	{
		return new MixerButton3ArmProxy(this.mixerButton3Arm);
	}
public getMixerButton1Arm():MixerButton1ArmProxy
	{
		return new MixerButton1ArmProxy(this.mixerButton1Arm);
	}
// </ Child Armatures >
// < Animations >
public gotoStatic():void
	{
		if (this._armature.animation.lastAnimationName != "static")
		{
			this._armature.animation.play("static");
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
