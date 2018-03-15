

import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {ISceneView} from "src/rosa/view/ISceneView";
import {SceneEvent} from "src/rosa/events/SceneEvent";
import {Scene0_introProxy} from "src/rosa/generated/common/armatures/proxies/Scene0_introProxy";
import {StartButtonButton} from "src/rosa/generated/common/armatures/buttons/StartButtonButton";
import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {FreeModeButtonButton} from "src/rosa/generated/common/armatures/buttons/FreeModeButtonButton";

import {Model} from "src/rosa/model/Model";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {MainView} from "../MainView";
import Sprite = PIXI.Sprite;
import {BackBtn} from "../buttons/BackBtn";






export class Scene_01_IntroView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;
	private background:Sprite;
	private introScene:Scene0_introProxy;
	// private introScene:any;
	private playButton:StartButtonButton;
	private freeButton:FreeModeButtonButton;



	constructor() {
		super();
		this.name = "Scene_01_IntroView";
	}

	public setup(typeddb:TypedDBFactory):void {
		Logger.log(this, "Scene_01_IntroView  setup  typeddb == "+typeddb);
		Model.getInstance().reset();

		this._typeddb = typeddb;



		// this.background = new Image(AssetLoader.assets.getTexture(Backgrounds.SCENE0_BG));

		this.background = Sprite.fromFrame(Backgrounds.SCENE0_BG);
		this.stage.addChild(this.background);

		this.introScene = this._typeddb.buildScene0_introArmature();
		this.introScene.display.x = 0;
		this.introScene.display.y = 0;
		this.introScene.display.visible = false;
		this.introScene.show(this);

		// this.introScene.gotoDefault(); //TODO Orig : Non-existent animation. DragonBones name: skeleton Armature name: scene0_intro Animation name: default

		Logger.log(this, "Scene_01_IntroView  setup  this.introScene == "+this.introScene);
		// Logger.log(this, "Scene_01_IntroView  setup  this.introScene.getPlayButton() == "+this.introScene.getPlayButton());
		// Logger.log(this, "Scene_01_IntroView  setup  this.introScene.getPlayButton().armature == "+this.introScene.getPlayButton().armature);

		this.playButton = new StartButtonButton(this.introScene.getPlayButton().armature);
		this.freeButton = new FreeModeButtonButton(this.introScene.getFreeMode().armature);

		this.playButton.on(ButtonEvent.CLICKED, this.onPlayButtonClicked);
		this.freeButton.on(ButtonEvent.CLICKED, this.onFreeButtonClicked);

		Logger.log(this, "Scene_01_IntroView  this.playButton === "+this.playButton);

		Model.currentTimeout = setTimeout(() => this.gotoIntro(), 1000);
	}

	private gotoIntro = ():void => {
		Logger.log(this, "Scene_01_IntroView  gotoIntro");

		// this.introScene.show(AssetLoader.getInstance().stage);
		this.introScene.display.visible = true;
		this.introScene.gotoIntro();
	}

	//private onPlayButtonClicked(event:ButtonEvent):void{
	private onPlayButtonClicked = (event:ButtonEvent):void => {
		Logger.log(this, "Scene_01_IntroView  onPlayButtonClicked");
		Model.getInstance().gameMode = Model.MODE_STORY;

		// dont fade. Let is continue.
		// SoundAS.group("music").fadeTo(Model.MUSIC_ROSA_HYGGE, Model.VOLUME_MUSIC, 1000, true);
		// AudioPlayer.getInstance().playSound(Model.MUSIC_ROSA_HYGGE, 1000, Model.VOLUME_MUSIC);
		AudioPlayer.getInstance().changeMusicVolume(Model.VOLUME_MUSIC_LOW);

		this.playOutroNext();
	}

	//private onFreeButtonClicked(event:ButtonEvent):void{}
	private onFreeButtonClicked = (event:ButtonEvent):void => {
		Logger.log(this, "Scene_01_IntroView  onFreeButtonClicked");
		Model.getInstance().gameMode = Model.MODE_FREE;
		this.playOutroJump();
	}

	private playOutroNext():void {
		Logger.log(this, "Scene_01_IntroView  playOutroNext");
		this.introScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this.introScene.gotoOuttro();
	}

	private playOutroJump():void {
		this.introScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.jumpToPhotos, this);
		this.introScene.gotoOuttro();
	}

	//private proceed(event:dragonBones.EventObject):void {
	private proceed = (event:dragonBones.EventObject):void => {
		Logger.log(this, "Scene_01_IntroView  proceed");
		this.introScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		// this.introScene.armature.removeEventListener(dragonBones.EventObject.COMPLETE, this.proceed, this); //TODO Orig
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);
		// dispatchEvent(sceneEvent); //TODO
	}

	//private jumpToPhotos(event:dragonBones.EventObject):void {
	private jumpToPhotos = (event:dragonBones.EventObject):void => {
		// this.introScene.armature.removeEventListener(dragonBones.EventObject.COMPLETE, this.jumpToPhotos, this);
		this.introScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.jumpToPhotos, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.JUMP, Model.SCENE_PRESENT_CLUES, true);
		this.emit(SceneEvent.JUMP, sceneEvent);
		// dispatchEvent(sceneEvent);// TODO
	}

	private destroyApp = ():void => {
		this.emit(SceneEvent.QUIT_APP);
	}

	public teardown():void {
		Logger.log(this, "Scene_01_IntroView  teardown");
		if(this.playButton != null){
			this.playButton.off(ButtonEvent.CLICKED, this.onPlayButtonClicked);
			this.playButton.dispose();
			this.playButton = null;
		}
		if(this.freeButton != null) {
			this.freeButton.off(ButtonEvent.CLICKED, this.onFreeButtonClicked);
			this.freeButton.dispose();
			this.freeButton = null;
		}

		if(this.introScene != null) {
			try{
				this.introScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
			} catch (Error) {
			}
			try{
				this.introScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.jumpToPhotos, this);
			} catch (Error) {
			}
			try{
				this.introScene.remove(this);
			} catch (Error) {
			}
		}

		if(this.background != null) {
			this.stage.removeChild(this.background);
			this.background = null;
		}

	}
}
