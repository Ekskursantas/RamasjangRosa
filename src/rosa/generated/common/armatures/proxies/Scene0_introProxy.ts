
import {ProxyBase} from "src/rosa/generated/common/armatures/ProxyBase";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {FreeModeButtonProxy} from "src/rosa/generated/common/armatures/proxies/FreeModeButtonProxy";
import {StartButtonProxy} from "src/rosa/generated/common/armatures/proxies/StartButtonProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

import {Logger} from "src/loudmotion/utils/debug/Logger";

export class Scene0_introProxy extends ProxyBase implements IArmatureProxy {
	
	protected _bone:dragonBones.Armature;

	protected playButton:dragonBones.Armature;
	protected freeMode:dragonBones.Armature;

	constructor(armature:dragonBones.Armature) {
		super();
		this._armature = armature;

		Logger.log(this, "Scene0_introProxy armature.animation.animationNames.toString() == "+this._armature.animation.animationNames.toString());

		TypedDBFactory.setProxyFromDisplay(this._armature, this);

		this.setSlotChildArmature();
	}

	// < Child Armatures >
	public getFreeMode():FreeModeButtonProxy {
		return new FreeModeButtonProxy(this.freeMode);
	}
	public getPlayButton():StartButtonProxy {
		return new StartButtonProxy(this.playButton);
	}
	// </ Child Armatures >
	// < Animations >
	public gotoDefault():void {
		if (this._armature.animation.lastAnimationName != "default")
		{
			this._armature.animation.play("default");
		}
	}
    public gotoIntro(): void {
        if (this._armature.animation.lastAnimationName != "intro") {
            this._armature.animation.play("intro");
		}
	}
	public gotoOuttro():void {
		if (this._armature.animation.lastAnimationName != "outtro") {
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
		let display:PIXI.Sprite = this._armature.display as PIXI.Sprite;
		return display;
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
    public show(container: PIXI.Container): void {
        console.log("Display added: "+ this.armature);
        container.addChild(this.display);
		dragonBones.WorldClock.clock.add(this._armature);
	}
	public remove(container:PIXI.Container):void {
		if(this.display){
			container.removeChild(this.display);
		}
		if(this._armature) {
			dragonBones.WorldClock.clock.remove(this._armature);
		}
	}
}
