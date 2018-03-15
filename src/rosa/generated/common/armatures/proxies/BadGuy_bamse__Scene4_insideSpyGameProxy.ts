

import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {WhiteBrushProxy} from "src/rosa/generated/common/armatures/proxies/WhiteBrushProxy";
import {BadGuy_bamse__mouseLoopProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_bamse__mouseLoopProxy";
import {BadGuy_bamse__kyllingArmProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_bamse__kyllingArmProxy";
import {Color_clueProxy} from "src/rosa/generated/common/armatures/proxies/Color_clueProxy";
import {Form_clueProxy} from "src/rosa/generated/common/armatures/proxies/Form_clueProxy";
import {Taste_clueProxy} from "src/rosa/generated/common/armatures/proxies/Taste_clueProxy";
import {PolaroidProgressProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProgressProxy";
import {ShootPictureProxy} from "src/rosa/generated/common/armatures/proxies/ShootPictureProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";


export class BadGuy_bamse__Scene4_insideSpyGameProxy extends ProxyBase implements IArmatureProxy {


	private shootPicture:dragonBones.Armature;
	private progress:dragonBones.Armature;
	private Taste_clue:dragonBones.Armature;
	private Form_clue:dragonBones.Armature;
	private Color_clue:dragonBones.Armature;
	private kyllingArm:dragonBones.Armature;
	private mouseLoop:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);
		this.setSlotChildArmature();
	}

	// Child Armatures
	public getShootPicture():ShootPictureProxy {
		return new ShootPictureProxy(this.shootPicture);
	}
	public getProgress():PolaroidProgressProxy {
		return new PolaroidProgressProxy(this.progress);
	}
	public getTaste_clue():Taste_clueProxy {
		return new Taste_clueProxy(this.Taste_clue);
	}
	public getForm_clue():Form_clueProxy {
		return new Form_clueProxy(this.Form_clue);
	}
	public getColor_clue():Color_clueProxy {
		return new Color_clueProxy(this.Color_clue);
	}
	public getKyllingArm():BadGuy_bamse__kyllingArmProxy {
		return new BadGuy_bamse__kyllingArmProxy(this.kyllingArm);
	}
	public getMouseLoop():BadGuy_bamse__mouseLoopProxy {
		return new BadGuy_bamse__mouseLoopProxy(this.mouseLoop);
	}
	// Animations
	public gotoDefault():void {
		if (this._armature.animation.lastAnimationName != "idle")
		{
			this._armature.animation.play("idle");
		}
	}
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
			//slot.display.dispose();
			slot.display = newDisplay;
		}
		else
		{
			throw new Error("You cannot change display of armature containing more than one bone!")
		}
	}
	public show(container:PIXI.Container):void{
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void{
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
