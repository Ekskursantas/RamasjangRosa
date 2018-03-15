
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {CharCardFrame0Proxy} from "src/rosa/generated/common/armatures/proxies/CharCardFrame0Proxy";
import {RosaProxy} from "src/rosa/generated/common/armatures/proxies/RosaProxy";
import {CharCardFrame1Proxy} from "src/rosa/generated/common/armatures/proxies/CharCardFrame1Proxy";
import {CharCardFrame2Proxy} from "src/rosa/generated/common/armatures/proxies/CharCardFrame2Proxy";
import {CharCardFrame3Proxy} from "src/rosa/generated/common/armatures/proxies/CharCardFrame3Proxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";

export class Scene1_pickCharProxy extends ProxyBase implements IArmatureProxy {
	

	private charCardFrame0:dragonBones.Armature;
	private charCardFrame1:dragonBones.Armature;
	private charCardFrame2:dragonBones.Armature;
	private charCardFrame3:dragonBones.Armature;
	private rosa:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		this.proxyName = "Scene1_pickCharProxy";

		Logger.log(this, "Scene1_pickCharProxy constructor this._armature == "+this._armature);
		Logger.log(this, "Scene1_pickCharProxy armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());

		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();

	}

	// < Child Armatures >
	public getCharCardFrame0():CharCardFrame0Proxy {
		return new CharCardFrame0Proxy(this.charCardFrame0);
	}
	public getRosa():RosaProxy {
		return new RosaProxy(this.rosa);
	}
	public getCharCardFrame1():CharCardFrame1Proxy {
		return new CharCardFrame1Proxy(this.charCardFrame1);
	}
	public getCharCardFrame2():CharCardFrame2Proxy {
		// return new CharCardFrame2Proxy(this._armature.getSlot("charCardFrame2").childArmature);
		return new CharCardFrame2Proxy(this.charCardFrame2);
	}
	public getCharCardFrame3():CharCardFrame3Proxy {
		return new CharCardFrame3Proxy(this.charCardFrame3);
	}
	// </ Child Armatures >
	// < Animations >
	public gotoDefault():void {
		Logger.log(this, "Scene1_pickCharProxy gotoDefault armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());
		if (this._armature.animation.lastAnimationName != "default")
		{
			this._armature.animation.play("default");
		}
	}
	public gotoIntro():void {
		if (this._armature.animation.lastAnimationName != "intro")
		{
			this._armature.animation.play("intro");
		}
	}
	public gotoOuttro():void {
		if (this._armature.animation.lastAnimationName != "outtro")
		{
			this._armature.animation.play("outtro");
		}
	}
	// </ Animations >
	// < Animations aliases >
	public gotoIdle():void {
		this.gotoDefault();
	}
	public gotoOutro():void {
		this.gotoOuttro();
	}
	// </ Animations aliases >
	public get armature():dragonBones.Armature {
		return this._armature;
	}
	public get display():PIXI.Sprite {
		return this._armature.display as PIXI.Sprite;
	}
	public set display(newDisplay:PIXI.Sprite) {
		if (this._armature.getSlots().length == 1) {
			let slot:dragonBones.Slot = this._armature.getSlots()[0];
			if (!slot) {
				throw new Error("Could not find the armature slot");
			}
			if (slot.display) {
				//slot.display.dispose();
			}
			slot.display = newDisplay;
		} else {
			throw new Error("You cannot change display of armature containing more than one bone!")
		}
	}
	public show(container:PIXI.Container):void {
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void {
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
