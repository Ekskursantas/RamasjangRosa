
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {HandMixerButtonArmProxy} from "src/rosa/generated/common/armatures/proxies/HandMixerButtonArmProxy";
import {FingerSpinnerProxy} from "src/rosa/generated/common/armatures/proxies/FingerSpinnerProxy";
import {NextArrowProxy} from "src/rosa/generated/common/armatures/proxies/NextArrowProxy";
import {HandMixerArmProxy} from "src/rosa/generated/common/armatures/proxies/HandMixerArmProxy";
import {ScreenSplatsProxy} from "src/rosa/generated/common/armatures/proxies/ScreenSplatsProxy";
import {WRLRLRLRProxy} from "src/rosa/generated/common/armatures/proxies/WRLRLRLRProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

export class Scene8a_handMixingSceneProxy extends ProxyBase implements IArmatureProxy {
	

	private handMixerButtonArm:dragonBones.Armature;
	private spinner:dragonBones.Armature;
	private closeButton:dragonBones.Armature;
	private mixer:dragonBones.Armature;
	private splats:dragonBones.Armature;
	private WRLRLRLR:dragonBones.Armature;

	// public get armature() { //TODO added for interface : http://stackoverflow.com/questions/12838248/is-it-possible-to-use-getters-setters-in-interface-definition
  //     return this._armature;
  // }
	//
  // public set armature(value) {
  //     this._armature = value;
  // }

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// < Child Armatures >
public getHandMixerButtonArm():HandMixerButtonArmProxy
	{
		return new HandMixerButtonArmProxy(this.handMixerButtonArm);
	}
public getSpinner():FingerSpinnerProxy
	{
		return new FingerSpinnerProxy(this.spinner);
	}
public getCloseButton():NextArrowProxy
	{
		return new NextArrowProxy(this.closeButton);
	}
public getMixer():HandMixerArmProxy
	{
		return new HandMixerArmProxy(this.mixer);
	}
public getSplats():ScreenSplatsProxy
	{
		return new ScreenSplatsProxy(this.splats);
	}
public getWRLRLRLR():WRLRLRLRProxy
	{
		return new WRLRLRLRProxy(this.WRLRLRLR);
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
public gotoHand():void
	{
		if (this._armature.animation.lastAnimationName != "hand")
		{
			this._armature.animation.play("hand");
		}
	}
public gotoMixer():void
	{
		if (this._armature.animation.lastAnimationName != "mixer")
		{
			this._armature.animation.play("mixer");
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
public gotoOutro():void
	{
		this.gotoOuttro();
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
