
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

export class Scene8_cakeInOutOvenProxy extends ProxyBase implements IArmatureProxy {
	

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		// this.setSlotChildArmature();
	}

// Child Armatures
	// Animations
public gotoDefault():void
	{
		if (this._armature.animation.lastAnimationName != "default")
		{
			this._armature.animation.play("default");
		}
	}
public gotoIntro():void
	{
		if (this._armature.animation.lastAnimationName != "intro")
		{
			this._armature.animation.play("intro");
		}
	}
public gotoPause():void
	{
		if (this._armature.animation.lastAnimationName != "pause")
		{
			this._armature.animation.play("pause");
		}
	}
public gotoOuttro():void
	{
		if (this._armature.animation.lastAnimationName != "outtro")
		{
			this._armature.animation.play("outtro");
		}
	}
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
			//slot.display.dispose();
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
