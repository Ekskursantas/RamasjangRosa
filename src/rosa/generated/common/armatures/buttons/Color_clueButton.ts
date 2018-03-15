//package dk.nozebra.rosa.generated.common.armatures.buttons
//{
//	import dk.nozebra.rosa.typeddb.events.ButtonEvent;
//
//	import dragonBones.this.armature;
//
//	import dk.nozebra.rosa.generated.SoundNames;
//	import treefortress.sound.SoundAS;
//	import starling.display.PIXI.DisplayObject;
//	import starling.events.Touch;
//	import starling.events.TouchEvent;
//	import starling.events.TouchPhase;
//	import dk.nozebra.rosa.typeddb.interfaces.IButtonProxy;
//	import dk.nozebra.rosa.generated.common.armatures.proxies.Color_clueProxy;
//	import dk.nozebra.rosa.generated.common.armatures.TypedDBFactory;

//import {Armature} from "./src.dragonBones.armature.Armature";

import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";
import {SoundNames} from "src/rosa/generated/SoundNames";

import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";

import {IButtonProxy} from "src/rosa/typeddb/interfaces/IButtonProxy";
import {Color_clueProxy} from "src/rosa/generated/common/armatures/proxies/Color_clueProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {Logger} from "src/loudmotion/utils/debug/Logger";

export class Color_clueButton extends Color_clueProxy implements IButtonProxy {
	private _selected:boolean;
	private _disabled:boolean;
	private _isToggle:boolean;
	private btn:Color_clueProxy;

	constructor(armature:dragonBones.Armature) {
		super(armature);
		this._selected = false;
		this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as Color_clueProxy;
		this.armature.display.interactive = true;
		this.armature.display.buttonMode = true;
		this.armature.display.on(TouchEvent.TOUCH, this.touchDown);
		this.armature.display.on(TouchEvent.TOUCH_END, this.touchDone);
		Logger.log(this, "Color_clueButton this.btn constructor == "+this.btn);
		Logger.log(this, "Color_clueButton this.armature constructor == "+this.armature);
	}

	public get isToggle():boolean {
		return this._isToggle;
	}
	public set isToggle(value:boolean) {
		this._isToggle = value;
	}
	public get disabled():boolean {
		return this._disabled;
	}
	public set disabled(value:boolean) {
		Logger.log(this, "Color_clueButton this.btn == "+this.btn);
		Logger.log(this, "Color_clueButton disabled == "+value);
		this._disabled = value;
		// this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as Color_clueProxy;
		if (this._disabled) {
			this.btn.gotoDisabled();
		} else {
			this.btn.gotoUp();
		}
	}
	public get selected():boolean {
		return this._selected;
	}
	public set selected(value:boolean) {
		Logger.log(this, "Color_clueButton this.btn selected == "+this.btn);
		this._selected = value;
		// this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as Color_clueProxy;
		if (!this._disabled) {
			if (this._selected) {
				this.btn.gotoDown();
			} else {
				this.btn.gotoUp();
			}
		}
	}

	private touchDown = (event:TouchEvent):void => {
		if (!this._disabled) {
			this.btn.gotoDown();
		}
	}

	private touchDone = (event:TouchEvent):void => {
		if (!this._disabled) {
			if (this._isToggle) {
				this.selected = !this._selected;
			}
			AudioPlayer.getInstance().playSound(SoundNames.UI_KLIK);
			this.btn.gotoUp();
			this.emit(ButtonEvent.CLICKED, this);
		}
	}

	private touchOut = (event:TouchEvent):void => {
		if (!this._disabled) {
			this.btn.gotoUp();
		}
	}
	// private buttonTouched(event:TouchEvent):void {
	// 	let touch:Touch = event.getTouch(this.armature.display as PIXI.DisplayObject);
	// 	if (touch) {
	// 		let btn:CharCardFrame1Proxy = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as CharCardFrame1Proxy;
	//
	// 		if (this._disabled) {
	// 			return;
	// 		}
	//
	// 		switch (touch.phase) {
	// 			case TouchPhase.BEGAN:
	// 				btn.gotoDown();
	// 				break;
	// 			case TouchPhase.ENDED:
	// 				if (this._isToggle) {
	// 					this.selected = !this._selected;
	// 				}
	//
	// 				// SoundAS.group("fx").play(SoundNames.UI_KLIK);
	// 				AudioPlayer.getInstance().playSound(SoundNames.UI_KLIK);
	//
	// 				btn.gotoUp();
	// 				this.emit(ButtonEvent.CLICKED, this);
	// 				break;
	// 		}
	// 	}
	// }

	public dispose():void {
		// this.armature.display.removeListener("TOUCH", this.buttonTouched);
		this.armature.display.off(TouchEvent.TOUCH, this.touchDown);
		this.armature.display.off(TouchEvent.TOUCH_END, this.touchDone);
	}
}
