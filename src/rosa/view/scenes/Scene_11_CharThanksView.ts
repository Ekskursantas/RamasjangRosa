

import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";
import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";
import {SceneEvent} from "src/rosa/events/SceneEvent";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {ISceneView} from "src/rosa/view/ISceneView";
import {Scene11_caracterThanksProxy} from "src/rosa/generated/common/armatures/proxies/Scene11_caracterThanksProxy";

import {ReplayButtonButton} from "src/rosa/generated/common/armatures/buttons/ReplayButtonButton";
import {FreeModeButtonButton} from "src/rosa/generated/common/armatures/buttons/FreeModeButtonButton";

import {Model} from "src/rosa/model/Model";
import {MainView} from "src/rosa/view/MainView";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";

export class Scene_11_CharThanksView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;
	private _background:PIXI.Sprite;
	private backgroundName:string;

	private replayButton:ReplayButtonButton;
	private freeButton:FreeModeButtonButton;

	private _thanksScene:Scene11_caracterThanksProxy;

	constructor() {
		super();
		this.name = "Scene_11_CharThanksView";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;

		this.backgroundName = "Scene4" + "_" + Model.getInstance().getSelectedCharName() + "_bg";
		this._background = PIXI.Sprite.fromFrame(this.backgroundName);
		this.addChild(this._background);

		this._thanksScene = this._typeddb.buildScene11_caracterThanksArmature();
		this._thanksScene.display.x = 0;
		this._thanksScene.display.y = 0;
		this._thanksScene.gotoIntro();
		this._thanksScene.show(this);

		this.replayButton = new ReplayButtonButton(this._thanksScene.getReplayButton().armature);
		this.freeButton = new FreeModeButtonButton(this._thanksScene.getFreeModeButton().armature);

		this.replayButton.on(ButtonEvent.CLICKED, this.onPlayButtonClicked);
		this.freeButton.on(ButtonEvent.CLICKED, this.onFreeButtonClicked);

		setTimeout(() => this.setup_cont(), 100);
	}

	public setup_cont():void {
		switch (Model.getInstance().selectedChar) {
			case Model.CHAR_CHRISTIAN:
				this._thanksScene.getCaracter().gotoChristian();
				this._thanksScene.getDoorBellBg().gotoChristian();
				TweenLite.delayedCall(2, this.fadeToBlack);
				TweenLite.delayedCall(3, this.showButtons);

				this._thanksScene.getCaracter().getCaracter().getHead().gotoTalk();
				AudioPlayer.getInstance().playSound(SoundNames.S11_CHRISTIAN_THANKS);

				break;
			case Model.CHAR_BAMSE:
				this._thanksScene.getCaracter().gotoBamse();
				this._thanksScene.getDoorBellBg().gotoBamse();
				TweenLite.delayedCall(2, this.fadeToBlack);
				TweenLite.delayedCall(3, this.showButtons);

				AudioPlayer.getInstance().playSound(SoundNames.S11_BAMSE_THANKS);
				break;
			case Model.CHAR_SKAEG:
				this._thanksScene.getCaracter().gotoSkaeg();
				this._thanksScene.getDoorBellBg().gotoSkaeg();
				TweenLite.delayedCall(2, this.fadeToBlack);
				TweenLite.delayedCall(3, this.showButtons);
				this._thanksScene.getCaracter().getCaracter().getHead().gotoTalk();

				AudioPlayer.getInstance().playSound(SoundNames.S11_02_SKAEG_SPEAKS_SKAL_VI_IKKE_SMAGE_PAA_KAGEN);
				break;
			// case Model.CHAR_MILLE:
			// 	this._thanksScene.getCaracter().gotoMille();
			// 	this._thanksScene.getDoorBellBg().gotoMille();
			// 	TweenLite.delayedCall(2, this.fadeToBlack);
			// 	TweenLite.delayedCall(3, this.showButtons);
			// 	this._thanksScene.getCaracter().getCaracter().getHead().gotoTalk();
            //
			// 	// SoundAS.group("speak").play(SoundNames.S11_2_MILLE_SPEAKS_MEGASJOV_KAGE);
			// 	AudioPlayer.getInstance().playSound(SoundNames.S11_2_MILLE_SPEAKS_MEGASJOV_KAGE);
			// 	break;
		}
	}

	private fadeToBlack = ():void => {
		this._thanksScene.gotoFadeToBlack();
	}

	private showButtons = ():void => {
		switch (Model.getInstance().selectedChar){
			case Model.CHAR_CHRISTIAN:
			case Model.CHAR_SKAEG:
			case Model.CHAR_BAMSE:
				this._thanksScene.getCaracter().getCaracter().getHead().gotoIdle();
				break;
			// case Model.CHAR_MILLE:
			// 	this._thanksScene.getCaracter().getCaracter().getHead().gotoIdle();
		}

		this._thanksScene.gotoReplay();
	}

	private onPlayButtonClicked = (event:ButtonEvent):void => {
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.REPLAY_STORY, 0, true);
		this.emit(SceneEvent.REPLAY_STORY, sceneEvent);
	}

	private onFreeButtonClicked = (event:ButtonEvent):void => {
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.REPLAY_FREEMODE, 0, true);
		this.emit(SceneEvent.REPLAY_FREEMODE, sceneEvent);
	}

	public teardown():void {
		if(this.replayButton != null) {
			this.replayButton.off(ButtonEvent.CLICKED, this.onPlayButtonClicked);
			this.freeButton.dispose();
		}
		if(this.freeButton != null) {
			this.freeButton.off(ButtonEvent.CLICKED, this.onFreeButtonClicked);
			this.replayButton.dispose();
		}

		if(this._thanksScene != null) {
			this._thanksScene.remove(this);
		}

		if(this._background != null) {
			this.removeChild(this._background);
			this._background = null;
		}
	}
}
