
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {ISpyScene} from "src/rosa/interfaces/ISpyScene";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {BadGuy_skaeg__caracterProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_skaeg__caracterProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class BadGuy_skaeg__scene3_spySceneWalk_skaegProxy extends ProxyBase implements IArmatureProxy,ISpyScene {


	private character:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;

		Logger.log(this, "BadGuy_skaeg__scene3_spySceneWalk_skaegProxy armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());

		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getCharacter():BadGuy_skaeg__caracterProxy {
		Logger.log(this, "BadGuy_skaeg__scene3_spySceneWalk_skaegProxy getCharacter this.character == "+this.character);
		return new BadGuy_skaeg__caracterProxy(this.character);
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
	public show(container:PIXI.Container):void {
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void {
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
