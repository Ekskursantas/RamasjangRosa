
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {SmokePuffAnimProxy} from "src/rosa/generated/common/armatures/proxies/SmokePuffAnimProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

export class MagreteBowlProxy extends ProxyBase implements IArmatureProxy {
	

	protected smokePuff:dragonBones.Armature;


	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getSmokePuff():SmokePuffAnimProxy
	{
		return new SmokePuffAnimProxy(this.smokePuff);
	}
// </ Child Armatures >
// < Animations >
public gotoDefault():void
	{
		if (this._armature.animation.lastAnimationName != "idle")
		{
			this._armature.animation.play("idle");
		}
	}
public gotoDej_1():void
	{
		if (this._armature.animation.lastAnimationName != "dej_1")
		{
			this._armature.animation.play("dej_1");
		}
	}
public gotoDej_2():void
	{
		if (this._armature.animation.lastAnimationName != "dej_2")
		{
			this._armature.animation.play("dej_2");
		}
	}
public gotoDej_3():void
	{
		if (this._armature.animation.lastAnimationName != "dej_3")
		{
			this._armature.animation.play("dej_3");
		}
	}
public gotoDej_4():void
	{
		if (this._armature.animation.lastAnimationName != "dej_4")
		{
			this._armature.animation.play("dej_4");
		}
	}
public gotoDej_5():void
	{
		if (this._armature.animation.lastAnimationName != "dej_5")
		{
			this._armature.animation.play("dej_5");
		}
	}
public gotoDej_6():void
	{
		if (this._armature.animation.lastAnimationName != "dej_6")
		{
			this._armature.animation.play("dej_6");
		}
	}
// </ Animations >
// < Animations aliases >
public gotoIdle():void
	{
		this.gotoDefault();
	}
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
