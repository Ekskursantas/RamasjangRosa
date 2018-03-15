
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class HeadProxy extends ProxyBase implements IArmatureProxy {

	protected _bone:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);
	}

// < Child Armatures >
// </ Child Armatures >
// < Animations >
	public gotoDefault():void
	{
		if (this._armature.animation.lastAnimationName != "idle")
		{
			// this._armature.animation.play("idle");
			this._armature.animation.play("idle");
		}
	}
	public gotoTaste():void
	{
		if (this._armature.animation.lastAnimationName != "taste")
		{
			this._armature.animation.play("taste");
		}
	}
	public gotoSour():void
	{
		if (this._armature.animation.lastAnimationName != "sour")
		{
			this._armature.animation.play("sour");
		}
	}
	public gotoSweet():void
	{
		if (this._armature.animation.lastAnimationName != "sweet")
		{
			this._armature.animation.play("sweet");
		}
	}
	public gotoCake():void
	{
		if (this._armature.animation.lastAnimationName != "cake")
		{
			this._armature.animation.play("cake");
		}
	}
	public gotoNogo():void
	{
		if (this._armature.animation.lastAnimationName != "nogo")
		{
			this._armature.animation.play("nogo");
		}
	}
	public gotoOk():void
	{
		if (this._armature.animation.lastAnimationName != "ok")
		{
			this._armature.animation.play("ok");
		}
	}
	public gotoTalk():void
	{
		if (this._armature.animation.lastAnimationName != "talk")
		{
			this._armature.animation.play("talk");
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
