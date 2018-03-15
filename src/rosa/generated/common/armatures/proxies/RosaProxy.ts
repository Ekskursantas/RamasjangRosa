
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {HeadProxy} from "src/rosa/generated/common/armatures/proxies/HeadProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class RosaProxy extends ProxyBase implements IArmatureProxy {
	

	protected head:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getHead():HeadProxy
	{
		return new HeadProxy(this.head);
	}
// </ Child Armatures >
// < Animations >
public gotoInit():void
	{
		if (this._armature.animation.lastAnimationName != "init")
		{
			this._armature.animation.play("init");
		}
	}
public gotoDefault():void
	{
		if (this._armature.animation.lastAnimationName != "idle")
		{
			this._armature.animation.play("idle");
		}
	}
public gotoTaste():void
	{
		Logger.log(this, "RosaProxy gotoTaste this._armature.animation.lastAnimationName === "+this._armature.animation.lastAnimationName);
		if (this._armature.animation.lastAnimationName != "taste")
		{
			this._armature.animation.play("taste");
		}
	}
public gotoSour():void
	{
		Logger.log(this, "RosaProxy gotoSour this._armature.animation.lastAnimationName === "+this._armature.animation.lastAnimationName);
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
public gotoOk():void
	{
		if (this._armature.animation.lastAnimationName != "ok")
		{
			this._armature.animation.play("ok");
		}
	}
public gotoNogo():void
	{
		if (this._armature.animation.lastAnimationName != "nogo")
		{
			this._armature.animation.play("nogo");
		}
	}
public gotoTalk():void
	{
		if (this._armature.animation.lastAnimationName != "talk")
		{
			this._armature.animation.play("talk");
		}
	}
public gotoIdle():void
	{
		if (this._armature.animation.lastAnimationName != "idle")
		{
			this._armature.animation.play("idle");
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
