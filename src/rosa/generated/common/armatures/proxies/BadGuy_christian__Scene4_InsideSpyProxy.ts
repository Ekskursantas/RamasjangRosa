
import {IInsideScene} from "src/rosa/interfaces/IInsideScene";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {SpySceneTouchProxy} from "src/rosa/generated/common/armatures/proxies/SpySceneTouchProxy";
import {BadGuy_christian__screenframe1Proxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__screenframe1Proxy";
import {BadGuy_christian__screenframe2Proxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__screenframe2Proxy";
import {BadGuy_christian__screenframe3Proxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__screenframe3Proxy";
import {BadGuy_christian__screenframe4Proxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__screenframe4Proxy";
import {BadGuy_christian__machineVoiceProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__machineVoiceProxy";
import {BadGuy_christian__spyGlassProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_christian__spyGlassProxy";
import {Color_clueProxy} from "src/rosa/generated/common/armatures/proxies/Color_clueProxy";
import {Form_clueProxy} from "src/rosa/generated/common/armatures/proxies/Form_clueProxy";
import {Taste_clueProxy} from "src/rosa/generated/common/armatures/proxies/Taste_clueProxy";
import {ShootPictureProxy} from "src/rosa/generated/common/armatures/proxies/ShootPictureProxy";
import {PolaroidProgressProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProgressProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class BadGuy_christian__Scene4_InsideSpyProxy extends ProxyBase implements IArmatureProxy,IInsideScene {


	private touch:dragonBones.Armature;
	private screenframe1:dragonBones.Armature;
	private screenframe2:dragonBones.Armature;
	private screenframe3:dragonBones.Armature;
	private screenframe4:dragonBones.Armature;
	private screenframe20:dragonBones.Armature;
	private screenframe10:dragonBones.Armature;
	private screenframe40:dragonBones.Armature;
	private machineVoice:dragonBones.Armature;
	private spyGlassArm:dragonBones.Armature;
	private Color_clue:dragonBones.Armature;
	private Form_clue:dragonBones.Armature;
	private Taste_clue:dragonBones.Armature;
	private shootPicture:dragonBones.Armature;
	private progress:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;

		Logger.log(this, "BadGuy_christian__Scene4_InsideSpyProxy armature.animation.animationNames.toString() == "+armature.animation.animationNames.toString());
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getTouch():SpySceneTouchProxy {
		return new SpySceneTouchProxy(this.touch);
	}
	public getScreenframe1():BadGuy_christian__screenframe1Proxy {
		return new BadGuy_christian__screenframe1Proxy(this.screenframe1);
	}
	public getScreenframe2():BadGuy_christian__screenframe2Proxy {
		return new BadGuy_christian__screenframe2Proxy(this.screenframe2);
	}
	public getScreenframe3():BadGuy_christian__screenframe3Proxy {
		return new BadGuy_christian__screenframe3Proxy(this.screenframe3);
	}
	public getScreenframe4():BadGuy_christian__screenframe4Proxy {
		return new BadGuy_christian__screenframe4Proxy(this.screenframe4);
	}
	public getScreenframe20():BadGuy_christian__screenframe2Proxy {
		return new BadGuy_christian__screenframe2Proxy(this.screenframe20);
	}
	public getScreenframe10():BadGuy_christian__screenframe1Proxy {
		return new BadGuy_christian__screenframe1Proxy(this.screenframe10);
	}
	public getScreenframe40():BadGuy_christian__screenframe4Proxy {
		return new BadGuy_christian__screenframe4Proxy(this.screenframe40);
	}
	public getMachineVoice():BadGuy_christian__machineVoiceProxy {
		return new BadGuy_christian__machineVoiceProxy(this.machineVoice);
	}
	public getSpyGlassArm():BadGuy_christian__spyGlassProxy {
		return new BadGuy_christian__spyGlassProxy(this.spyGlassArm);
	}
	public getColor_clue():Color_clueProxy {
		return new Color_clueProxy(this.Color_clue);
	}
	public getForm_clue():Form_clueProxy {
		return new Form_clueProxy(this.Form_clue);
	}
	public getTaste_clue():Taste_clueProxy {
		return new Taste_clueProxy(this.Taste_clue);
	}
	public getShootPicture():ShootPictureProxy {
		return new ShootPictureProxy(this.shootPicture);
	}
	public getProgress():PolaroidProgressProxy {
		return new PolaroidProgressProxy(this.progress);
	}
	// </ Child Armatures >
	// < Animations >
	public gotoDefault():void {
		if (this._armature.animation.lastAnimationName != "default")
		{
			this._armature.animation.play("default");
		}
	}
	public gotoIntro():void {
		if (this._armature.animation.lastAnimationName != "intro") {
			this._armature.animation.play("intro");
		}
	}
	public gotoOuttro():void {
		try{
			if (this._armature.animation.lastAnimationName != "outtro") {
				this._armature.animation.play("outtro");
			}
		} catch (error) {
			Logger.log(this, "CATCH BadGuy_skaeg__Scene4_InsideSpyProxy this._armature.animation.play(outtro)");
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
