
// import * as xml2js from "xml2js";




import {AssetLoader} from "src/rosa/util/AssetLoader";
import {SoundNames} from "src/rosa/generated/SoundNames";
import {AudioPlayer} from "src/loudmotion/utils/AudioPlayer";
import { Main } from "src/Main";

import {SceneEvent} from "src/rosa/events/SceneEvent";
import {Initializer} from "src/rosa/Initializer";
import {Model} from "src/rosa/model/Model";

import {Scene_01_IntroView} from "src/rosa/view/scenes/Scene_01_IntroView";
import {Scene_02_PickCharView} from "src/rosa/view/scenes/Scene_02_PickCharView";
import {Scene_03_PickDisguise} from "src/rosa/view/scenes/Scene_03_PickDisguise";
import {Scene_04_SneakGameView} from "src/rosa/view/scenes/Scene_04_SneakGameView";
import {Scene_05_GatherCluesView} from "src/rosa/view/scenes/Scene_05_GatherCluesView";
import {Scene_06_PresentCluesView} from "src/rosa/view/scenes/Scene_06_PresentCluesView";
import {Scene_07_BasicIngredientsView} from "src/rosa/view/scenes/Scene_07_BasicIngredientsView";
import {Scene_080_CutCakeView} from "src/rosa/view/scenes/Scene_080_CutCakeView";
import {Scene_081_DecorateCakeView} from "src/rosa/view/scenes/Scene_081_DecorateCakeView";
import {Scene_08_TasteIngredientsView} from "src/rosa/view/scenes/Scene_08_TasteIngredientsView";
import {Scene_08a_Mixing} from "src/rosa/view/scenes/Scene_08a_Mixing";
import {Scene_09_OvenView} from "src/rosa/view/scenes/Scene_09_OvenView";
import {Scene_10_WalkView} from "src/rosa/view/scenes/Scene_10_WalkView";
import {Scene_11_CharThanksView} from "src/rosa/view/scenes/Scene_11_CharThanksView";
import {Scene_12_FreeModePresentView} from "src/rosa/view/scenes/Scene_12_FreeModePresentView";
import {SceneBase} from "src/rosa/view/scenes/SceneBase";

//import {WorldClock} from "./src.dragonBones.animation.WorldClock";

import {ISceneView} from "src/rosa/view/ISceneView";
import {RosaProxy} from "src/rosa/generated/common/armatures/proxies/RosaProxy";
import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {Button} from "src/loudmotion/ui/Button";
import {ButtonEvent} from "src/rosa/typeddb/events/ButtonEvent";




import {BadGuy_bamse__polaroidContentProxy} from "src/rosa/generated/common/armatures/proxies/BadGuy_bamse__polaroidContentProxy";
// import SoundEvent = dragonBones.SoundEvent;
// import SoundEventManager = dragonBones.SoundEventManager;

import {SoundEvent} from "src/dragonBones/core/events/SoundEvent";
import {SoundEventManager} from "src/dragonBones/core/events/SoundEventManager";
import {BackBtn} from "./buttons/BackBtn";
import Container = PIXI.Container;
import Rectangle = PIXI.Rectangle;
import Graphics = PIXI.Graphics;
import Sprite = PIXI.Sprite;
import {AppEvents} from "../../loudmotion/events/AppEvents";

export class MainView extends Sprite {
    //private _rendererDraw:CanvasRenderer;
	static DELAY_TEST_NEXT_SCENE:number = 1000;
    
	static destroying:boolean;

	private bg:Graphics;

	private isMuted:boolean = false;
	private _typeddb:TypedDBFactory;

	// [Embed(source = "/../media/rosa/skeleton.xml", mimeType = "application/octet-stream")] //TODO
	// private SkeletonXML:xml2js; // TODO was XML;
	private SkeletonXML:any; // TODO was XML;

	private scenes:SceneBase[]; // TODO was Vector.<SceneBase>;
	// private currentView:SceneBase; // PIXI.Sprite;

	// from viewmanager for resizing canvas
	private r_old: number;
	private r_new: number;
	private old_w: number = AssetLoader.STAGE_WIDTH;
	private old_h: number = AssetLoader.STAGE_HEIGHT;
	public new_w: number = 1;
    public new_h: number = 1;
    public ori_w: number = window.innerWidth;
    public ori_h: number = window.innerHeight;

	private currentSceneIndex:number = 0;

    private stage: Container;
	private _localStorageAvailable:boolean;
	private currentScene:SceneBase;
	// private sceneContainer:Sprite;
	public btnBack:BackBtn;

    

    
	constructor(){
		super();
		// this.addListener(starling.events.Event.ADDED_TO_STAGE, this.added);
		// this.init();
	}
    
	private added(event:PIXI.utils.EventEmitter):void {
		// this.removeListener(starling.events.Event.ADDED_TO_STAGE, this.added);

	}

    public init(): void{
		Logger.log(this, "MainView init");
		AudioPlayer.getInstance().volume = .8;

		if(Initializer.showLoaderCallbackFunction != null) {
			Initializer.showLoaderCallbackFunction(); //TODO
		}

		AssetLoader.getInstance().init(this.textureCompleteHandler1); //TODO need this to get stage setup in AssetLoader

		this.stage = AssetLoader.getInstance().stage;
        Logger.log(this, "MainView init  this.stage === " + this.stage);
        //this.stage = AssetLoader.getInstance().stage;
		// Config.safeFrame = new Rectangle((AssetLoader.STAGE_WIDTH-1024) * 0.5, 0, 1024, AssetLoader.STAGE_HEIGHT); //TODO from hospitalGame
		// bg = new Quad(stage.stageWidth, stage.stageHeight, 0x12001a);
		// addChild(bg);

		this.bg = new Graphics();
		this.bg.beginFill(0x12001a);
		//// set the line style to have a width of 5 and set the color to red
		//// this.background.lineStyle(5, 0xFF0000);
		//// draw a rectangle
		this.bg.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
		//this.stage.addChild(this.bg);
		this.addChild(this.bg);

		//AssetLoader.getInstance().init(this.assetsLoaderComplete); //TODO need this to get stage setup in AssetLoader


        let aspect: number = AssetLoader.getInstance().renderer.view.clientWidth / AssetLoader.getInstance().renderer.view.clientHeight;
		Logger.log(this, "MainView  init  aspect == "+aspect);

		$(window).on('resize', this.handleResize);
		this.handleResize();
        //let offsetx = this.new_w / this.ori_w;
        //let offsety = this.new_h / this.ori_h;
        //let x = (AssetLoader.STAGE_WIDTH - 1024) * 0.5;
        //let xTemp = x * offsetx;
        //let xEnd = xTemp - x;
        //AssetLoader.safeFrame = new Rectangle(Math.floor(xTemp)+100, 0, 1024-xEnd-100, AssetLoader.STAGE_HEIGHT);

		if (Modernizr.localstorage) {
			// window.localStorage is available!
			this._localStorageAvailable = true;
			Logger.log(this, "MainView init  : Modernizr says : window.localStorage is available!");
		} else {
			// no native support for local storage :(
			// try a fallback or another third-party solution
			Logger.log(this, "MainView Modernizr says : NO GOOD no native support for local storage");
		}
      
        AssetLoader.getInstance().onAssetsLoaded();

       
        
        


        
	}

	private textureCompleteHandler1 = (resources:dragonBones.Map<PIXI.loaders.Resource>):void => {
        Logger.log(this, "MainView textureCompleteHandler1");
        this.onSoundsLoadedComplete();
		////this.setupUI();
	}

	private setupUI():void {
		Logger.log(this, "MainView setupUI");
        
		// this.btnBack = new BackBtn(this, SceneEvent.QUIT_APP);

	}
    //update = (): void => {
    //    if (!MainView.destroying && this.stage && this.stage.children.length > 0) {
            
    //        this._renderer.render(this.stage);


    //        //if (this.stageDraw != null) {
    //        //    this._rendererDraw.render(this.stageDraw);
    //        //}

    //        //dragonBones.WorldClock.clock.advanceTime(e.delta * 0.001);
    //        //dragonBones.WorldClock.clock.advanceTime(-1);

    //        let now = new Date().getTime();
    //        dragonBones.WorldClock.clock.advanceTime((now - this.timePassed) * 0.001);
    //        // dragonBones.WorldClock.clock.advanceTime(-1);
    //        this.timePassed = now;
    //        // Main.applyRatio(this.stage, Main.ratio);
    //    }
    //    requestAnimationFrame(this.update);
    //}
	private setupRosa():void {
		Logger.log(this, "MainView setupRosa");
		this.scenes = []; // TODO was new Vector.<ISceneView>();
		this.scenes.push(new Scene_01_IntroView());

		this.scenes.push(new Scene_02_PickCharView());
		this.scenes.push(new Scene_03_PickDisguise());
		this.scenes.push(new Scene_04_SneakGameView());
		this.scenes.push(new Scene_05_GatherCluesView());
		this.scenes.push(new Scene_06_PresentCluesView());
		this.scenes.push(new Scene_07_BasicIngredientsView());
		this.scenes.push(new Scene_08_TasteIngredientsView());
		this.scenes.push(new Scene_08a_Mixing());
		this.scenes.push(new Scene_09_OvenView());
		this.scenes.push(new Scene_080_CutCakeView());
		this.scenes.push(new Scene_081_DecorateCakeView());
		this.scenes.push(new Scene_10_WalkView());
		this.scenes.push(new Scene_11_CharThanksView());
		this.scenes.push(new Scene_12_FreeModePresentView());

		this._typeddb = AssetLoader.getInstance().typeddb;

		this.currentSceneIndex = Model.SCENE_INTRO;

		this.addScene();
	}

	private onSoundsLoadedComplete = ():void => {
		Logger.log(this, "onSoundsLoadedComplete: what next?");

		//AssetLoader.getInstance().removeProgressBar();
		this.setupRosa();
	}

	static rosaSpeak(soundName:string, rosa:RosaProxy):void {
		Logger.log(this, "MainView rosaSpeak : soundName == "+soundName);

        let snd: Howl = AudioPlayer.getInstance().playSound(soundName);
		rosa.gotoTalk();
		rosa.getHead().gotoTalk();

		try{
            snd.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
                snd.off(AudioPlayer.SOUND_COMPLETE);
				rosa.gotoDefault();
				rosa.getHead().gotoDefault();
				Logger.log(this, "SOUND_COMPLETE : sound : rosaSpeak onComplete");
			});
		} catch (error) {
			Logger.log(this, "ERROR : sound : rosaSpeak onComplete");
		}
	}

	static rosaSpeakWithoutState(soundName:string, rosa:RosaProxy):void {
		Logger.log(this, "MainView rosaSpeakWithoutState : soundName == "+soundName);

        let snd: Howl = AudioPlayer.getInstance().playSound(soundName);
		rosa.gotoTalk();
		rosa.getHead().gotoTalk();

		try{
            snd.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
                snd.off(AudioPlayer.SOUND_COMPLETE);
				rosa.gotoDefault();
				rosa.getHead().gotoDefault();
				Logger.log(this, "SOUND_COMPLETE : sound : rosaSpeakWithoutState onComplete");
			});
		} catch (error) {
			Logger.log(this, "ERROR : sound : rosaSpeakWithoutState onComplete");
		}
	}

	static rosaSpeakRandom(sounds:any[], rosa:RosaProxy):void {
		Logger.log(this, "MainView rosaSpeakRandom : sounds == "+sounds);

        let snd: Howl = AudioPlayer.getInstance().playRandomSound(sounds);
		rosa.gotoTalk();
		rosa.getHead().gotoTalk();

		try{
            snd.on(AudioPlayer.SOUND_COMPLETE, (e: Event) => {
                snd.off(AudioPlayer.SOUND_COMPLETE);
				rosa.gotoDefault();
				rosa.getHead().gotoDefault();
				Logger.log(this, "SOUND_COMPLETE : sound : rosaSpeakRandom onComplete");
			});
		} catch (error) {
			Logger.log(this, "ERROR : sound : rosaSpeakRandom onComplete");
		}
	}

	static rosaSpeakDone():void {
	}


	private playSound = (event:SoundEvent):void => {
	// private playSound(event:PIXI.utils.EventEmitter):void { //TODO SoundEvent
		// Logger.log(this, "MainView Play sound:" + event.sound);
		Logger.log(this, "MainView Play sound:");
		Logger.log(this, "MainView Play sound:  event.sound === "+event.sound);

		if (event.sound.indexOf("splat") == -1 && event.sound.indexOf("skridt-A") == -1) { //TODO
			// SoundAS.group("fx").stopAll(); //TODO
			AudioPlayer.getInstance().stopAllSounds();
		}

		let soundName:string = event.sound.substr(0, event.sound.length - 4); //TODO
		soundName = this.strReplace(soundName, "å", "aa");

		// SoundAS.group("fx").play(soundName); //TODO
		AudioPlayer.getInstance().playSound(soundName);
		// AudioPlayer.getInstance().playSound(this.currentMusic, 999, Config.MUSIC_VOLUME_LEVEL);
	}

	// private handleSceneProgress = (e:SceneEvent):void => {
	private handleSceneProgress = (event:SceneEvent):void => {
		Logger.log(this, "MainView MainView handleSceneProgress");
		Logger.log(this, "MainView MainView handleSceneProgress event.type == "+event.type);
		Logger.log(this, "MainView MainView handleSceneProgress event.nextSceneIndex == "+event.nextSceneIndex);
		Logger.log(this, "MainView MainView handleSceneProgress this.currentSceneIndex == "+this.currentSceneIndex);

		

		// SoundAS.stopAll(); //TODO
        AudioPlayer.getInstance().stopAllSounds(true);

        this.removeScene();

		switch (event.type) {
			case SceneEvent.JUMP:
				this.currentSceneIndex = event.nextSceneIndex;
				break;
			case SceneEvent.NEXT:
				this.currentSceneIndex++;
				break;
			case SceneEvent.PREVIOUS:
				this.currentSceneIndex--;
				break;
		}

		this.addScene();
	}

	private removeScene = ():void => {

		if(this.stage != null) {
			if (this.currentScene != null) {
				this.stage.removeChild(this.currentScene);

				this.currentScene.off(SceneEvent.NEXT, this.handleSceneProgress);
				this.currentScene.off(SceneEvent.PREVIOUS, this.handleSceneProgress);
				this.currentScene.off(SceneEvent.JUMP, this.handleSceneProgress);
				this.currentScene.off(SceneEvent.REPLAY_FREEMODE, this.onReplayFreemode);
				this.currentScene.off(SceneEvent.REPLAY_STORY, this.onReplayStory);
				this.currentScene.off(SceneEvent.QUIT_APP, this.destroyApp);
			}

			if(this.btnBack != null) {

				this.btnBack.off(SceneEvent.QUIT_APP, this.backButtonClicked);
				this.btnBack.off(SceneEvent.QUIT_APP, this.destroyApp);
				this.btnBack.destroy();
				this.btnBack = null;
			}
		}
	}

	private addScene = ():void => {
		Logger.log(this, "MainView MainView addScene");
		this.currentScene = this.scenes[this.currentSceneIndex];
		Logger.log(this, "MainView MainView addScene  this.currentSceneIndex == "+this.currentSceneIndex);
		Logger.log(this, "MainView MainView addScene  this.currentScene == "+this.currentScene.name);

        if (this.currentSceneIndex == 0) {
            AudioPlayer.getInstance().playSound(Model.MUSIC_ROSA_HYGGE, 3000, Model.VOLUME_MUSIC);
            Main.RAMASJANG_API.sendMessage("DRRS_SHOW_BACK_BUTTON", {});
        } else {
            Main.RAMASJANG_API.sendMessage("DRRS_HIDE_BACK_BUTTON", {});
        }
		this.currentScene.setup(this._typeddb);
		this.stage.addChild (this.currentScene);
		this.currentScene.show();

		this.currentScene.on(SceneEvent.NEXT, this.handleSceneProgress);
		this.currentScene.on(SceneEvent.PREVIOUS, this.handleSceneProgress);
		this.currentScene.on(SceneEvent.JUMP, this.handleSceneProgress);
		this.currentScene.on(SceneEvent.REPLAY_FREEMODE, this.onReplayFreemode);
		this.currentScene.on(SceneEvent.REPLAY_STORY, this.onReplayStory);
		this.currentScene.on(SceneEvent.QUIT_APP, this.destroyApp);
        if (this.currentSceneIndex != 0) {
            this.btnBack = new BackBtn(this.stage, SceneEvent.QUIT_APP);
            this.btnBack.on(SceneEvent.QUIT_APP, this.backButtonClicked);
        }
	}



	private backButtonClicked = (event:SceneEvent):void => {
		Logger.log(this, "MainView backButtonClicked  this.currentSceneIndex == "+this.currentSceneIndex);
		if (this.currentSceneIndex == Model.SCENE_INTRO) {
			this.destroyApp();

			if(Initializer.exitCallbackFunction != null) {
				Initializer.exitCallbackFunction(this);
			}
		} else {
			this.handleSceneProgress(new SceneEvent(SceneEvent.JUMP, Model.SCENE_INTRO, true))
		}
	}

	private disposeCharacter = ():void => {
		Logger.log(this, "MainView disposeCharacter");
		let model:Model = Model.getInstance();

		model.cake = null;
		model.cakeCut = null;
		if (model.charIsSelected) {
			let characterName:string = Model.getInstance().getSelectedCharName();
			Logger.log(this, "MainView disposeCharacter characterName == "+characterName);

			let assetsToRemove:string[] = [
				"Scene3_{char}_bg",
				"Scene4_{char}_bg",
				"background-{char}",
				"inside-{char}",
				"texture-{char}"
			];

			try{
				//for each (let assetToRemove:string in assetsToRemove) {
				for (let assetToRemove of assetsToRemove) {
					assetToRemove = assetToRemove.replace(/\{char\}/g, characterName);

					Logger.log(this, "MainView Removing character texture '" + assetToRemove + "'");
					AssetLoader.getInstance().removeTexture(assetToRemove, true);

					Logger.log(this, "MainView Removing character texture atlas '" + assetToRemove + "' from dragonBones..");
					this._typeddb._factory.removeTextureAtlasData(assetToRemove); //    .removeTextureAtlas(assetToRemove);

					Logger.log(this, "MainView Removing character texture atlas '" + assetToRemove + "'");
					AssetLoader.getInstance().removeTextureAtlas(assetToRemove, true);
				}
			} catch (Error) {
				Logger.log(this, "ERROR MainView removing assetsToRemove");
			}


			model.charIsSelected = false;
		}
	}

	private onReplayStory = (event:SceneEvent):void => {
		Logger.log(this, "MainView MainView onReplayStory");

		Model.getInstance().gameMode = Model.MODE_STORY;
		this.disposeCharacter();
		this.handleSceneProgress(new SceneEvent(SceneEvent.JUMP, Model.SCENE_PICK_CHAR, true));
	}

	private onReplayFreemode = (event:SceneEvent):void => {
		Logger.log(this, "MainView MainView onReplayFreemode");
		Model.getInstance().gameMode = Model.MODE_FREE;
		this.disposeCharacter(); //TODO do we need this?
		this.handleSceneProgress(new SceneEvent(SceneEvent.JUMP, Model.SCENE_PRESENT_CLUES, true));
	}

	private strReplace(str:string, search:string, replace:string):string {
		return str.split(search).join(replace);
	}

	public handleResize = (event:Event = null):void => {
        // Logger.log(this, "MainView MainView handleResize");
        //http://stackoverflow.com/questions/6023488/how-to-proportionally-respecting-aspect-ratio-scale-a-rectangle
        this.new_w = window.innerWidth;
        this.new_h = window.innerHeight;

        this.r_old = this.old_w / this.old_h;
        this.r_new = this.new_w / this.new_h;
        let width: number;
        let height: number;
        if (this.r_old > this.r_new)
        {
            width = this.new_w;
            console.log("BEFORE: " + width);
            height = width / this.r_old;
            AssetLoader.getInstance().ratioX = width;
            width = width * this.new_h / height;
            console.log("AFTER: " + width);
            AssetLoader.getInstance().ratioX = width - AssetLoader.getInstance().ratioX;
            AssetLoader.getInstance().rosaCSS.innerHTML += ".center-this {position: absolute; left: -" + Math.floor(AssetLoader.getInstance().ratioX / 2) + "px; -webkit - transform: translate(-50 %, 0);}"
            height = this.new_h;


        } else
        {
            
            height = this.new_h;
            console.log("BEFORE: " + height);
            width = height * this.r_old;
            AssetLoader.getInstance().ratioY = height;
            height = height * this.new_w / width;
            console.log("AFTER: " + height);
            AssetLoader.getInstance().ratioY = height - AssetLoader.getInstance().ratioY;
            AssetLoader.getInstance().rosaCSS.innerHTML += ".center-this {position: absolute; top: -" + Math.floor(AssetLoader.getInstance().ratioY / 2) + "px; -webkit - transform: translate(-50 %, 0);}"
            width = this.new_w;
        }
        //let extra = this.new_w - width;
        //width += extra;
        
        AssetLoader.getInstance().rosaCanvas.style.width = width + "px"; //TODO orig
        AssetLoader.getInstance().rosaCanvas.style.height = height + "px";
        AssetLoader.newWidth = width;
        AssetLoader.newHeight = height;
        
        this.new_w = width;
        this.new_h = height;
    
	}

	public destroyApp = ():void => {
		Logger.log(this, "MainView destroyApp");
		try{
			$(window).off('resize', this.handleResize);
		} catch (error) {}

		try{
			AudioPlayer.getInstance().stopAllSounds();
			AudioPlayer.getInstance().destroy();
		} catch (error) {}

		try{
			this.disposeCharacter();
		} catch (error) {}

		if(this.bg != null) {
			this.removeChild(this.bg);
			this.bg = null;
		}

		if (Model.getInstance().cakeTexture != null) {
			// Model.getInstance().cakeTexture.dispose(); //TODO dispose
			Model.getInstance().cakeTexture = null;
		}

		try{
			this.removeScene();
		} catch (error) {}

		try{
			AssetLoader.getInstance().removeChildren();
		} catch (Error) {
			Logger.log(this, "ERROR MainView removing this.stage.removeChildren(0, this.stage.children.length)");
		}

		Logger.log(this, "MainView AFTER this.stage.removeChildren  AssetLoader.getInstance().stage.children.length === "+AssetLoader.getInstance().children.length);

		try{
			AssetLoader.getInstance().destroy();
		} catch (Error) {
			Logger.log(this, "ERROR MainView AssetLoader.getInstance().destroy()");
		}

		try{
			dragonBones.WorldClock.clock.clear();
		} catch (error) {}


		Logger.log(this, "MainView destroyApp AFTER AssetLoader.getInstance().destroy");

		MainView.destroying = true;

		this.emit(AppEvents.KILL_GAME);

	}

	//TODO implement destroy : https://github.com/pixijs/pixi.js/issues/3130
	// ngOnDestroy():void {
	// 	this.ticker.stop();
	// 	Object.keys(PIXI.utils.TextureCache).forEach((texture) => {
	// 		PIXI.utils.TextureCache[texture].destroy({baseTexture:true});
	// 	});
	// 	this.stage.destroy(true);
	// 	this.renderer.destroy(true);
	// }


}
