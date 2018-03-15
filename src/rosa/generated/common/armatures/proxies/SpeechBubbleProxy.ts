
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class SpeechBubbleProxy extends ProxyBase implements IArmatureProxy {
	
	protected _bone:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		Logger.log(this, "SpeechBubbleProxy constructor this._armature == "+this._armature);
		this.setSlotChildArmature();

		Logger.log(this, "SpeechBubbleProxy armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());
	}

// < Child Armatures >
// </ Child Armatures >
// < Animations >
public gotoBamse():void
	{
		if (this._armature.animation.lastAnimationName != "bamse")
		{
			this._armature.animation.play("bamse");
		}
	}
public gotoChristian():void
	{
		Logger.log(this, "SpeechBubbleProxy gotoChristian this._armature == "+this._armature);
		Logger.log(this, "SpeechBubbleProxy gotoChristian this._armature.animation == "+this._armature.animation);
		Logger.log(this, "SpeechBubbleProxy gotoChristian == "+this._armature.animation.lastAnimationName);
		if (this._armature.animation.lastAnimationName != "christian")
		{
			this._armature.animation.play("christian");
		}
	}
public gotoSkaeg():void
	{
		if (this._armature.animation.lastAnimationName != "skaeg")
		{
			this._armature.animation.play("skaeg");
		}
	}
// public gotoMille():void
// 	{
// 		if (this._armature.animation.lastAnimationName != "mille")
// 		{
// 			this._armature.animation.play("mille");
// 		}
// 	}
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
