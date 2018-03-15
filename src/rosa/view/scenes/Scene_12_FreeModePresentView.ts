

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";
import {SceneEvent} from "src/rosa/events/SceneEvent";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {ISceneView} from "src/rosa/view/ISceneView";
import {Scene12_freemodeProxy} from "src/rosa/generated/common/armatures/proxies/Scene12_freemodeProxy";

import {NextArrowButton} from "src/rosa/generated/common/armatures/buttons/NextArrowButton";
import {ReplayButtonButton} from "src/rosa/generated/common/armatures/buttons/ReplayButtonButton";
import {FreeModeButtonButton} from "src/rosa/generated/common/armatures/buttons/FreeModeButtonButton";

import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {Model} from "src/rosa/model/Model";
import {MainView} from "src/rosa/view/MainView";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import Sprite = PIXI.Sprite;
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";

export class Scene_12_FreeModePresentView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;
    private cake: Sprite;
	private _background:PIXI.Sprite; // TODO was // private _background:PIXI.Sprite;
	private backgroundName:string;

	private _presentScene:Scene12_freemodeProxy;
	private replayButton:ReplayButtonButton;
	private freeButton:FreeModeButtonButton;
	private cameraButton:FreeModeButtonButton;
	private nextButton:NextArrowButton;

	private form:Sprite;
	private smag:Sprite;
	private farve:Sprite;


	constructor(){
		super();
		this.name = "Scene_12_FreeModePresentView";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;
		this.setup_cont();
	}

	public setup_cont():void {
		Logger.log(this, "Scene_12_FreeModePresentView setup_cont");
		this._presentScene = this._typeddb.buildScene12_freemodeArmature();

		//this._presentScene.getPlaceholder().display = Model.getInstance().cake;

        this.cake = Model.getInstance().cake;
        this.cake.x = 416;
        this.cake.y = 137;
        this._presentScene.getPlaceholder().display.addChild(this.cake);
        this._presentScene.display.x = 0;
        this._presentScene.display.y = 0;
		this._presentScene.gotoIntro();
		this._presentScene.show(this);

		this.setPolaroidImages();

		this.replayButton = new ReplayButtonButton(this._presentScene.getReplayButton().armature);
		this.freeButton = new FreeModeButtonButton(this._presentScene.getFreeModeButton().armature);
		this.cameraButton = new FreeModeButtonButton(this._presentScene.getCamButton().armature);
		this.nextButton = new NextArrowButton(this._presentScene.getNextArrow().armature);

		this.replayButton.on(ButtonEvent.CLICKED, this.onPlayButtonClicked);
		this.freeButton.on(ButtonEvent.CLICKED, this.onFreeButtonClicked);
		this.cameraButton.on(ButtonEvent.CLICKED, this.onCameraButtonClicked);
		this.nextButton.on(ButtonEvent.CLICKED, this.onNextButtonClicked);

		this._presentScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
		this._presentScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.SOUND_EVENT, this.playDBSound, this);
		this._presentScene.gotoIntro();
	}

	private playDBSound = (event:dragonBones.EventObject):void => {
		try{
			AudioPlayer.getInstance().playSound(event.name);
		} catch (error) {
			Logger.log(this, "ERROR : sound : playDBSound");
		}
	}

	private afterIntro = (event:dragonBones.EventObject):void => {
		this._presentScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
		setTimeout(() => this.setPolaroidImages(), 100);
	}

	private setPolaroidImages = ():void => {
		Logger.log(this, "Scene_12_FreeModePresentView setPolaroidImages");

		if (Model.getInstance().snapShots[0] != null) {
			this.form = new PIXI.Sprite();
			this.form.addChild(Model.getInstance().snapShots[0]);
			this._presentScene.getPolaorid0().get_placeholder().display = this.form;
		}

		if (Model.getInstance().snapShots[1] != null) {
			this.smag = new PIXI.Sprite();
			this.smag.addChild(Model.getInstance().snapShots[1]);
			this._presentScene.getPolaorid1().get_placeholder().display = this.smag;
		}

		if (Model.getInstance().snapShots[2] != null) {
			this.farve = new PIXI.Sprite();
			this.farve.addChild(Model.getInstance().snapShots[2]);
			this._presentScene.getPolaorid2().get_placeholder().display = this.farve;
		}

		this._presentScene.getPolaorid0().gotoSmag();
		this._presentScene.getPolaorid1().gotoForm();
		this._presentScene.getPolaorid2().gotoFarve();
	}

	private onPlayButtonClicked = (event:ButtonEvent):void => {
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.REPLAY_STORY, 0, true);
		this.emit(SceneEvent.REPLAY_STORY, sceneEvent);
	}

	//private onFreeButtonClicked(event:ButtonEvent):void {
	private onFreeButtonClicked = (event:ButtonEvent):void => {
		// let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.REPLAY_FREEMODE, 0, true);
		// dispatchEvent(sceneEvent); //TODO
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.REPLAY_FREEMODE, 0, true);
		this.emit(SceneEvent.REPLAY_FREEMODE, sceneEvent);
	}

	//private onCameraButtonClicked(event:ButtonEvent):void {
	private onCameraButtonClicked = (event:ButtonEvent):void => {
		let i:number = 1;
		this.setTextureOnPolariod("");
		// this._presentScene.armature.addEventListener(dragonBones.EventObject.COMPLETE, this.onShootAnimCompleted, this);
		this._presentScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.onShootAnimCompleted, this);
		this._presentScene.gotoShoot();
	}

	//private onNextButtonClicked(event:ButtonEvent):void {
	private onNextButtonClicked = (event:ButtonEvent):void => {
		Logger.log(this, "Scene_12_FreeModePresentView onNextButtonClicked");
		this._presentScene.gotoButton();
	}

	//private onShootAnimCompleted(event:dragonBones.EventObject):void {
	private onShootAnimCompleted = (event:dragonBones.EventObject):void => {
		// this._presentScene.armature.removeEventListener(dragonBones.EventObject.COMPLETE, this.onShootAnimCompleted, this);
		this._presentScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.onShootAnimCompleted, this);
		this.takeSnapShot();
		TweenLite.delayedCall(1, this.showReplayButtons);
	}

	private setTextureOnPolariod(id:string):void {
		this._presentScene.getShootPicture().gotoDefault();
		this._presentScene.getShootPicture().getPolaoridImg().get_placeholder().display.addChild(this._typeddb.buildDefaultCakeArmArmature().display);
		this._presentScene.getShootPicture().getPolaoridImg().gotoFreemode();
		this._presentScene.getShootPicture().gotoAnimation();
	}

	private showReplayButtons = ():void => {
		Logger.log(this, "Scene_12_FreeModePresentView showReplayButtons");
		// this._presentScene.gotoButton();
	}

	private takeSnapShot():void {
		Logger.log(this, "Scene_12_FreeModePresentView takeSnapShot");
		// Take shot to camera roll
		// if (CameraRoll.supportsAddBitmapData) { //TODO
		// 	let cameraroll:CameraRoll = new CameraRoll();
		// 	cameraroll.addBitmapData(this.copyStageAsBitmapData());
		// } else {
		// 	this.saveBitmap(this.copyStageAsBitmapData());
		// 	Logger.log(this, "CameraRoll isn't supported.");
		// }
	}

	public static copyStageAsBitmapData(scl:Number=1.0):Sprite {
		Logger.log(this, "Scene_12_FreeModePresentView copyStageAsBitmapData");

		// let offset:number = StarlingHelper.leftXOffsetVirtual;
		// // let stageWidth:number = Starling.current.nativeStage.stageWidth;
		// // let stageHeight:number = Starling.current.nativeStage.stageHeight;
		//
		// let stageWidth:number = AssetLoader.getInstance().stage.stageWidth;
		// let stageHeight:number = AssetLoader.getInstance().stage.stageHeight;
		//
		// // let stage:Stage = Starling.current.stage;
		// let stage:PIXI.Container = AssetLoader.getInstance().stage;
		// // let viewport:PIXI.Rectangle = Starling.current.viewPort;
		// let viewport:PIXI.Rectangle = Starling.current.viewPort; //TODO
		//
		// let rs:RenderSupport = new RenderSupport();
		//
		// rs.clear();
		// rs.scaleMatrix(scl, scl);
		// rs.setOrthographicProjection(StarlingHelper.leftXOffsetVirtual, 0, AssetLoader.STAGE_WIDTH - (StarlingHelper.leftXOffsetVirtual * 2), AssetLoader.STAGE_HEIGHT);
		//
		// stage.render(rs, 1.0);
		// rs.finishQuadBatch();
		//
		// let outBmp:BitmapData = new BitmapData(stageWidth, stageHeight, true);
		// Starling.context.drawToBitmapData(outBmp);

		let outBmp:Sprite;
		return outBmp;
	}

	public static saveBitmap(bmd:Sprite):void {
		Logger.log(this, "Scene_12_FreeModePresentView saveBitmap");

		// let f:File = File.documentsDirectory.resolvePath("cake.jpg"); //TODO
		// let stream:FileStream = new FileStream();
		// stream.open(f, FileMode.WRITE);
		// let bytes:ByteArray = new ByteArray();
		// bytes = bmd.encode(bmd.rect, new JPEGEncoderOptions(100), bytes);
		// stream.writeBytes(bytes,0,bytes.bytesAvailable);
		// stream.close();
	}


	public teardown():void {
		Logger.log(this, "Scene_12_FreeModePresentView teardown");
		if(this.replayButton != null) {
			this.replayButton.off(ButtonEvent.CLICKED, this.onPlayButtonClicked);
			this.replayButton.dispose();
		}
		if(this.freeButton != null) {
			this.freeButton.off(ButtonEvent.CLICKED, this.onFreeButtonClicked);
			this.freeButton.dispose();
		}

		if(this.cameraButton != null) {
			this.cameraButton.off(ButtonEvent.CLICKED, this.onFreeButtonClicked);
			this.cameraButton.dispose();
		}

		if(this.nextButton != null) {
			this.nextButton.off(ButtonEvent.CLICKED, this.onFreeButtonClicked);
			this.nextButton.dispose();
		}

		if(this._presentScene != null) {
			this._presentScene.remove(this);
			this._presentScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.onShootAnimCompleted, this);
			this._presentScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
			this._presentScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.SOUND_EVENT, this.playDBSound, this);
		}

		if(this.smag != null) {
			this.smag.removeChildren();
			this.smag = null;
		}
		if(this.form != null) {
			this.form.removeChildren();
			this.form = null;
		}
		if(this.farve != null) {
			this.farve.removeChildren();
			this.farve = null;
		}
	}
}
