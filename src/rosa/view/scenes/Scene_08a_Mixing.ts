
import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";
import {DragManager} from "src/rosa/dragdrop/DragManager";
import {SceneEvent} from "src/rosa/events/SceneEvent";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {ISceneView} from "src/rosa/view/ISceneView";
import {IDragable} from "src/rosa/typeddb/interfaces/IDragable";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {MagreteBowlProxy} from "src/rosa/generated/common/armatures/proxies/MagreteBowlProxy";
import {Scene8a_handMixingSceneProxy} from "src/rosa/generated/common/armatures/proxies/Scene8a_handMixingSceneProxy";

import {NextArrowButton} from "src/rosa/generated/common/armatures/buttons/NextArrowButton";
import {MixerButton1ArmButton} from "src/rosa/generated/common/armatures/buttons/MixerButton1ArmButton";
import {MixerButton2ArmButton} from "src/rosa/generated/common/armatures/buttons/MixerButton2ArmButton";
import {MixerButton3ArmButton} from "src/rosa/generated/common/armatures/buttons/MixerButton3ArmButton";

import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {Model} from "src/rosa/model/Model";
import {MainView} from "src/rosa/view/MainView";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import DisplayObject = PIXI.DisplayObject;
import Point = PIXI.Point;
import Sprite = PIXI.Sprite;
import {ticker} from "pixi.js";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import {HandMixerBodyProxy} from "../../generated/common/armatures/proxies/HandMixerBodyProxy";
import {HandMixerArmProxy} from "../../generated/common/armatures/proxies/HandMixerArmProxy";
import {WRLRLRLRProxy} from "../../generated/common/armatures/proxies/WRLRLRLRProxy";
import Graphics = PIXI.Graphics;

export class Scene_08a_Mixing extends SceneBase implements ISceneView {
	private rectCover: Graphics;
	private rectOuterCover: Graphics;
	public DEG2RAD:number = Math.PI / 180;
	public RAD2DEG:number = 180 / Math.PI;

	public static BOWL_COLLISION_SIZE:number = 540;
	public static ROTOR_SIZE:number = 160;
	public static INNER_COLLISION_CIRCLE_RADIUS:number = ((Scene_08a_Mixing.BOWL_COLLISION_SIZE / 2) - (Scene_08a_Mixing.ROTOR_SIZE / 2));

	private _typeddb:TypedDBFactory;
	private _background:Sprite;
	private mixingScene:Scene8a_handMixingSceneProxy;

	// finger variables

	private spinner:Sprite;
	private spinnerRotation:number;
	private previousSpinnerRotation:number = 0;
	private spinnerDeltaAngle:number;
	private averageAngle:number;
	private numberOfSamples:number;
	private previousRotation:number = -1000;
	private targetAngle:number = 0;
	private angleSamples:any[];

	private gotoMixerButton:MixerButton1ArmButton;

	// mixer variables

	private mixerTargetPosition:Point;
	private collisionStarting:boolean = true;
	private wrlwrlId:number;
	private mixerButton1:MixerButton1ArmButton;
	private mixerButton2:MixerButton2ArmButton;
	private mixerButton3:MixerButton3ArmButton;
	private nextButton:NextArrowButton;
	private mixerSpeed:number = 0;
	private mixer:HandMixerArmProxy;
	private bowlCenter:Point;
	private mixerBodyProxy:HandMixerBodyProxy;
	private wrlwrl:WRLRLRLRProxy;
	private mixerDown:boolean;
	private touchOffset:Point;
	private mixerPosition:Point;
	private previousInsideGraphicPoint:Point;

	constructor() {
		super();
		this.name = "Scene_08a_Mixing";
	}

	public setup(typeddb:TypedDBFactory):void{
		this._typeddb = typeddb;
		// AssetLoader.getInstance().loadAdditional(AssetLoader.MEDIA_PATH + "rosa/common/backgrounds/" + Backgrounds.HANDMIXER + ".jpg", this.setupContinued);
		AssetLoader.getInstance().loadAdditional("handMixer", this.setupContinued);
	}

	public setupContinued = ():void => {

		// this._background = new Image(AssetLoader.getInstance().assets.getTexture(Backgrounds.HANDMIXER));
		this._background = PIXI.Sprite.fromFrame(Backgrounds.HANDMIXER);
		//OR
		// let texture:PIXI.Texture = PIXI.Texture.fromImage(Backgrounds.HANDMIXER); //TODO load image
		// this._background = new PIXI.Sprite(texture);

        this.addChild(this._background);
		this.mixingScene = this._typeddb.buildScene8a_handMixingSceneArmature();
		this.mixingScene.display.x = 0;
		this.mixingScene.display.y = 0;
		this.mixingScene.gotoHand();
		this.mixingScene.show(this);

		// this.mixerBodyProxy = this.mixingScene.getMixer().getMixerObj();
		this.mixerBodyProxy = this.mixingScene.getMixer().getMixerObj();

		this.mixingScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.SOUND_EVENT, this.playDBSound, this);


		// SoundAS.group("speak").stopAll();
		// SoundAS.group("speak").play(SoundNames.S08_ROSA_01_SAA_KSLA_DER_BLANDES_MED_FINGERE_ELLER_HAANDMIXER);
		AudioPlayer.getInstance().stopAllSounds();
		AudioPlayer.getInstance().playSound(SoundNames.S08_ROSA_01_SAA_KSLA_DER_BLANDES_MED_FINGERE_ELLER_HAANDMIXER);

		this.startFingerMode();
	}

	private playDBSound = (event:dragonBones.EventObject):void => {
		Logger.log(this, "Scene_08a_Mixing playDBSound");
		Logger.log(this, "Scene_08a_Mixing playDBSound  event name  == "+event.name);
		Logger.log(this, "Scene_08a_Mixing playDBSound  event type  == "+event.type);

		try{
			AudioPlayer.getInstance().playSound(event.name);
		} catch (error) {
			Logger.log(this, "ERROR : sound : playDBSound");
		}

	}


	private startFingerMode():void{
		// SoundAS.group("fx").playLoop("finger", 1, 0, true);
		// SoundAS.group("fx").mute = true;
		AudioPlayer.getInstance().playSound("finger"); //TODO fix for loop check AS3 code

		this.spinner = this.mixingScene.getSpinner().display;
		// dragonBones.WorldClock.clock.remove(this.mixingScene.getSpinner().armature);

		this.averageAngle = 0;
		this.numberOfSamples = 0;

		this.angleSamples = new Array();
		this.spinnerRotation = 0;

		// this.addListener("ENTER_FRAME", this.onEnterFrame);
		// ticker.shared.add( this.onEnterFrame, this );
		this.on(TouchEvent.TOUCH, this.touch);
		this.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.on(TouchEvent.TOUCH_END, this.touchDone);

		this.gotoMixerButton = new MixerButton1ArmButton(this.mixingScene.getHandMixerButtonArm().armature);
		this.gotoMixerButton.on(ButtonEvent.CLICKED, this.onGotoMixer);

		// TODO Temp added for testing
		// setTimeout(() => this.onGotoMixer(null), MainView.DELAY_TEST_NEXT_SCENE);
	}

	private stopFingerMode():void{
		// SoundAS.group("fx").mute = false; //TODO what is this?

		// this.removeListener("ENTER_FRAME", this.onEnterFrame);
		// ticker.shared.remove( this.onEnterFrame, this );
		this.off(TouchEvent.TOUCH, this.touch);
		this.off(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.off(TouchEvent.TOUCH_END, this.touchDone);
		this.gotoMixerButton.off(ButtonEvent.CLICKED, this.onGotoMixer);
	}

	private stopMixerMode():void{
		// SoundAS.group("wrlwrl").stopAll(); //TODO check this in AS3 code
		AudioPlayer.getInstance().stopAllSounds();
	}

	// --- FINGER FUNCTIONS ----
	private rotateToPoint = (mx, my, px, py) => {
		let dist_Y = my - py;
		let dist_X = mx - px;
		let angle = Math.atan2(dist_Y,dist_X);
		return angle;
	}

	private touch = (event:InteractionEvent):void => {
		this.mouseDown = true;
	}
	private touchMove = (event:InteractionEvent):void => {
		if(this.mouseDown) {
			this.spinnerRotation = this.rotateToPoint(AssetLoader.getInstance().renderer.plugins.interaction.pointer.global.x, AssetLoader.getInstance().renderer.plugins.interaction.pointer.global.y, this.spinner.x, this.spinner.y);
			let delta:number = this.spinnerRotation - this.previousSpinnerRotation;
			let alpha:number = Math.abs(delta);
			Logger.log(this, "touchMove:  this.spinnerRotation === " + this.spinnerRotation);
			Logger.log(this, "touchMove: delta === " + delta);
			Logger.log(this, "alpha:  alpha == " + alpha);
			this.spinner.alpha = alpha;
			this.spinner.rotation = this.spinnerRotation;

			this.previousSpinnerRotation = this.spinnerRotation;
		}
	}
	private touchDone = (event:InteractionEvent):void => {
		this.mouseDown = false;
	}

	// private onEnterFrame = (delta):void => {
	// 	// Logger.log(this, "onEnterFrame:" + delta);
	// 	// this.spinner.alpha = this.spinner.alpha * 0.95;
    //
	// 	// this.spinner.rotation += 0.1 * delta;
    //
	// 	// SoundAS.group("fx").mute = (this.spinner.alpha < 0.1); //TODO check how to do this from AS3 code
	// }

	//private onGotoMixer(e:ButtonEvent):void {
	private onGotoMixer = (event:ButtonEvent):void => {
		this.stopFingerMode();

		this.mixer = this.mixingScene.getMixer();
		this.mixer.display.interactive = true;
		this.mixer.display.buttonMode = true;
		this.mixer.display.on(TouchEvent.TOUCH, this.onDragDown);
		this.mixer.display.on(TouchEvent.TOUCH_MOVE, this.onDragHandler);
		// this.mixer.display.on(TouchEvent.TOUCH_END, this.onDragDone);
		this.on(TouchEvent.TOUCH_END, this.onDragDone);

		// this.rectOuterCover = new Graphics();
		// this.rectOuterCover.interactive = true;
		// this.rectOuterCover.buttonMode = true;
		// this.rectOuterCover.pivot.x = this.mixer.display.width;
		// this.rectOuterCover.pivot.y = this.mixer.display.height;
		// this.rectOuterCover.beginFill(0xFFFFFF);
		// this.rectOuterCover.alpha = .4; //SceneBase.RECT_COVER_ALPHA;
		// // this.mixer.display.addChild(this.rectOuterCover);
		// this.mixerBodyProxy.display.addChild(this.rectOuterCover);
		// // this.rectOuterCover.drawRect(this.mixer.display.x, this.mixer.display.y, this.mixer.display.width, this.mixer.display.height);
		// this.rectOuterCover.drawRect(this.mixer.display.x - 40, this.mixer.display.y - 40, this.mixerBodyProxy.display.width, this.mixerBodyProxy.display.height);
		// this.rectOuterCover.on(TouchEvent.TOUCH, this.onDragDown);
		// this.rectOuterCover.on(TouchEvent.TOUCH_MOVE, this.onDragHandler);


		this.wrlwrl = this.mixingScene.getWRLRLRLR();

		this.mixerTargetPosition = new Point(this.mixer.display.x, this.mixer.display.y);
		this.mixerPosition = new Point(this.mixer.display.x, this.mixer.display.y);
		this.previousInsideGraphicPoint = new Point(this.mixer.display.x, this.mixer.display.y);
		this.collisionStarting = true;
		this.bowlCenter = new Point(659, 381);

		this.mixerSpeed = 0;

		this.mixingScene.gotoMixer();

		this.mixerButton1 = new MixerButton1ArmButton(this.mixerBodyProxy.getMixerButton1Arm().armature);
		this.mixerButton2 = new MixerButton2ArmButton(this.mixerBodyProxy.getMixerButton2Arm().armature);
		this.mixerButton3 = new MixerButton3ArmButton(this.mixerBodyProxy.getMixerButton3Arm().armature);
		this.mixerButton1.on(ButtonEvent.CLICKED, this.onMixerButton1);
		this.mixerButton2.on(ButtonEvent.CLICKED, this.onMixerButton2);
		this.mixerButton3.on(ButtonEvent.CLICKED, this.onMixerButton3);

		this.nextButton = new NextArrowButton(this.mixingScene.getCloseButton().armature);
		this.nextButton.on(ButtonEvent.CLICKED, this.onNextButtonClicked);

		// this.rectOuterCover = new Graphics();
		// this.rectOuterCover.beginFill(0xFFFFFF);
		// this.rectOuterCover.alpha = .4; //SceneBase.RECT_COVER_ALPHA;
		// this._background.addChild(this.rectOuterCover);
		// let bowlOuterWidth:number = 500;
		// let bowlOuterHeight:number = 330 - this.mixer.display.height * .5;
		// // this.rectOuterCover.drawRect(this.bowlCenter.x - bowl_width * .5, this.bowlCenter.y - bowl_height * .5, bowl_width, bowl_height);
		// this.rectOuterCover.drawCircle(this.bowlCenter.x, this.bowlCenter.y, bowlOuterWidth * .5);
		// this.rectOuterCover.drawEllipse(this.bowlCenter.x, this.bowlCenter.y, bowl_width, bowl_height);

		this.rectCover = new Graphics();
		this.rectCover.beginFill(0x000000);
		this.rectCover.alpha = SceneBase.RECT_COVER_ALPHA;
		// this.addChild(this.rectCover);
		let bowlWidth:number = 200; //310;
		let bowlHeight:number = 140; //330 - this.mixer.display.height * .5;
		// this.rectCover.drawRect(this.bowlCenter.x - bowlWidth * .5, this.bowlCenter.y - bowlHeight * .5, bowlWidth, bowlHeight);
		// this.rectCover.drawCircle(this.bowlCenter.x, this.bowlCenter.y, 200);
		this.rectCover.drawEllipse(this.bowlCenter.x, this.bowlCenter.y, bowlWidth, bowlHeight);
		this._background.addChild(this.rectCover);

		// let rectMixerPoint:Graphics = new Graphics();
		// rectMixerPoint.pivot.x = this.mixer.display.width;
		// rectMixerPoint.pivot.y = this.mixer.display.height;
		// rectMixerPoint.beginFill(0xFFFFFF);
		// rectMixerPoint.alpha = .9; //SceneBase.RECT_COVER_ALPHA;
		// let width:number = 30;
		// rectMixerPoint.drawRect(this.mixerTargetPosition.x - width*.5, this.mixerTargetPosition.y - width*.5, width, width);
		// this.mixer.display.addChild(rectMixerPoint);

		// TODO Temp added for testing
		// setTimeout(() => this.onNextButtonClicked(null), MainView.DELAY_TEST_NEXT_SCENE);
	}

	private onDragDown = (event:TouchEvent):void => {
		if(this.mixerSpeed > 0){
			this.mixerDown = true;
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.touchOffset = mousePositionCanvas;
			this.mixerTargetPosition.x = this.mixer.display.x;
			this.mixerTargetPosition.y = this.mixer.display.y;
			this.mixerPosition.x = mousePositionCanvas.x + (this.mixerTargetPosition.x - this.touchOffset.x);
			this.mixerPosition.y = mousePositionCanvas.y + (this.mixerTargetPosition.y - this.touchOffset.y);
			this.mixer.display.x = this.mixerPosition.x;
			this.mixer.display.y = this.mixerPosition.y;
		}
	}

	private onDragHandler = (event:TouchEvent):void => {

		if(this.mixerDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.mixerPosition.x = mousePositionCanvas.x + (this.mixerTargetPosition.x - this.touchOffset.x);
			this.mixerPosition.y = mousePositionCanvas.y + (this.mixerTargetPosition.y - this.touchOffset.y);

			let hit: boolean = this.rectCover.containsPoint(mousePositionCanvas);
			let hit2: boolean = this.rectCover.containsPoint(this.mixerPosition);
			// let hitOuter:boolean = this.rectOuterCover.containsPoint(mousePositionCanvas);
			// let hitOuter2:boolean = this.rectOuterCover.containsPoint(this.mixerPosition);
			// Logger.log(this, "onDragHandler hit == " + hit+" : hit2=== "+hit2+" : hitOuter == "+hitOuter+" : hitOuter2 == "+hitOuter2);


			// TweenLite.to(this.mixer.display, .2, {
			// 	x: this.mixerPosition.x,
			// 	y: this.mixerPosition.y
			// });

			if (hit2) {
				// if(this.checkInside()) {
				// this.mixer.display.x = mixerPosition.x;
				// this.mixer.display.y = mixerPosition.y;

				this.collisionStarting = false;

				this.previousInsideGraphicPoint = mousePositionCanvas;

				TweenLite.to(this.mixer.display, .2, {
					x: this.mixerPosition.x,
					y: this.mixerPosition.y
				});


				Logger.log(this, "Scene_08a_Mixing onDragHandler  this.mixerSpeed == "+this.mixerSpeed+"  this.wrlwrlId === "+this.wrlwrlId);

				if(this.mixerSpeed > 0) {
					this.wrlwrlId = this.mixerSpeed;
					if (this.collisionStarting) {
						this.wrlwrlId = Math.floor(Math.random() * 3 + 1);

						// SoundAS.group("wrlwrl").play("mixerkant3", 1, 0);
						AudioPlayer.getInstance().playSound("mixerkant3"); //TODO
					}
					try{
						// this.mixingScene.getWRLRLRLR()["gotoLoop" + this.wrlwrlId]();
						this.mixingScene.getWRLRLRLR()["gotoLoop" + this.wrlwrlId]();
					} catch (error) {
						Logger.log(this, "ERROR : onDragHandler : this.mixerSpeed > 0");
					}

				}

			} else {
				this.mixerPosition.x = this.previousInsideGraphicPoint.x;
				this.mixerPosition.y = this.previousInsideGraphicPoint.y;
				this.collisionStarting = true;
			}

		}
	}

	private onDragDone = (event:TouchEvent):void => {
		this.mixerDown = false;
	}


	//private onNextButtonClicked(e:ButtonEvent):void {
	private onNextButtonClicked = (event:ButtonEvent):void => {
		// SoundAS.group("speak").stopAll(); //TODO
		AudioPlayer.getInstance().stopAllSounds();

		this.stopMixerMode();
		this.playOutro();
	}

	//private onMixerButton1(e:ButtonEvent):void {
	private onMixerButton1 = (event:ButtonEvent):void => {
		this.mixerSpeed = 1;
		this.mixingScene.getMixer().gotoSpeed1();

		// SoundAS.group("fx").stopAll();
		// SoundAS.group("fx").play("mixer1", 1, 0, 100, false, true, true);
		AudioPlayer.getInstance().stopAllSounds();
		AudioPlayer.getInstance().playSound("mixer1", 999);
	}

	//private onMixerButton2(e:ButtonEvent):void {
	private onMixerButton2 = (event:ButtonEvent):void => {
		this.mixerSpeed = 2;
		this.mixingScene.getMixer().gotoSpeed2();


		// SoundAS.group("fx").stopAll();
		// SoundAS.group("fx").play("mixer2", 1, 0, 100, false, true, true);
		AudioPlayer.getInstance().stopAllSounds();
		AudioPlayer.getInstance().playSound("mixer2", 999);
	}

	//private onMixerButton3(e:ButtonEvent):void {
	private onMixerButton3 = (event:ButtonEvent):void => {
		this.mixerSpeed = 3;
		this.mixingScene.getMixer().gotoSpeed3();
		this.showSplats();

		// SoundAS.group("fx").stopAll();
		// SoundAS.group("fx").play("mixer3", 1, 0, 100, false, true, true);
		AudioPlayer.getInstance().stopAllSounds();
		AudioPlayer.getInstance().playSound("mixer3", 999);
	}

	private showSplats = ():void => {
		this.mixingScene.getSplats().gotoSplat();
		let delay:number = Math.random() * 5 + 5;
		Logger.log(this, "delay" + delay);
		TweenLite.delayedCall(Math.random() * 5 + 5, this.showSplats);
	}


	//private onDragHandler(e:TouchEvent):void {
	// private onDragHandler = (event:TouchEvent):void => {
	// 	// let t:Touch = e.getTouch(PIXI.DisplayObject(e.target));
	// 	let t:Touch;
	// 	if (t){
	// 		switch(t.phase){
	// 			case TouchPhase.BEGAN:
	// 				break;
	// 			case TouchPhase.MOVED:
	// 				// let movement:PIXI.Point = t.getMovement(this); //TODO
	// 				// this.mixerTargetPosition.offset(movement.x, movement.y); //TODO
    //
	// 				let collide:boolean = this.doesMixerCollideWithBowl();
	// 				if (collide){
	// 					if (this.mixerSpeed > 0){
	// 						if (this.collisionStarting){
	// 							this.wrlwrlId = Math.floor(Math.random() * 3 + 1);
    //
	// 							// SoundAS.group("wrlwrl").play("mixerkant3", 1, 0);
	// 							AudioPlayer.getInstance().playSound("mixerkant3"); //TODO
	// 						}
    //
	// 						this.mixingScene.getWRLRLRLR()["gotoLoop" + this.wrlwrlId]();
	// 					}
    //
	// 					// let offsetX:number = this.mixingScene.getMixer().display.transformationMatrix.tx - this.bowlCenter.x; //TODO
	// 					// let offsetY:number = this.mixingScene.getMixer().display.transformationMatrix.ty - this.bowlCenter.y;//TODO
    //
	// 					// this.mixerTargetPosition.x = this.bowlCenter.x + (offsetX * .8); //TODO
	// 					// this.mixerTargetPosition.y = this.bowlCenter.y + (offsetY * .8);
    //
	// 					// this.mixingScene.getMixer().display.transformationMatrix.tx = this.mixerTargetPosition.x; //TODO
	// 					// this.mixingScene.getMixer().display.transformationMatrix.ty = this.mixerTargetPosition.y;
    //
    //
    //
	// 					this.collisionStarting = false;
	// 				} else {
	// 					this.collisionStarting = true;
    //
	// 					// TODO
	// 					// this.mixingScene.getMixer().display.transformationMatrix.tx += (this.mixerTargetPosition.x - this.mixingScene.getMixer().display.transformationMatrix.tx) * 0.2;
	// 					// this.mixingScene.getMixer().display.transformationMatrix.ty += (this.mixerTargetPosition.y - this.mixingScene.getMixer().display.transformationMatrix.ty) * 0.2;
	// 				}
    //
	// 				break;
    //
	// 			case TouchPhase.ENDED:
	// 				break;
	// 		}
	// 	}
	// }

	private doesMixerCollideWithBowl():boolean {
		if (this.mixerTargetPosition == null) {
			return false;
		}

		let mixerGlobal:Point = this.mixerTargetPosition;

		let rotor1Position:Point = new Point(-10, -80);
		// rotor1Position = rotor1Position.add(mixerGlobal);
		rotor1Position.x = mixerGlobal.x;
		rotor1Position.y = mixerGlobal.y;

		let rotor2Position:Point = new Point(-5, 50);
		// rotor2Position = rotor2Position.add(mixerGlobal);
		rotor2Position.x = mixerGlobal.x;
		rotor2Position.y = mixerGlobal.y;

		// let rotor1GlobalPosition:PIXI.Point = rotor1Position.subtract(this.bowlCenter);
		// let rotor2GlobalPosition:PIXI.Point = rotor2Position.subtract(this.bowlCenter);
		let rotor1GlobalPosition:Point;
		let rotor2GlobalPosition:Point;

		// return (rotor1GlobalPosition.length > Scene_08a_Mixing.INNER_COLLISION_CIRCLE_RADIUS || rotor2GlobalPosition.length > Scene_08a_Mixing.INNER_COLLISION_CIRCLE_RADIUS);
		return true;  //TODO
	}

	private playOutro():void{
		// this.mixingScene.armature.addEventListener(dragonBones.EventObject.COMPLETE, this.proceed, this);

		this.mixingScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this.mixingScene.gotoOuttro();
	}

	//private proceed(event:dragonBones.EventObject):void {
	private proceed = (event:dragonBones.EventObject):void => {

		this.mixingScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.PREVIOUS, sceneEvent);


		// this.mixingScene.armature.removeEventListener(dragonBones.EventObject.COMPLETE, this.proceed, this);
		// let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		// dispatchEvent(sceneEvent); // TODO
	}


	public teardown():void{
		TweenLite.killDelayedCallsTo(this.showSplats);

		this.stopFingerMode();

		if (this.mixer != null){
			this.mixer.display.off(TouchEvent.TOUCH, this.onDragDown);
			this.mixer.display.off(TouchEvent.TOUCH_MOVE, this.onDragHandler);
			this.mixer.display.off(TouchEvent.TOUCH_END, this.onDragDone);
			this.mixer = null;
		}

		if (this.mixerButton1 != null) {
			this.mixerButton1.off(ButtonEvent.CLICKED, this.onMixerButton1);
			this.mixerButton1.dispose();
			this.mixerButton1 = null;
		}

		if (this.mixerButton2 != null) {
			this.mixerButton2.off(ButtonEvent.CLICKED, this.onMixerButton2);
			this.mixerButton2.dispose();
			this.mixerButton2 = null;
		}

		if (this.mixerButton3 != null) {
			this.mixerButton3.off(ButtonEvent.CLICKED, this.onMixerButton3);
			this.mixerButton3.dispose();
			this.mixerButton3 = null;
		}

		if (this.nextButton != null) {
			this.nextButton.off(ButtonEvent.CLICKED, this.onNextButtonClicked);
			this.nextButton.dispose();
			this.nextButton = null;
		}

		if (this.mixingScene != null) {
			this.mixingScene.remove(this);
			this.mixingScene = null;
		}

		if (this._background != null) {
			this.removeChild(this._background);
			this._background = null;
		}

		// AssetLoader.getInstance().removeTexture(Backgrounds.HANDMIXER, true);

		AudioPlayer.getInstance().stopAllSounds();
	}

}
