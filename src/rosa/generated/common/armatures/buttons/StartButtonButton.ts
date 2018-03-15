

import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";
import {SoundNames} from "src/rosa/generated/SoundNames";

import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";

import {IButtonProxy} from "src/rosa/typeddb/interfaces/IButtonProxy";
import {StartButtonProxy} from "src/rosa/generated/common/armatures/proxies/StartButtonProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {Logger} from "src/loudmotion/utils/debug/Logger";
import DisplayObject = PIXI.DisplayObject;
import {SceneEvent} from "../../../../events/SceneEvent";
import Graphics = PIXI.Graphics;
import {SceneBase} from "../../../../view/scenes/SceneBase";

export class StartButtonButton extends StartButtonProxy implements IButtonProxy {
	private _selected:boolean;
	private _disabled:boolean;
	private _isToggle:boolean;
	private btn:StartButtonProxy;


	constructor(armature:dragonBones.Armature=null) {
		super(armature);
		this._selected = false;
		this.name = "StartButtonButton";
		this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as StartButtonProxy;
		Logger.log(this, "StartButtonButton constructor this.btn == "+this.btn+" : this._disabled == "+this._disabled);
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
		this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as StartButtonProxy;
		Logger.log(this, "StartButtonButton set disabled this.btn == "+this.btn+" : this._disabled == "+this._disabled);
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
		this.btn = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as StartButtonProxy;
		Logger.log(this, "StartButtonButton set selected this.btn == "+this.btn+" : this._selected == "+this._selected);
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
	// private buttonTouched(event: PIXI.interaction.InteractionEvent):void {
	// 	Logger.log(this, "StartButtonButton  buttonTouched");
	// 	Logger.log(this, "StartButtonButton  buttonTouched  event.currentTarget === "+event.currentTarget);
	// 	let touch:DisplayObject = event.currentTarget;
	// 	Logger.log(this, "StartButtonButton  buttonTouched     touch == "+touch+" : touch.name == "+touch.name+" : event.type == "+event.type);
	// 	if (touch) {
	// 		let btn:StartButtonProxy = TypedDBFactory.getProxyFromDisplay(this.armature.display as PIXI.DisplayObject) as StartButtonProxy;
    //
	// 		if (this._disabled) {
	// 			return;
	// 		}
    //
	// 		switch (event.type) {
	// 			case "touchstart":
	// 			case "mousedown":
	// 				btn.gotoDown();
	// 				break;
	// 			case "touchend":
	// 			case "mouseup":
	// 				if (this._isToggle) {
	// 					this.selected = !this._selected;
	// 				}
    //
	// 				// SoundAS.group("fx").play(SoundNames.UI_KLIK);
	// 				AudioPlayer.getInstance().playSound(SoundNames.UI_KLIK);
    //
	// 				btn.gotoUp();
	// 				// this.emit(ButtonEvent.CLICKED, this);
	// 				this.emit(SceneEvent.REPLAY_STORY);
	// 				break;
	// 		}
    //
	// 		// switch (event.) {
	// 		// 	case TouchPhase.BEGAN:
	// 		// 		btn.gotoDown();
	// 		// 		break;
	// 		// 	case TouchPhase.ENDED:
	// 		// 		if (this._isToggle) {
	// 		// 			this.selected = !this._selected;
	// 		// 		}
     //        //
	// 		// 		// SoundAS.group("fx").play(SoundNames.UI_KLIK);
	// 		// 		AudioPlayer.getInstance().playSound(SoundNames.UI_KLIK);
     //        //
	// 		// 		btn.gotoUp();
	// 		// 		this.emit(ButtonEvent.CLICKED, this);
	// 		// 		break;
	// 		// }
	// 	}
	// }


	public dispose():void {
		// this.armature.display.off(TouchEvent.TOUCH, this.touchDown);
		// this.armature.display.off(TouchEvent.TOUCH_END, this.touchDone);

		this.armature.display.off(TouchEvent.TOUCH, this.touchDown);
		this.armature.display.off(TouchEvent.TOUCH_END, this.touchDone);
	}
}
