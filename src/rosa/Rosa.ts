//package dk.nozebra.rosa
//{
//	import dk.nozebra.rosa.Initializer;


import {MainView} from "src/rosa/view/MainView";
import {Initializer} from "src/rosa/Initializer";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {SceneEvent} from "./events/SceneEvent";
var _callback;
export class Rosa extends PIXI.Sprite {

	private _initializer:Initializer;
	// private progressBar:ProgressBar; //TODO
	private mainView:MainView;
	private debug:boolean;
	private assetPrefix:string;
	private viewPort:PIXI.Rectangle;

    constructor(debug: boolean = true, callback, assetPrefix:string = "rosa_game_assets/"){
		super();

		Logger.log(this, "Rosa(debug == "+this.debug);
		Logger.log(this, "Rosa(assetPrefix == "+this.assetPrefix);
        _callback = callback;
		this.assetPrefix = assetPrefix;
		this.debug = debug;
		// this.addEventListener( Event.ADDED_TO_STAGE, onAddedToStage );
		this.init();
	}

	//ENQUEUE ASSETS AND LOAD THEM
	//-------------------------------------------------------------------------------------------------------------------------------------
	protected init( event:Event=null ):void {
		Logger.log(this, "Rosa init");

        this.setupAssetManager();
        _callback();
		this.starLoading();
		if (!this.debug) {
			Initializer.showLoaderCallbackFunction();
		}


	}


	//SETTING UP THE ASSETMANAGER
	//-------------------------------------------------------------------------------------------------------------------------------------
	private setupAssetManager():void {
		Logger.log(this, "Rosa.setupAssetManager()");

		// let appDir:File = CheckDevice.assetsPath () //File.applicationDirectory;  //TODO
		// assets = new AssetManager();
		// assets.verbose = Capabilities.isDebugger;
		// assets.verbose = false;
		// assets.enqueue(
		// 	appDir.resolvePath(assetPrefix + "/audio"),
		// 	appDir.resolvePath(assetPrefix + "/textures/1x")
		// );

		// Scale assets to fit stage - REMOVE BEFORE RAMASJANG INTEGRATION??????
		// assets.scaleFactor = 1;

		// Can now be accessed as a static
		// Config.assetManager = assets;
	}


	// LOAD ASSET DATA
	//-------------------------------------------------------------------------------------------------------------------------------------
	private starLoading():void {
		Logger.log(this, "Rosa.starLoading()");

		if (this.debug) {
			// this.progressBar = new ProgressBar (300, 50); //TODO
			// this.addChild(progressBar);
			// Logger.log(this, "progressBar: " + progressBar);

		}
		// assets.loadQueue(function onProgress(ratio:Number):void { //TODO
		// 	if (debug) { progressBar.ratio = ratio	}
		// 	if (ratio == 1) { validateData()		}
		// })

		//TEMP TODO
		this.validateData();
	}


	//-------------------------------------------------------------------------------------------------------------------------------------
	/**
	 * 	Validate if users has saved data before otherwise save default data
	 */

	private validateData():void {
		Logger.log(this, "Rosa validateData()");
		// Config.dataSaver = new DataSaver (Config.STORAGE_FILE_NAME_PATIENTS_CURED, Config.STORAGE_FILE_NAME_DISEASES_CURED);

//		calculateViewPort()
		this.startApp();
	}

	private startApp():void {
			Logger.log(this, "Rosa.startApp()");


			// System.pauseForGCIfCollectionImminent(0);
			// System.gc();

			// Game is inited and ready to be shown
			// if (!this.debug) { Initializer.initDoneCallbackFunction(); }


			this.mainView = new MainView();
			this.mainView.on(SceneEvent.KILL_GAME , this.onkillGame );
			this.addChild(this.mainView);
			this.mainView.init();

			// Hide load. Game is ready
			if (!this.debug) { Initializer.hideLoaderCallbackFunction(); }

			if (this.debug) {
				// progressBar.removeFromParent(true); //TODO
				// progressBar.dispose();
			}
		}

	private onkillGame(e:Event):void {
			Logger.log(this, "Rosa.onkillGame(e)");

			this.mainView.off(SceneEvent.KILL_GAME, this.onkillGame );
			this.removeChild(this.mainView);
			// assets.purge(); //TODO
			this.endGame();
		}

		private endGame():void {
			Logger.log(this, "endGame");
			if (!this.debug) { Initializer.exitCallbackFunction(); }
		}

	public getInitializer():Initializer{
		if(!this._initializer){
			this._initializer = new Initializer();
			return this._initializer;
		}
		Logger.log(this, "getInitializer");

	}





}
