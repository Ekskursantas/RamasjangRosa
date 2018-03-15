
import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";

import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";
import {DragManager} from "src/rosa/dragdrop/DragManager";
import {SceneEvent} from "src/rosa/events/SceneEvent";

import {ISceneView} from "src/rosa/view/ISceneView";
import {IDragable} from "src/rosa/typeddb/interfaces/IDragable";
import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
import {MagreteBowlProxy} from "src/rosa/generated/common/armatures/proxies/MagreteBowlProxy";
import {Scene6_mixDefaultsProxy} from "src/rosa/generated/common/armatures/proxies/Scene6_mixDefaultsProxy";
import {Ingredience_milkProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_milkProxy";
import {Ingredience_sugarProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_sugarProxy";
import {Ingredience_cacaoProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_cacaoProxy";
import {Ingredience_flourProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_flourProxy";
import {Ingredience_oilProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_oilProxy";
import {Ingredience_yeastProxy} from "src/rosa/generated/common/armatures/proxies/Ingredience_yeastProxy";

import {RosaProxy} from "src/rosa/generated/common/armatures/proxies/RosaProxy";
import {NextArrowButton} from "src/rosa/generated/common/armatures/buttons/NextArrowButton";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";

import {Backgrounds} from "src/rosa/generated/common/backgrounds/Backgrounds";
import {Model} from "src/rosa/model/Model";
import {MainView} from "src/rosa/view/MainView";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import Rectangle = PIXI.Rectangle;
import Sprite = PIXI.Sprite;
import Point = PIXI.Point;
import Graphics = PIXI.Graphics;
import EventEmitter = PIXI.utils.EventEmitter;
import InteractionEvent = PIXI.interaction.InteractionEvent;
import {SpriteHelper} from "../../../loudmotion/utils/SpriteHelper";


export class Scene_07_BasicIngredientsView extends SceneBase implements ISceneView {
	private _typeddb:TypedDBFactory;
	private _background:Sprite;
	private _draggedItems:number = 0;

	private _basicIngScene:Scene6_mixDefaultsProxy;

	private nextButton:NextArrowButton;

	private dragable:IDragable;

	private static MILK:string = "rosa_milk";
	private static SUGAR:string = "rosa_sugar";
	private static CACAO:string = "rosa_cacao";
	private static FLOUR:string = "rosa_flour";
	private static OIL:string = "rosa_oil";
	private static YEAST:string = "rosa_yeast";

	private milk:Ingredience_milkProxy;
	private sugar:Ingredience_sugarProxy;
	private cacao:Ingredience_cacaoProxy;
	private flour:Ingredience_flourProxy;
	private oil:Ingredience_oilProxy;
	private yeast:Ingredience_yeastProxy;

	private rectCover:Graphics;
	private rectDropTargetCover:Graphics;
	private rectRosaTargetCover:Graphics;

	private bowl:Sprite;
	private rosaHead:Sprite;
	private hitRosaHead:boolean;
	private startPoint:Point;

	constructor() {
		super();
		this.name = "Scene_07_BasicIngredientsView";
	}

	public setup(typeddb:TypedDBFactory):void {
		Logger.log(this, "Scene_07_BasicIngredientsView setup");
		this._draggedItems = 0;

		this._typeddb = typeddb;

		this._background = Sprite.fromFrame(Backgrounds.SCENE1_BG);
		this.addChild(this._background);

		this._basicIngScene = this._typeddb.buildScene6_mixDefaultsArmature();
		this._basicIngScene.display.x = 0;
		this._basicIngScene.display.y = 0;
		this._basicIngScene.gotoIntro();
		this._basicIngScene.show(this);

		this.milk = this._basicIngScene.getIngredience_milk();
		this.milk.display.name = Scene_07_BasicIngredientsView.MILK;
		this.milk.display.interactive = true;
		this.milk.display.buttonMode = true;
		this.milk.display.on(TouchEvent.TOUCH, this.touchDown);
		this.milk.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.milk.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.sugar = this._basicIngScene.getIngredience_sugar();
		this.sugar.display.name = Scene_07_BasicIngredientsView.SUGAR;
		this.sugar.display.interactive = true;
		this.sugar.display.buttonMode = true;
		this.sugar.display.on(TouchEvent.TOUCH, this.touchDown);
		this.sugar.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.sugar.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.cacao = this._basicIngScene.getIngredience_cacao();
		this.cacao.display.name = Scene_07_BasicIngredientsView.CACAO;
		this.cacao.display.interactive = true;
		this.cacao.display.buttonMode = true;
		this.cacao.display.on(TouchEvent.TOUCH, this.touchDown);
		this.cacao.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.cacao.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.flour = this._basicIngScene.getIngredience_flour();
		this.flour.display.name = Scene_07_BasicIngredientsView.FLOUR;
		this.flour.display.interactive = true;
		this.flour.display.buttonMode = true;
		this.flour.display.on(TouchEvent.TOUCH, this.touchDown);
		this.flour.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.flour.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.oil = this._basicIngScene.getIngredience_oil();
		this.oil.display.name = Scene_07_BasicIngredientsView.OIL;
		this.oil.display.interactive = true;
		this.oil.display.buttonMode = true;
		this.oil.display.on(TouchEvent.TOUCH, this.touchDown);
		this.oil.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.oil.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.yeast = this._basicIngScene.getIngredience_yeast();
		this.yeast.display.name = Scene_07_BasicIngredientsView.YEAST;
		this.yeast.display.interactive = true;
		this.yeast.display.buttonMode = true;
		this.yeast.display.on(TouchEvent.TOUCH, this.touchDown);
		this.yeast.display.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.yeast.display.on(TouchEvent.TOUCH_END, this.touchDone);

		this.nextButton = new NextArrowButton(this._basicIngScene.getNextArrow().armature);
		this.nextButton.on(ButtonEvent.CLICKED, this.nextButtonClicked);

		MainView.rosaSpeak(SoundNames.S06_ROSA_01_VI_STARTER_MED_AT_LAVE_EN_DEJ, this._basicIngScene.getRosa());

		this.bowl = this._basicIngScene.getMagreteBowl().display;
		this.bowl.interactive = true;
		this.bowl.buttonMode = true;

		this.rosaHead = this._basicIngScene.getRosa().getHead().display;
		this.rosaHead.interactive = true;
		this.rosaHead.buttonMode = true;

		this.rectRosaTargetCover = new Graphics();
		this.rectRosaTargetCover.beginFill(0xFFFFFF);
		this.rectRosaTargetCover.alpha = .3;
		this.rectRosaTargetCover.drawRect(this.rosaHead.getBounds().x, this.rosaHead.getBounds().y, this.rosaHead.getBounds().width, this.rosaHead.getBounds().height);

		this.rectDropTargetCover = new Graphics();
		this.rectDropTargetCover.beginFill(0xFFFFFF);
		this.rectDropTargetCover.alpha = .3;
		this.addChild(this.rectDropTargetCover);
		this.rectDropTargetCover.drawRect(this.bowl.getLocalBounds().x, this.bowl.getLocalBounds().y, this.bowl.getBounds().width, this.bowl.getBounds().height);
	}

	private touchDown = (event:InteractionEvent):void => {
		let rosa:RosaProxy = this._basicIngScene.getRosa();

		switch(event.currentTarget.name) {
			case Scene_07_BasicIngredientsView.MILK:
				this.dragable = this.milk;
				break;
			case Scene_07_BasicIngredientsView.SUGAR:
				this.dragable = this.sugar;
				break;
			case Scene_07_BasicIngredientsView.CACAO:
				this.dragable = this.cacao;
				break;
			case Scene_07_BasicIngredientsView.FLOUR:
				this.dragable = this.flour;
				break;
			case Scene_07_BasicIngredientsView.OIL:
				this.dragable = this.oil;
				break;
			case Scene_07_BasicIngredientsView.YEAST:
				this.dragable = this.yeast;
				break;
		}

		if(this.dragable != null) {
			this.mouseDown = true;
			this.startPoint = new Point(this.dragable.display.x, this.dragable.display.y);
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.dragable.display.x = Math.abs(mousePositionCanvas.x);
			this.dragable.display.y = Math.abs(mousePositionCanvas.y);
		}
	}

	private touchMove = (event:TouchEvent):void => {
		let rosa:RosaProxy = this._basicIngScene.getRosa();
		if(this.mouseDown && this.dragable != null) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.dragable.display.x = Math.abs(mousePositionCanvas.x);
			this.dragable.display.y = Math.abs(mousePositionCanvas.y);

			if(this.bowl != null) {
				let hit:boolean = this.testForIntersection(this.dragable.display.getBounds(), this._basicIngScene.getMagreteBowl());
				if (hit) {
				}
			}
			if(this.rosaHead != null) {
				this.hitRosaHead = SpriteHelper.hitTest(this.dragable.display.getBounds(), this.rosaHead.getBounds());
				if (this.hitRosaHead) {
					if (rosa.armature.animation.lastAnimationName != "taste") {
						rosa.gotoTaste();
					}
				} else {
					if (rosa.armature.animation.lastAnimationName != "idle") {
						rosa.gotoIdle();
					}
				}
			}
		}
	}

	private touchDone = (event:TouchEvent):void => {
		this.mouseDown = false;
		if(this.dragable != null) {
			let rosa: RosaProxy = this._basicIngScene.getRosa();
			if (this.bowl != null) {
				let hit:boolean = this.testForIntersection(this.dragable.display.getBounds(), this._basicIngScene.getMagreteBowl());
				if(hit) {
					this._draggedItems++;
					let margretheBowl: MagreteBowlProxy = this._basicIngScene.getMagreteBowl();
					margretheBowl["gotoDej_" + this._draggedItems]();
					MainView.rosaSpeakRandom([SoundNames.S06_ROSA_02_YES_DEN_SKAL_I, SoundNames.S06_ROSA_03_JA_DEN_SKAL_I, SoundNames.S06_ROSA_05_DEN_ER_GOD], this._basicIngScene.getRosa());
					if (this._draggedItems >= 6) {
						this._basicIngScene.gotoReady();
					}

					this.dragable.gotoDrop();
					this.dragable.display.off(TouchEvent.TOUCH, this.touchDown);
					this.dragable.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
					this.dragable.display.off(TouchEvent.TOUCH_END, this.touchDone);
					this.dragable.display.visible = false;
				}else{
					if(this.startPoint != null){
						this.dragable.display.x = this.startPoint.x;
						this.dragable.display.y = this.startPoint.y;
					}
				}
			}

			if (this.rosaHead != null) {
				if (this.hitRosaHead) {
					if (this.dragable instanceof Ingredience_cacaoProxy || this.dragable instanceof Ingredience_sugarProxy || this.dragable instanceof Ingredience_milkProxy) {
						rosa.gotoSweet();
					} else {
						rosa.gotoSour()
					}
					this.playRosaTasteSound(this.dragable);
				} else {
					if (rosa.armature.animation.lastAnimationName == "taste") {
						rosa.gotoIdle();
					}
				}
			}
			this.hitRosaHead = false;
			this.dragable.gotoDefault();
			this.dragable.display.removeChild(this.rectCover);
		}
	}

	private testForIntersection(rect:Rectangle, armature:IArmatureProxy):boolean {
		let target:Sprite = armature.display;
		let targetRect:Rectangle = rect;
		let hit:boolean = this.isIntersecting(target, targetRect);
		return hit;
	}

	private nextButtonClicked = (event:ButtonEvent):void => {
		this.playOutro();
	}

	private playRosaTasteSound(armature:IDragable):void {
		AudioPlayer.getInstance().stopAllSounds();
		if (armature instanceof Ingredience_milkProxy) { MainView.rosaSpeakWithoutState(SoundNames.S06_ROSA_19_SMAG_MILK, this._basicIngScene.getRosa());  }
		if (armature instanceof Ingredience_sugarProxy) { MainView.rosaSpeakWithoutState(SoundNames.S06_ROSA_20_SMAG_SUGAR, this._basicIngScene.getRosa()); }
		if (armature instanceof Ingredience_cacaoProxy) { MainView.rosaSpeakWithoutState(SoundNames.S06_ROSA_24_SMAG_CACAO, this._basicIngScene.getRosa()); }
		if (armature instanceof Ingredience_flourProxy) { MainView.rosaSpeakWithoutState(SoundNames.S07_ROSA_11_SMAG_FLOUR, this._basicIngScene.getRosa());  }
		if (armature instanceof Ingredience_oilProxy) { MainView.rosaSpeakWithoutState(SoundNames.S07_ROSA_12_SMAG_OIL, this._basicIngScene.getRosa());  }
		if (armature instanceof Ingredience_yeastProxy) { MainView.rosaSpeakWithoutState(SoundNames.S07_ROSA_12_SMAG_OIL, this._basicIngScene.getRosa());  }
	}

	private playOutro():void {
		this._basicIngScene.armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		this._basicIngScene.gotoOuttro();
	}

	private proceed = (event:dragonBones.EventObject):void => {
		this._basicIngScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		let sceneEvent:SceneEvent = new SceneEvent(SceneEvent.NEXT, 0, true);
		this.emit(SceneEvent.NEXT, sceneEvent);
	}

	public teardown():void {

		if(this.rectDropTargetCover != null) {
			this.removeChild(this.rectDropTargetCover);
			this.rectDropTargetCover = null;
		}

		if(this.milk != null) {
			this.milk.display.off(TouchEvent.TOUCH, this.touchDown);
			this.milk.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.milk.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.sugar != null) {
			this.sugar.display.off(TouchEvent.TOUCH, this.touchDown);
			this.sugar.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.sugar.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.cacao != null) {
			this.cacao.display.off(TouchEvent.TOUCH, this.touchDown);
			this.cacao.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.cacao.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.flour != null) {
			this.flour.display.off(TouchEvent.TOUCH, this.touchDown);
			this.flour.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.flour.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.oil != null) {
			this.oil.display.off(TouchEvent.TOUCH, this.touchDown);
			this.oil.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.oil.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this.yeast != null) {
			this.yeast.display.off(TouchEvent.TOUCH, this.touchDown);
			this.yeast.display.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.yeast.display.off(TouchEvent.TOUCH_END, this.touchDone);
		}

		if(this._basicIngScene != null) {
			this._basicIngScene.remove(this);
			this._basicIngScene.armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.proceed, this);
		}

		if(this.nextButton != null) {
			this.nextButton.off(ButtonEvent.CLICKED, this.nextButtonClicked);
		}

		if(this._background != null) {
			this.removeChild(this._background);
		}
	}
}
