
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {ISpyScene} from "src/rosa/interfaces/ISpyScene";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {BadGuy_mille__caracter_milleProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_mille__caracter_milleProxy";
import {HimstregimsFuglProxy} from "src/rosa/generated/common/armatures/proxies/HimstregimsFuglProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

export class BadGuy_mille__scene3_spySceneWalk_milleProxy extends ProxyBase implements IArmatureProxy,ISpyScene {


	private character:dragonBones.Armature;
	private himstregimsFugl:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getCharacter():BadGuy_mille__caracter_milleProxy {
		return new BadGuy_mille__caracter_milleProxy(this.character);
	}
	public getHimstregimsFugl():HimstregimsFuglProxy {
		return new HimstregimsFuglProxy(this.himstregimsFugl);
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
	public gotoOutro():void {
		if (this._armature.animation.lastAnimationName != "outro")
		{
			this._armature.animation.play("outro");
		}
	}
	// </ Animations >
	// < Animations aliases >
	public gotoIdle():void {
		this.gotoDefault();
	}
	public gotoOuttro():void {
		this.gotoOutro();
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
