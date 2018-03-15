
import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {SceneEvent} from "src/rosa/events/SceneEvent";

import {ISceneView} from "src/rosa/view/ISceneView";
import {Scene8b_cakeInOutOvenProxy} from "src/rosa/generated/common/armatures/proxies/Scene8b_cakeInOutOvenProxy";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {Model} from "src/rosa/model/Model";
import {MainView} from "src/rosa/view/MainView";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import Sprite = PIXI.Sprite;
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";

export class Scene_09_OvenView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;
	private _background:Sprite;

	private _ovenScene:Scene8b_cakeInOutOvenProxy;

	constructor(){
		super();
		this.name = "Scene_09_OvenView";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;
		AssetLoader.getInstance().loadAdditional("Scene8_bg", this.setupContinued);
	}

	public setupContinued = ():void => {
		Logger.log(this, "Scene_09_OvenView setupContinued");
		this._background = PIXI.Sprite.fromFrame(Backgrounds.SCENE8_BG);
		this.addChild(this._background);
		this._ovenScene = this._typeddb.buildScene8b_cakeInOutOvenArmature();
		this._ovenScene.show(this);
		this._ovenScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.SOUND_EVENT, this.playDBSound, this);
		this._ovenScene.display.x = 0;
		this._ovenScene.display.y = 0;
		this._ovenScene.gotoDefault();

		this.on(TouchEvent.TOUCH_END, this.onTouchDone);
	}

	private playDBSound = (event:dragonBones.EventObject):void => {
		try{
			AudioPlayer.getInstance().playSound(event.name);
		} catch (error) {
			Logger.log(this, "ERROR : sound : playDBSound");
		}
	}

	private onTouchDone = (event:TouchEvent):void => {
		switch (this._ovenScene.armature.animation.lastAnimationName) {
			case "default":
				this._ovenScene.gotoIntro();
				break;
			case "intro":
				this._ovenScene.gotoSetClock();
				break;
			case "setClock":
				this._ovenScene.gotoPause();
				break;
			case "ready":
				this.playOutro();
				break;
		}
	}

	private playOutro():void {
		this._ovenScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this._ovenScene.gotoOuttro();
	}

	private proceed = (event:dragonBones.EventObject):void => {
		this._ovenScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);

		setTimeout(() => this.emit(SceneEvent.NEXT, sceneEvent), 2000); // long pause for sound to complete
	}


	public teardown():void {
		this.off(TouchEvent.TOUCH_END, this.onTouchDone);

		if(this._ovenScene != null) {
			this._ovenScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.SOUND_EVENT, this.playDBSound, this);
			this._ovenScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
			this._ovenScene.remove(this);
		}

		if(this._background != null) {
			this.removeChild(this._background);
			this._background = null;
		}
		AssetLoader.getInstance().removeTexture(Backgrounds.SCENE8_BG, true);
	}
}
