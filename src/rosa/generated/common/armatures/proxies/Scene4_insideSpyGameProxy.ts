
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";

import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {Color_clueProxy} from "src/rosa/generated/common/armatures/proxies/Color_clueProxy";
import {Taste_clueProxy} from "src/rosa/generated/common/armatures/proxies/Taste_clueProxy";
import {Form_clueProxy} from "src/rosa/generated/common/armatures/proxies/Form_clueProxy";
import {ShootPictureProxy} from "src/rosa/generated/common/armatures/proxies/ShootPictureProxy";
import {KyllingArmProxy} from "src/rosa/generated/common/armatures/proxies/KyllingArmProxy";
import {MouseLoopProxy} from "src/rosa/generated/common/armatures/proxies/MouseLoopProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

export class Scene4_insideSpyGameProxy extends ProxyBase implements IArmatureProxy {
	

	private Color_clue:dragonBones.Armature;
	private Taste_clue:dragonBones.Armature;
	private Form_clue:dragonBones.Armature;
	private shootPicture:dragonBones.Armature;
	private kyllingArm:dragonBones.Armature;
	private mouseLoop:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;
		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

// Child Armatures
	public getColor_clue():Color_clueProxy
	{
		return new Color_clueProxy(this.Color_clue);
	}
	public getTaste_clue():Taste_clueProxy
	{
		return new Taste_clueProxy(this.Taste_clue);
	}
	public getForm_clue():Form_clueProxy
	{
		return new Form_clueProxy(this.Form_clue);
	}
	public getShootPicture():ShootPictureProxy
	{
		return new ShootPictureProxy(this.shootPicture);
	}
	public getKyllingArm():KyllingArmProxy
	{
		return new KyllingArmProxy(this.kyllingArm);
	}
	public getMouseLoop():MouseLoopProxy
	{
		return new MouseLoopProxy(this.mouseLoop);
	}
	// Animations
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
	public show(container:PIXI.Container):void{
		container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void{
		container.removeChild(this.display);
		dragonBones.WorldClock.clock.remove(this._armature);
	}
}
