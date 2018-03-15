
import * as PIXI from "pixi.js";

import { AudioPlayer } from "src/loudmotion/utils/AudioPlayer";

import { Initializer } from "src/rosa/Initializer";
// import {Hospital} from "src/hospital/DRHospital";
import { Logger } from "src/loudmotion/utils/debug/Logger";
import { MainView } from "src/rosa/view/MainView";
import { AssetLoader } from "src/rosa/util/AssetLoader";
import { AssetHelper } from "./AssetHelper";


// interface ModuleEntry {
// 	start(config: ModuleConfig, container: HTMLElement, state: any): Promise<void>;
// 	stop(): Promise<void>;
// 	suspend(): Promise<any>;
// 	removeAll(): Promise<void>;
// }

var callback;
export class Main {
    initializer: Initializer;
    public static ASSETS;
    public static RAMASJANG_API;
    public static DIV_ELEMENT;
    public myAssetHelper: AssetHelper;
    private mainView: MainView;

    constructor() {
        console.log("Main constructor!!!");
        Logger.IS_DEV = true; // for logging to console

    }

    public start(assets: any, api: any, element: any, cb): void {
        console.log("start() - api.version: " + api.version);
        Main.ASSETS = assets;
        Main.RAMASJANG_API = api;
        Main.DIV_ELEMENT = element;
        callback = cb;
        this.myAssetHelper = new AssetHelper();
        this.myAssetHelper.mapSounds();
        this.myAssetHelper.parseSpriteSheets(assets, this.initGame);

    }

    public initGame(): void {
        
        console.log("initGame()");
        this.initializer = new Initializer();
        this.initializer.startGame("testGame", callback);
    }

}