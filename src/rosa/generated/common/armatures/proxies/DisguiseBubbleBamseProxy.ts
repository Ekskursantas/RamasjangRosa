
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {Disquise_bamseProxy} from "src/rosa/generated/common/armatures/proxies/Disquise_bamseProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class DisguiseBubbleBamseProxy extends ProxyBase implements IArmatureProxy {

	protected _bone:dragonBones.Armature;

	private disquise:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getDisquise():Disquise_bamseProxy
	{
		return new Disquise_bamseProxy(this.disquise);
	}
// </ Child Armatures >
// < Animations >
public gotoUp():void
	{
		if (this._armature.animation.lastAnimationName != "up")
		{
			this._armature.animation.play("up");
		}
	}
public gotoDown():void
	{
		if (this._armature.animation.lastAnimationName != "down")
		{
			this._armature.animation.play("down");
		}
	}
public gotoDisabled():void
	{
		if (this._armature.animation.lastAnimationName != "disabled")
		{
			this._armature.animation.play("disabled");
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
