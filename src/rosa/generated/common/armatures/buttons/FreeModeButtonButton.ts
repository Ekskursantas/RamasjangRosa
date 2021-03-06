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
//	import dk.nozebra.rosa.generated.common.armatures.proxies.FreeModeButtonProxy;
//	import dk.nozebra.rosa.generated.common.armatures.TypedDBFactory;

//import {Armature} from "./src.dragonBones.armature.Armature";

import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";
import {SoundNames} from "src/rosa/generated/SoundNames";

import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";

import {IButtonProxy} from "src/rosa/typeddb/interfaces/IButtonProxy";
import {FreeModeButtonProxy} from "src/rosa/generated/common/armatures/proxies/FreeModeButtonProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {Logger} from "src/loudmotion/utils/debug/Logger";
import DisplayObject = PIXI.DisplayObject;

export class FreeModeButtonButton extends FreeModeButtonProxy implements IButtonProxy {
	private _selected:boolean;
	private _disabled:boolean;
	private _isToggle:boolean;
	private btn:FreeModeButtonProxy;

	constructor(armature:dragonBones.Armature) {
		super(armature);
		this._selected = false;
		this.name = "FreeModeButtonButton";
		// armature.display.addListener("TOUCH", this.buttonTouched);
		this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as FreeModeButtonProxy;
		this.armature.display.interactive = true;
		this.armature.display.buttonMode = true;
		// this.armature.display.on(ButtonEvent.CLICKED, this.buttonTouched);
		this.armature.display.on(TouchEvent.TOUCH, this.touchDown);
		this.armature.display.on(TouchEvent.TOUCH_END, this.touchDone);
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
		this._disabled = value;
		this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as FreeModeButtonProxy;
		Logger.log(this, "FreeModeButtonButton set disabled this.btn == "+this.btn+" : this._disabled == "+this._disabled);
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
		this._selected = value;
		this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as FreeModeButtonProxy;
		if (this._selected) {
			this.btn.gotoDown();
		} else {
			this.btn.gotoUp();
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
	// 	let touch:DisplayObject = event.currentTarget;
	// 	Logger.log(this, "FreeModeButtonButton  buttonTouched     touch == "+touch+" : touch.name == "+touch.name+" : event.type == "+event.type);
	// 	if (touch) {
	// 		let btn:FreeModeButtonProxy = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as FreeModeButtonProxy;
    //
	// 		if (this._disabled) {
	// 			return;
	// 		}
    //
	// 		switch (event.type) {
	// 			case TouchPhase.BEGAN:
	// 				btn.gotoDown();
	// 				break;
	// 			case TouchPhase.ENDED:
	// 				if (this._isToggle) {
	// 					this.selected = !this._selected;
	// 				}
    //
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
