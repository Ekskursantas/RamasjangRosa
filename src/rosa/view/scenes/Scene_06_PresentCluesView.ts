
import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";
import {CameraShot} from "src/rosa/components/CameraShot";
import {SceneEvent} from "src/rosa/events/SceneEvent";

import {ISceneView} from "src/rosa/view/ISceneView";
import {Scene5_picturesProxy} from "src/rosa/generated/common/armatures/proxies/Scene5_picturesProxy";
import {NextArrowButton} from "src/rosa/generated/common/armatures/buttons/NextArrowButton";
import {Model} from "src/rosa/model/Model";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {MainView} from "src/rosa/view/MainView";
import {Logger} from "src/loudmotion/utils/debug/Logger";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";
import Sprite = PIXI.Sprite;
import Graphics = PIXI.Graphics;
import DisplayObject = PIXI.DisplayObject;
import {PolaroidProxy} from "../../generated/common/armatures/proxies/PolaroidProxy";


export class Scene_06_PresentCluesView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;

	private _pinkBackgroundQuad:Graphics;
	private _brownBackgroundQuad:Graphics;

	private _presentCluesScene:Scene5_picturesProxy;

	private cameraShot:CameraShot;

	private _index:number;
	private _numberOfPhotosTaken:number = 0;

	private proceedButton:NextArrowButton;
	private snap:Sprite;
	private smag:Sprite;
	private form:Sprite;
	private farve:Sprite;

	private getPolaorid0:PolaroidProxy;
	private getPolaorid1:PolaroidProxy;
	private getPolaorid2:PolaroidProxy;


	constructor() {
		super();
		this.name = "Scene_06_PresentCluesView";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;

		// clear old photos
		Model.getInstance().resetSnapshots();

		this._brownBackgroundQuad = new Graphics();
		this._brownBackgroundQuad.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
		this._brownBackgroundQuad.beginFill(0x49301D);
		this.addChild(this._brownBackgroundQuad);

		this._pinkBackgroundQuad = new Graphics();
		this._pinkBackgroundQuad.drawRect(0, 0, 1028, 768);
		this._pinkBackgroundQuad.beginFill(0xC02E31);
		this._pinkBackgroundQuad.x = 168;
		this.addChild(this._pinkBackgroundQuad); //TODO

		this._presentCluesScene = this._typeddb.buildScene5_picturesArmature();

		this._presentCluesScene.display.x = 0;
		this._presentCluesScene.display.y = 0;
		this._presentCluesScene.show(this);

		this.getPolaorid0 = this._presentCluesScene.getPolaorid0();
		this.getPolaorid1 = this._presentCluesScene.getPolaorid1();
		this.getPolaorid2 = this._presentCluesScene.getPolaorid2();

		if (Model.getInstance().gameMode == Model.MODE_STORY) {
			this.setPolaroidImages();
		} else {
			// FREEMODE
			this.setPolaroidImagesSnapshots();

			this.getPolaorid0.display.on(TouchEvent.TOUCH_END, this.handleSnap0Touched);
			this.getPolaorid1.display.on(TouchEvent.TOUCH_END, this.handleSnap1Touched);
			this.getPolaorid2.display.on(TouchEvent.TOUCH_END, this.handleSnap2Touched);
		}

		// SoundAS.group("music").stopAll(); //TODO
		// SoundAS.group("music").play(Model.MUSIC_ROSA_HYGGE, Model.VOLUME_MUSIC, 0, 100, false, true, true);
		AudioPlayer.getInstance().stopAllSounds(true);
		AudioPlayer.getInstance().playMusic(Model.MUSIC_ROSA_HYGGE, 3000, Model.VOLUME_MUSIC);

		if (Model.getInstance().gameMode == Model.MODE_FREE) {
			AudioPlayer.getInstance().playSound(SoundNames.FREEMODE_ROSA);
		} else {
			AudioPlayer.getInstance().playSound(SoundNames.S05_ROSA_01_OK_KAGESPION);
		}

		this.proceedButton = new NextArrowButton(this._presentCluesScene.getNextButton().armature);
		this.proceedButton.on(ButtonEvent.CLICKED, this.onNextButtonClicked);

		this._numberOfPhotosTaken = 0;
		this._presentCluesScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
		this._presentCluesScene.gotoIntro();

		TweenLite.delayedCall(.2, this.delayedSetPhotoFrames);
	}

	private delayedSetPhotoFrames = ():void => {
		this.getPolaorid0.gotoSmag();
		this.getPolaorid1.gotoForm();
		this.getPolaorid2.gotoFarve();
	}

	private afterIntro = (event:dragonBones.EventObject):void => {
		this._presentCluesScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);

		if (Model.getInstance().gameMode == Model.MODE_FREE) {
			this._presentCluesScene.gotoHint();
		}
	}

	//private onNextButtonClicked(event:ButtonEvent):void {
	private onNextButtonClicked = (event:ButtonEvent):void => {
		AudioPlayer.getInstance().stopAllSounds();

		let sceneEvent:SceneEvent;
		if (Model.getInstance().gameMode == Model.MODE_STORY) {
			this.playOutroNext();
		} else {
			this.playOutroJump();
		}
	}

	private handleSnap0Touched = (event:TouchEvent):void => {
		// this.handleSnapTouched(event, 0);
		this.handleSnapTouched(0);

		this.getPolaorid0.armature.animation.play();
		this.getPolaorid1.armature.animation.play();
		this.getPolaorid2.armature.animation.play();
	}

	//private handleSnap1Touched(event:TouchEvent):void {
	private handleSnap1Touched = (event:TouchEvent):void => {
		this.handleSnapTouched(1);

		this.getPolaorid0.armature.animation.play("form");
		this.getPolaorid1.armature.animation.play("form");
		this.getPolaorid2.armature.animation.play("form");
	}

	private handleSnap2Touched = (event:TouchEvent):void => {
		this.handleSnapTouched(2);

		this.getPolaorid0.armature.animation.play("form");
		this.getPolaorid1.armature.animation.play("form");
		this.getPolaorid2.armature.animation.play("form");
	}

	//private handleSnapTouched(event:TouchEvent, index:number):void {
	private handleSnapTouched = (index:number):void => {
		this._index = index;
		this.cameraShot = new CameraShot();
		this.cameraShot.on("COMPLETE", this.onImageReady);
		this.cameraShot.takeShot();
	}

	//private onImageReady(e:Event):void {
	private onImageReady = (event:Event):void => {
		this.cameraShot.off("COMPLETE", this.onImageReady);

		let snapImage:Sprite = this.cameraShot.lastSnapshotThumbnail;
		Model.getInstance().snapShots[this._index] = snapImage;

		this.snap = new Sprite();
		this.snap.addChild(snapImage);

		this._presentCluesScene["getPolaorid" + this._index]().get_placeholder().display = this.snap;

		this._numberOfPhotosTaken++;
		if (this._numberOfPhotosTaken >= 3) {
			this.proceedButton.display.visible = true;
		}
	}

	private setPolaroidImagesSnapshots() : void {
		let model:Model = Model.getInstance();

		this.smag = new Sprite();
		this.smag.addChild(model.snapShots[0]);
		this.getPolaorid0.get_placeholder().display = this.smag;
		this.getPolaorid0.gotoSmag();

		this.form = new Sprite();
		this.form.addChild(model.snapShots[1]);
		this.getPolaorid1.get_placeholder().display = this.form;
		this.getPolaorid1.gotoForm();

		this.farve = new Sprite();
		this.farve.addChild(model.snapShots[2]);
		this.getPolaorid2.get_placeholder().display = this.farve;
		this.getPolaorid2.gotoFarve();
	}

	private setPolaroidImages():void {
		this.smag = new Sprite();
		let smagImage:Sprite = Sprite.fromFrame(this.getPolaroidContent("Smag"));
		this.smag.addChild(smagImage);
		this.getPolaorid0.get_placeholder().display = this.smag;

		this.form = new Sprite();
		let formImage:Sprite = Sprite.fromFrame(this.getPolaroidContent("Form"));
		this.form.addChild(formImage);
		this.getPolaorid1.get_placeholder().display = this.form;

		this.farve = new Sprite();
		let farveImage:Sprite = Sprite.fromFrame(this.getPolaroidContent("Farve"));
		this.farve.addChild(farveImage);
		this.getPolaorid2.get_placeholder().display = this.farve;
	}

	// private getPolaroidContent(type:string):Texture {
	private getPolaroidContent(type:string):string {
		let atlasName:string = "texture-" + Model.getInstance().getSelectedCharName();
		let textureName:string = "badGuy_" + Model.getInstance().getSelectedCharName() + "/polaroid" + type;
		return textureName;
	}

	private playOutroNext():void {
		this._presentCluesScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this._presentCluesScene.gotoOuttro();
	}

	private playOutroJump():void {
		this._presentCluesScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.jumpToMixing, this);
		this._presentCluesScene.gotoOuttro();
	}

	private proceed = (event:dragonBones.EventObject):void => {
		this._presentCluesScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);
	}

	private jumpToMixing = (event:dragonBones.EventObject):void => {
		this._presentCluesScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.jumpToMixing, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.JUMP, Model.SCENE_MIXING, true);
		this.emit(SceneEvent.JUMP, sceneEvent);
	}

	public teardown():void {
		if (this.getPolaorid0 != null) {
			this.getPolaorid0.display.off(TouchEvent.TOUCH_END, this.handleSnap0Touched);
		}
		if (this.getPolaorid1 != null) {
			this.getPolaorid1.display.off(TouchEvent.TOUCH_END, this.handleSnap1Touched);
		}
		if (this.getPolaorid2 != null) {
			this.getPolaorid2.display.off(TouchEvent.TOUCH_END, this.handleSnap2Touched);
		}

		if(this._presentCluesScene != null) {
			this._presentCluesScene.remove(this);
			this._presentCluesScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
			this._presentCluesScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
			this._presentCluesScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.jumpToMixing, this);
		}

		if(this._brownBackgroundQuad != null) {
			try{
				this.removeChild(this._brownBackgroundQuad);
			} catch (Error) {
			}

		}
		if(this._pinkBackgroundQuad != null) {
			try{
				this.removeChild(this._pinkBackgroundQuad);
			} catch (Error) {
			}
		}
		if(this.snap != null) {
			this.snap.removeChildren();
		}
		if(this.smag != null) {
			this.smag.removeChildren();
		}
		if(this.form != null) {
			this.form.removeChildren();
		}
		if(this.farve != null) {
			this.farve.removeChildren();
		}

	}

}
