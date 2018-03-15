

import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";
import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";

import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";

import {SceneEvent} from "src/rosa/events/SceneEvent";
import {ISceneView} from "src/rosa/view/ISceneView";
import {IDragable} from "src/rosa/typeddb/interfaces/IDragable";
import {Scene9_DecorationProxy} from "src/rosa/generated/common/armatures/proxies/Scene9_DecorationProxy";
import {CakeArmProxy} from "src/rosa/generated/common/armatures/proxies/CakeArmProxy";

import {LakridsDragProxy} from "src/rosa/generated/common/armatures/proxies/LakridsDragProxy";
import {CocosDragProxy} from "src/rosa/generated/common/armatures/proxies/CocosDragProxy";
import {BlueKrymmelDragProxy} from "src/rosa/generated/common/armatures/proxies/BlueKrymmelDragProxy";
import {ColorKrymmelDragProxy} from "src/rosa/generated/common/armatures/proxies/ColorKrymmelDragProxy";
import {KiwiDragProxy} from "src/rosa/generated/common/armatures/proxies/KiwiDragProxy";
import {PineappleDragProxy} from "src/rosa/generated/common/armatures/proxies/PineappleDragProxy";
import {StrawberryDragProxy} from "src/rosa/generated/common/armatures/proxies/StrawberryDragProxy";

import {NextArrowButton} from "src/rosa/generated/common/armatures/buttons/NextArrowButton";
import {GlazeingButtonButton} from "src/rosa/generated/common/armatures/buttons/GlazeingButtonButton";
import {ClearButtonButton} from "src/rosa/generated/common/armatures/buttons/ClearButtonButton";
import {UndoButtonButton} from "src/rosa/generated/common/armatures/buttons/UndoButtonButton";

import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {Model} from "src/rosa/model/Model";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import Sprite = PIXI.Sprite;
import RenderTexture = PIXI.RenderTexture;
import Point = PIXI.Point;
import DisplayObject = PIXI.DisplayObject;
import Rectangle = PIXI.Rectangle;
import InteractionEvent = PIXI.interaction.InteractionEvent;
import Graphics = PIXI.Graphics;
import {ProxyBase} from "../../generated/common/armatures/ProxyBase";
import Container = PIXI.Container;
import Armature = dragonBones.Armature;

export class Scene_081_DecorateCakeView extends SceneBase implements ISceneView {
	private NUMBER_OF_LAKRIDS_FORMS:number = 3;

	static BLUE:string = "blue";
	static ORANGE:string = "orange";
	static WHITE:string = "white";
	static RED:string = "red";

	private readonly cakeLocX:number = 416;
	private readonly cakeLocY:number = 134;

	private _typeddb:TypedDBFactory;
	private _background:Sprite;

	private completeCakeContainer:PIXI.Container;

	private decoContainer:Sprite;
	private decoScene:Scene9_DecorationProxy;

	private glazingButtonBlue:GlazeingButtonButton;
	private glazingButtonOrange:GlazeingButtonButton;
	private glazingButtonRed:GlazeingButtonButton;
	private glazingButtonWhite:GlazeingButtonButton;

	private currentLakridsForm:number = 0;
	private hardCake:CakeArmProxy;

	private clearButton:ClearButtonButton;
	private undoButton:UndoButtonButton;
	private nextButton:NextArrowButton;

	private cakeDisplay:Sprite;
	private cakeRect:Rectangle;
	private cakeDisplayClone:Sprite;
	private maskDecoCake:Graphics;

	private lakridsProxy:LakridsDragProxy;
	private kiwiProxy:KiwiDragProxy;
	private strawberryProxy:StrawberryDragProxy;
	private pineappleProxy:PineappleDragProxy;
	private colorProxy:ColorKrymmelDragProxy;
	private blueProxy:BlueKrymmelDragProxy;
	private cocosProxy:CocosDragProxy;

	private pieceClone:Sprite;
	private armatureDeco:dragonBones.Armature;
	private graphicsHitArea:Graphics;

	rectCoverNextBtn: Graphics;
	rectCoverDrawing: Graphics;
	rectCoverAddDeco: Graphics;
	private drawing:boolean;
	private drawingShape:Graphics;
	private prevDraw:Point = new Point();
	private currentDraw:Point = new Point();
	private currentColor:string;
	private drawingContainer:Sprite;
	private currentProxyName:string;
	private dataProxyBase:ProxyBase;

	private farve:Sprite;

	constructor() {
		super();
		this.name = "Scene_081_DecorateCakeView";
	}

	public setup(typeddb:TypedDBFactory):void {
		this._typeddb = typeddb;
		AssetLoader.getInstance().loadAdditional("Scene9_bg", this.setupContinued);
	}

	public setupContinued = ():void => {
		this._background = Sprite.fromFrame(Backgrounds.SCENE9_BG);
		this.addChild(this._background);

		this.decoScene = this._typeddb.buildScene9_DecorationArmature();
		this.decoScene.display.x = 0;
		this.decoScene.display.y = 0;
		this.decoScene.show(this);
		this.decoScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);

		this.decoScene.gotoIntro();
	}

	private afterIntro = (event:dragonBones.EventObject):void => {
		this.decoScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);

		// mille ones
		// this.decoScene.getDragables().getChocolateDrag(); //TODO we have no Mille 15_05_17
		// this.decoScene.getDragables().getFlagDrag();

		this.glazingButtonBlue = new GlazeingButtonButton(this.decoScene.getGlazeingButtonBlue().armature);
		this.glazingButtonBlue.isToggle = true;
		this.glazingButtonOrange = new GlazeingButtonButton(this.decoScene.getGlazeingButtonOrange().armature);
		this.glazingButtonOrange.isToggle = true;
		this.glazingButtonRed = new GlazeingButtonButton(this.decoScene.getGlazeingButtonRed().armature);
		this.glazingButtonRed.isToggle = true;
		this.glazingButtonWhite = new GlazeingButtonButton(this.decoScene.getGlazeingButtonWhite().armature);
		this.glazingButtonWhite.isToggle = true;

		this.glazingButtonBlue.on(ButtonEvent.CLICKED, this.glazingBlueClicked);
		this.glazingButtonOrange.on(ButtonEvent.CLICKED, this.glazingOrangeClicked);
		this.glazingButtonRed.on(ButtonEvent.CLICKED, this.glazingRedClicked);
		this.glazingButtonWhite.on(ButtonEvent.CLICKED, this.glazingWhiteClicked);

		this.clearButton = new ClearButtonButton(this.decoScene.getClearButton().armature);
		this.clearButton.on(ButtonEvent.CLICKED, this.clearButtonClicked);

		this.undoButton = new UndoButtonButton(this.decoScene.getUndoButton().armature);
		this.undoButton.on(ButtonEvent.CLICKED, this.undoButtonClicked);

		this.decoScene.getNextArrow().armature.display.x -= 40;
		this.decoScene.getNextArrow().armature.display.y -= 120;

		this.nextButton = new NextArrowButton(this.decoScene.getNextArrow().armature);
		this.nextButton.on(ButtonEvent.CLICKED, this.nextButtonClicked);

		this.hardCake = this._typeddb.buildCakeArmArmature();

		dragonBones.WorldClock.clock.remove(this.hardCake.armature);
		this.hardCake.armature.animation.stop();

		this.hardCake.display.x = this.cakeLocX;
		this.hardCake.display.y = this.cakeLocY;

		this.cakeDisplay = this.hardCake.display;

		this.cakeRect = new Rectangle(this.cakeDisplay.x, this.cakeDisplay.y, this.cakeDisplay.width, this.cakeDisplay.height);
		this.cakeDisplay.setTransform();

		this.cakeDisplayClone = Model.getInstance().cakeCut;
		this.cakeDisplayClone.x = this.cakeRect.x;
		this.cakeDisplayClone.y = this.cakeRect.y;

		this.decoContainer = new Sprite();
		this.decoContainer.x = this.cakeRect.x;
		this.decoContainer.y = this.cakeRect.y;

		this.drawingContainer = new Sprite();

		this.completeCakeContainer = new Container();
		this.addChild(this.completeCakeContainer);

		this.completeCakeContainer.addChild(this.cakeDisplayClone);
		this.completeCakeContainer.addChild(this.decoContainer);

		this.farve = new Sprite();

		if (Model.getInstance().gameMode == Model.MODE_FREE) {
			if (Model.getInstance().snapShots[2] != null) {
				this.farve.addChild(Model.getInstance().snapShots[2]);
			}
		} else {
			let farveImage:Sprite = Sprite.fromFrame(this.getPolaroidContent("Farve"));
			this.farve.addChild(farveImage);
		}

		AudioPlayer.getInstance().stopAllSounds();
		AudioPlayer.getInstance().playSound(SoundNames.S09_ROSA_02_NU_SKAL_VI_HAVE_PYNTET_KAGEN);

		this.graphicsHitArea = new Graphics()
            .beginFill(0xFF0000)
            .drawRect(this.cakeRect.x, this.cakeRect.y, this.cakeRect.width, this.cakeRect.height);

		this.addChildAt(this.graphicsHitArea, 0);

		this.decoScene.getPolaroid().get_placeholder().display = this.farve;
		this.decoScene.getPolaroid().armature.display.x -= 250;
		setTimeout(() => this.decoScene.getPolaroid().gotoFarve(), 100);
		setTimeout(() => this.setupAdditional(), 50);
	}

	private setupAdditional = ():void => {
		this.lakridsProxy = this.decoScene.getDragables().getLakridsDrag();
		this.lakridsProxy.signalPiece.add(this.pieceTouched);

		this.kiwiProxy = this.decoScene.getDragables().getKiwiDrag();
		this.kiwiProxy.signalPiece.add(this.pieceTouched);
		this.kiwiProxy.display.x += 50;

		this.strawberryProxy = this.decoScene.getDragables().getStrawberryDrag();
		this.strawberryProxy.signalPiece.add(this.pieceTouched);
		this.strawberryProxy.display.x += 50;

		this.pineappleProxy = this.decoScene.getDragables().getPineappleDrag();
		this.pineappleProxy.signalPiece.add(this.pieceTouched);

		this.pineappleProxy.display.x = AssetLoader.STAGE_WIDTH - this.pineappleProxy.display.width + 180;
		this.pineappleProxy.display.y = AssetLoader.STAGE_HEIGHT - this.pineappleProxy.display.height + 50;

		this.colorProxy = this.decoScene.getDragables().getColorKrymmelDrag();
		this.colorProxy.signalPiece.add(this.pieceTouched);

		this.blueProxy = this.decoScene.getDragables().getBlueKrymmelDrag();
		this.blueProxy.signalPiece.add(this.pieceTouched);

		this.cocosProxy = this.decoScene.getDragables().getCocosDrag();
		this.cocosProxy.signalPiece.add(this.pieceTouched);

		this.drawingShape = new Graphics();
		this.drawingContainer.addChild(this.drawingShape);

		this.rectCoverAddDeco = new Graphics();
		this.rectCoverAddDeco.beginFill(0xFF0000);
		this.rectCoverAddDeco.interactive = true;
		this.rectCoverAddDeco.buttonMode = true;
		this.rectCoverAddDeco.alpha = SceneBase.RECT_COVER_ALPHA;
		this.addChild(this.rectCoverAddDeco);
		this.rectCoverAddDeco.drawRect(this.cakeLocX, this.cakeLocY, this.cakeDisplay.width, this.cakeDisplay.height);
		this.rectCoverAddDeco.visible = false;

		this.rectCoverAddDeco.on(TouchEvent.TOUCH, this.addNewDecoPiece);

		this.rectCoverDrawing = new Graphics();
		this.rectCoverDrawing.beginFill(0xFF0000);
		this.rectCoverDrawing.interactive = true;
		this.rectCoverDrawing.buttonMode = true;
		this.rectCoverDrawing.alpha = SceneBase.RECT_COVER_ALPHA;
		this.addChild(this.rectCoverDrawing);
		this.rectCoverDrawing.drawRect(this.cakeLocX, this.cakeLocY, this.cakeDisplay.width, this.cakeDisplay.height);
		this.rectCoverDrawing.visible = false;

		this.rectCoverDrawing.on(TouchEvent.TOUCH, this.drawDown);
		this.rectCoverDrawing.on(TouchEvent.TOUCH_MOVE, this.drawMove);
		this.rectCoverDrawing.on(TouchEvent.TOUCH_END, this.drawDone);
		this.rectCoverDrawing.on(TouchEvent.TOUCH_OUT, this.drawDone);


//workaround for nextbutton under fix for pineapple dragonbones issues
		this.rectCoverNextBtn = new Graphics();
		this.rectCoverNextBtn.beginFill(0x444444);
		this.rectCoverNextBtn.interactive = true;
		this.rectCoverNextBtn.buttonMode = true;
		this.rectCoverNextBtn.alpha = SceneBase.RECT_COVER_ALPHA;
		this.addChild(this.rectCoverNextBtn);
		this.rectCoverNextBtn.drawRect(this.cakeLocX + this.graphicsHitArea.width - 20, this.cakeLocY + this.graphicsHitArea.height - 120, 150, 100);
		this.rectCoverNextBtn.on(TouchEvent.TOUCH_END, this.nextButtonClicked);
	}

	private addNewDecoPiece = (event:TouchEvent):void => {
		if(this.currentProxyName !== null && this.armatureDeco.display !== null) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);

			this.pieceClone = new Sprite();
			this.pieceClone.x = -1000; //data.x;
			this.pieceClone.y = -1000; //data.y;
			this.pieceClone.interactive = true;
			this.pieceClone.buttonMode = true;
			let armatureDeco:Armature = this.dataProxyBase.getDecoArmature();
			this.decoContainer.addChild(this.pieceClone);

			this.pieceClone.x = Math.round(mousePositionCanvas.x - this.cakeLocX);
			this.pieceClone.y = Math.round(mousePositionCanvas.y - this.cakeLocY);

			let child:Sprite = new Sprite();
			child.addChild(armatureDeco.display as Sprite);
			child.x = this.pieceClone.x;
			child.y = this.pieceClone.y;

			child.x = Math.round(Math.round(mousePositionCanvas.x - this.cakeLocX));
			child.y = Math.round(Math.round(mousePositionCanvas.y - this.cakeLocY));
			if(this.dataProxyBase.proxyName === this.lakridsProxy.proxyName) {
				armatureDeco.animation.play("drag" + this.currentLakridsForm);
			}
			this.decoContainer.addChild(child);
			this.decoContainer.removeChild(this.pieceClone);
		}
	}

	private pieceTouched = (data:ProxyBase):void => {
		this.dataProxyBase = data;
		this.stopDrawing();
		this.rectCoverAddDeco.visible = false;
		if(this.currentProxyName != data.proxyName) {
			this.setActiveSelectionArrow(data.proxyName);
		}
		this.currentProxyName = data.proxyName;

		this.mouseDown = true;
		this.pieceClone = new Sprite();
		this.pieceClone.x = -1000; //data.x;
		this.pieceClone.y = -1000; //data.y;
		this.pieceClone.interactive = true;
		this.pieceClone.buttonMode = true;
		this.pieceClone.on(TouchEvent.TOUCH_MOVE, this.pieceMoved);
		this.pieceClone.on(TouchEvent.TOUCH_END, this.pieceMoveDone);
		this.armatureDeco = data.getDecoArmature();
		this.pieceClone.addChild(this.armatureDeco.display);

		if(data.proxyName === this.lakridsProxy.proxyName) {
			this.currentLakridsForm++;
			this.currentLakridsForm = this.currentLakridsForm > 3 || this.currentLakridsForm < 0 ? 1 : this.currentLakridsForm;
			this.armatureDeco.animation.play("drag" + this.currentLakridsForm);
		}

		this.decoContainer.addChild(this.pieceClone);
	}

	private pieceMoved = (event:TouchEvent):void => {
		if(this.mouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.pieceClone.x = Math.round(mousePositionCanvas.x - this.cakeLocX);
			this.pieceClone.y = Math.round(mousePositionCanvas.y - this.cakeLocY);
		}
	}

	private pieceMoveDone = (event:TouchEvent):void => {
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		this.mouseDown = false;
		this.pieceClone.off(TouchEvent.TOUCH_MOVE, this.pieceMoved);
		this.pieceClone.off(TouchEvent.TOUCH_END, this.pieceMoveDone);

		let child = this.armatureDeco.display;
		child.x = this.pieceClone.x;
		child.y = this.pieceClone.y;

		this.addChild(this.completeCakeContainer);

		// let pointToTry: Point = new Point(this.pieceClone.x, this.pieceClone.y);
		let pointToTry: Point = new Point(mousePositionCanvas.x, mousePositionCanvas.y);
		let hit: boolean = this.graphicsHitArea.containsPoint(pointToTry);

		if (hit) {
			this.decoContainer.addChild(child);
		} else {
		}

		this.decoContainer.removeChild(this.pieceClone);
		this.rectCoverAddDeco.visible = true;
		this.addChild(this.rectCoverAddDeco);
		this.addChild(this.rectCoverNextBtn);
	}

	private resetSelectionArrow():void {
		this.decoScene.getDecoSelectionLakrids().gotoOff();
		this.decoScene.getDecoSelectionKiwi().gotoOff();
		this.decoScene.getDecoSelectionStrawberry().gotoOff();
		this.decoScene.getDecoSelectionPineapple().gotoOff();
		this.decoScene.getDecoSelectionColorkrymmel().gotoOff();
		this.decoScene.getDecoSelectionBluekrymmel().gotoOff();
		this.decoScene.getDecoSelectionCocos().gotoOff();

		this.currentProxyName = null;
	}

	private setActiveSelectionArrow(name:string):void {
		this.resetSelectionArrow();

		switch (name){
			case this.lakridsProxy.proxyName:
				this.decoScene.getDecoSelectionLakrids().gotoOn();
				break;
			case this.kiwiProxy.proxyName:
				this.decoScene.getDecoSelectionKiwi().gotoOn();
				break;
			case this.strawberryProxy.proxyName:
				this.decoScene.getDecoSelectionStrawberry().gotoOn();
				break;
			case this.pineappleProxy.proxyName:
				this.decoScene.getDecoSelectionPineapple().gotoOn();
				break;
			case this.colorProxy.proxyName:
				this.decoScene.getDecoSelectionColorkrymmel().gotoOn();
				break;
			case this.blueProxy.proxyName:
				this.decoScene.getDecoSelectionBluekrymmel().gotoOn();
				break;
			case this.cocosProxy.proxyName:
				this.decoScene.getDecoSelectionCocos().gotoOn();
				break;
		}
	}

	private drawDown = (event:TouchEvent):void => {
		this.drawing = true;
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);

		let color:number;
		switch (this.currentColor){
			case Scene_081_DecorateCakeView.BLUE:
				color = 0x0000FF;
				break;
			case Scene_081_DecorateCakeView.ORANGE:
				color = 0xFFA500;
				break;
			case Scene_081_DecorateCakeView.WHITE:
				color = 0xFFFFFF;
				break;
			case Scene_081_DecorateCakeView.RED:
				color = 0xFF0000;
				break;
		}

		this.prevDraw.x = Math.floor(mousePositionCanvas.x - this.cakeLocX);
		this.prevDraw.y = Math.floor(mousePositionCanvas.y - this.cakeLocY);

		this.drawingShape.moveTo(this.prevDraw.x, this.prevDraw.y);
		this.drawingShape.lineStyle(15, color, 1);
	}

	private drawMove = (event:TouchEvent):void => {
		if (this.drawing) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);

			this.currentDraw.x = Math.floor(mousePositionCanvas.x - this.cakeLocX);
			this.currentDraw.y = Math.floor(mousePositionCanvas.y - this.cakeLocY);

			this.drawingShape.moveTo(this.prevDraw.x, this.prevDraw.y);
			this.drawingShape.lineTo(this.currentDraw.x, this.currentDraw.y);

			this.prevDraw.x = Math.floor(this.currentDraw.x);
			this.prevDraw.y = Math.floor(this.currentDraw.y);
		}
	}
	private drawDone = (event:TouchEvent):void => {
		if (this.drawing) {
		}
		this.drawing = false;
	}

	private isDrawing():boolean 	{
		return this.glazingButtonOrange.selected || this.glazingButtonBlue.selected || this.glazingButtonWhite.selected || this.glazingButtonRed.selected;
	}

	private glazingBlueClicked = (event:ButtonEvent):void => {
		this.setCurrentDrawingColor(Scene_081_DecorateCakeView.BLUE);
	}

	private glazingOrangeClicked = (event:ButtonEvent):void => {
		this.setCurrentDrawingColor(Scene_081_DecorateCakeView.ORANGE);
	}

	private glazingWhiteClicked = (event:ButtonEvent):void => {
		this.setCurrentDrawingColor(Scene_081_DecorateCakeView.WHITE);
	}

	private glazingRedClicked = (event:ButtonEvent):void => {
		this.setCurrentDrawingColor(Scene_081_DecorateCakeView.RED);
	}

	private setCurrentDrawingColor(colorName:string):void {
		this.resetSelectionArrow();

		this.decoContainer.addChildAt(this.drawingContainer, 0);
		this.currentColor = colorName;

		this.glazingButtonBlue.selected = (colorName === Scene_081_DecorateCakeView.BLUE);
		if(this.glazingButtonBlue.selected) {
			this.glazingButtonBlue.gotoDown();
		}else{
			this.glazingButtonBlue.gotoUp();
		}

		this.glazingButtonOrange.selected = (colorName === Scene_081_DecorateCakeView.ORANGE);
		if(this.glazingButtonOrange.selected) {
			this.glazingButtonOrange.gotoDown();
		}else{
			this.glazingButtonOrange.gotoUp();
		}

		this.glazingButtonWhite.selected = (colorName === Scene_081_DecorateCakeView.WHITE);
		if(this.glazingButtonWhite.selected) {
			this.glazingButtonWhite.gotoDown();
		}else{
			this.glazingButtonWhite.gotoUp();
		}

		this.glazingButtonRed.selected = (colorName === Scene_081_DecorateCakeView.RED);
		if(this.glazingButtonRed.selected) {
			this.glazingButtonRed.gotoDown();
		}else{
			this.glazingButtonRed.gotoUp();
		}

		this.rectCoverDrawing.visible = true;
		this.addChild(this.rectCoverDrawing);
	}

	private stopDrawing():void {
		this.currentColor = null;

		this.glazingButtonBlue.selected = false;
		this.glazingButtonOrange.selected = false;
		this.glazingButtonWhite.selected = false;
		this.glazingButtonRed.selected = false;

		this.glazingButtonBlue.gotoUp();
		this.glazingButtonOrange.gotoUp();
		this.glazingButtonWhite.gotoUp();
		this.glazingButtonRed.gotoUp();

		this.rectCoverDrawing.visible = false;
	}

	private clearButtonClicked = (event:ButtonEvent):void => {
		if (this.decoContainer.children.length == 0) {
		} else {
			this.decoContainer.removeChildren();
		}

		if(this.drawingContainer.children.length > 0){
			this.resetDrawingShape();
		}
	}

	private undoButtonClicked = (event:ButtonEvent):void => {
		if (this.decoContainer.children.length == 0) {
		} else {
			let childLength:number = this.decoContainer.children.length - 1;
			this.decoContainer.removeChildAt(childLength);
			if (childLength == 0){
				if (this.drawingContainer.children.length > 0) {
					this.resetDrawingShape();
				}
			}
		}
	}

	private resetDrawingShape():void{
		this.drawingContainer.removeChildren();
		this.drawingShape.clear();
		this.drawingContainer.addChild(this.drawingShape);
		this.decoContainer.addChildAt(this.drawingContainer, 0);
	}

	private getPolaroidContent(type:string):string {
		let atlasName:string = "texture-" + Model.getInstance().getSelectedCharName();
		let textureName:string = "badGuy_" + Model.getInstance().getSelectedCharName() + "/polaroid" + type;
		return textureName;
	}

	private getRandomRotation():number {
		let randomDegree:number = Math.random() * 60 - 30;
		return randomDegree * Math.PI / 180.0
	}

	private nextButtonClicked = (event:ButtonEvent):void => {
		if (Model.getInstance().gameMode == Model.MODE_STORY) {
			AudioPlayer.getInstance().playSound(SoundNames.S10_ROSA_01_SAA_ER_KAGEN_FAERDIG_LAD_OS_KOMME_AFSTED_MED_DEN);
		}

		this.removeProxySignals();
		this.playOutro();
	}

	private playOutro():void {
		this.createRenderTextureOfCake();
		this.decoScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.nextScene, this);
	}

	private createRenderTextureOfCake():void {
		this.maskDecoCake = new Graphics();
		this.maskDecoCake.beginFill(0xFF0000);
		this.maskDecoCake.alpha = .6; //SceneBase.RECT_COVER_ALPHA;
		this.maskDecoCake.drawRect(0, 0, this.cakeDisplay.width, this.cakeDisplay.height);

		this.decoContainer.setTransform(0, 0);
		this.cakeDisplayClone.mask = null;
		this.cakeDisplayClone.setTransform(0, 0);
		this.completeCakeContainer.updateTransform();

		let renderTextureCake = RenderTexture.create(this.cakeDisplay.width, this.cakeDisplay.height);
		AssetLoader.getInstance().renderer.render(this.completeCakeContainer, renderTextureCake);
		let cake:Sprite = new Sprite(renderTextureCake);
		this.addChild(cake);
		cake.x = this.cakeLocX;
		cake.y = this.cakeLocY;

		Model.getInstance().cake = cake;

		this.decoContainer.visible = false;
		this.cakeDisplayClone.visible = false;
		this.completeCakeContainer.visible = false;

		setTimeout(() => this.decoScene.gotoOuttro(), 500);
	}

	private nextScene = (event:dragonBones.EventObject):void => {
		this.decoScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.nextScene, this);

		if (Model.getInstance().gameMode == Model.MODE_FREE) {
			let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.JUMP, Model.SCENE_PRESENT_CAKE, true);
			this.emit(SceneEvent.JUMP, sceneEvent);
		} else {
			let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
			this.emit(SceneEvent.NEXT, sceneEvent);
		}
	}

	private removeProxySignals():void{
		this.lakridsProxy.signalPiece.remove(this.pieceTouched);
		this.kiwiProxy.signalPiece.remove(this.pieceTouched);
		this.strawberryProxy.signalPiece.remove(this.pieceTouched);
		this.pineappleProxy.signalPiece.remove(this.pieceTouched);
		this.colorProxy.signalPiece.remove(this.pieceTouched);
		this.blueProxy.signalPiece.remove(this.pieceTouched);
		this.cocosProxy.signalPiece.remove(this.pieceTouched);
	}

	public teardown():void {
		if(this.pieceClone != null) {
			this.pieceClone.off(TouchEvent.TOUCH_MOVE, this.pieceMoved);
			this.pieceClone.off(TouchEvent.TOUCH_END, this.pieceMoveDone);
		}

		this.removeProxySignals();

		if(this.glazingButtonBlue != null) {
			this.glazingButtonBlue.off(ButtonEvent.CLICKED, this.glazingBlueClicked);
			this.glazingButtonBlue.dispose();
		}

		if(this.glazingButtonOrange != null) {
			this.glazingButtonOrange.off(ButtonEvent.CLICKED, this.glazingOrangeClicked);
			this.glazingButtonOrange.dispose();
		}

		if(this.glazingButtonRed != null) {
			this.glazingButtonRed.off(ButtonEvent.CLICKED, this.glazingRedClicked);
			this.glazingButtonRed.dispose();
		}

		if(this.glazingButtonWhite != null) {
			this.glazingButtonWhite.off(ButtonEvent.CLICKED, this.glazingWhiteClicked);
			this.glazingButtonWhite.dispose();
		}

		if(this.clearButton != null) {
			this.clearButton.off(ButtonEvent.CLICKED, this.clearButtonClicked);
			this.clearButton.dispose();
		}

		if(this.undoButton != null) {
			this.undoButton.off(ButtonEvent.CLICKED, this.undoButtonClicked);
		}
		if(this.nextButton != null) {
			this.nextButton.off(ButtonEvent.CLICKED, this.nextButtonClicked);
		}

		if(this.decoContainer != null) {
			this.decoContainer.removeChildren();
			if(this.pieceClone != null) {
				this.pieceClone = null;
			}
			this.decoContainer = null;
		}
		if(this.completeCakeContainer != null) {
			this.completeCakeContainer.removeChildren();
			this.removeChild(this.completeCakeContainer);
			this.completeCakeContainer = null;
		}
		if(this.rectCoverNextBtn != null) {
			this.removeChild(this.rectCoverNextBtn);
			this.rectCoverNextBtn = null;
		}
		if(this.rectCoverDrawing != null) {
			this.removeChild(this.rectCoverDrawing);
			this.rectCoverDrawing.off(TouchEvent.TOUCH, this.drawDown);
			this.rectCoverDrawing.off(TouchEvent.TOUCH_MOVE, this.drawMove);
			this.rectCoverDrawing.off(TouchEvent.TOUCH_END, this.drawDone);
			this.rectCoverDrawing.off(TouchEvent.TOUCH_OUT, this.drawDone);
			this.rectCoverDrawing = null;
		}
		if(this.rectCoverAddDeco != null) {
			this.removeChild(this.rectCoverAddDeco);
			this.rectCoverAddDeco.off(TouchEvent.TOUCH, this.addNewDecoPiece);
			this.rectCoverAddDeco = null;
		}

		if(this.decoScene != null) {
			this.decoScene.remove(this);
			this.decoScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.afterIntro, this);
			this.decoScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.nextScene, this);
		}

		if(this._background != null) {
			this.removeChild(this._background);
			this._background = null;
		}

		if(this.farve != null) {
			this.removeChild(this.farve);
			this.farve = null;
		}

		this.addChildAt(this.graphicsHitArea, 0);

		AssetLoader.getInstance().removeTexture(Backgrounds.SCENE9_BG, true);
	}
}
