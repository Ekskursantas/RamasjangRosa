
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {RosaProxy} from "src/rosa/generated/common/armatures/proxies/RosaProxy";
import {DisguiseBubbleChristianProxy} from "src/rosa/generated/common/armatures/proxies/DisguiseBubbleChristianProxy";
import {DisguiseBubbleBamseProxy} from "src/rosa/generated/common/armatures/proxies/DisguiseBubbleBamseProxy";
import {DisguiseBubbleSkaegProxy} from "src/rosa/generated/common/armatures/proxies/DisguiseBubbleSkaegProxy";
import {DisguiseBubbleMilleProxy} from "src/rosa/generated/common/armatures/proxies/DisguiseBubbleMilleProxy";
import {SpeechBubbleProxy} from "src/rosa/generated/common/armatures/proxies/SpeechBubbleProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class Scene2_pickDisquiseProxy extends ProxyBase implements IArmatureProxy {
	

	private charCardFrame0:dragonBones.Armature;
	private charCardFrame1:dragonBones.Armature;
	private charCardFrame2:dragonBones.Armature;
	private charCardFrame3:dragonBones.Armature;
	private speechBubble:dragonBones.Armature;
	private rosa:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		Logger.log(this, "Scene2_pickDisquiseProxy armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());

		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getRosa():RosaProxy
	{
		// return new RosaProxy(this._armature.getSlot("rosa").childArmature);
		return new RosaProxy(this.rosa);
	}
public getCharCardFrame0():DisguiseBubbleChristianProxy
	{
		// return new DisguiseBubbleChristianProxy(this._armature.getSlot("charCardFrame0").childArmature);
		return new DisguiseBubbleChristianProxy(this.charCardFrame0);
	}
public getCharCardFrame1():DisguiseBubbleBamseProxy
	{
		return new DisguiseBubbleBamseProxy(this.charCardFrame1);
	}
public getCharCardFrame2():DisguiseBubbleSkaegProxy
	{
		return new DisguiseBubbleSkaegProxy(this.charCardFrame2);
	}
public getCharCardFrame3():DisguiseBubbleMilleProxy
	{
		// return new DisguiseBubbleMilleProxy(this.charCardFrame3); //TODO this is not is dragonBones source
		return null;
	}
public getSpeechBubble():SpeechBubbleProxy
	{
		return new SpeechBubbleProxy(this.speechBubble);
	}
// </ Child Armatures >
// < Animations >
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
public gotoOuttro():void
	{
		if (this._armature.animation.lastAnimationName != "outtro")
		{
			this._armature.animation.play("outtro");
		}
	}
// </ Animations >
// < Animations aliases >
public gotoIdle():void
	{
		this.gotoDefault();
	}
// public gotoOuttro():void
// 	{
// 		this.gotoOutro();
// 	}
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
