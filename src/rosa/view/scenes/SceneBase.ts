import {Logger} from "src/loudmotion/utils/debug/Logger";

import {TypedDBFactory} from "src/rosa/generated/common/armatures/TypedDBFactory";

import {TouchPhase} from "src/loudmotion/events/TouchLoudPhase";
import {TouchEvent} from "src/loudmotion/events/TouchLoudEvent";
import {Touch} from "src/loudmotion/events/TouchLoud";
import Sprite = PIXI.Sprite;
import {BackBtn} from "../buttons/BackBtn";
import AbstractSoundInstance = createjs.AbstractSoundInstance;
import {Model} from "../../model/Model";
import Container = PIXI.Container;
import {AssetLoader} from "../../util/AssetLoader";

export class SceneBase extends Sprite {

    sceneName:string;

    public static RECT_COVER_ALPHA:number = 0.01;
    public _name:string;
    public btnBack:BackBtn;
    public btnToWaitingRoom:BackBtn;
    public mouseDown:boolean;
    protected stage:Container;

    protected sndSpeak:AbstractSoundInstance;
    protected sndSpeakDone:AbstractSoundInstance;

    constructor(){
        super();
        this.interactive = true;
        this.stage = AssetLoader.getInstance().stage;
    }

    setup(typed:TypedDBFactory):void{

    }

    public set name(_name:string){
        this._name = _name;
    }

    public get name():string{
        return this._name;
    }

    public show():void {
        this.visible = true;
    }

    public hide():void {
        this.visible = false;

    }

    public destroy():void {
        clearTimeout(Model.currentTimeout);

        // this.removeChildren();
    }

    public init():void {}

    teardown():void{

    }

    isIntersecting(r1, r2):boolean {
    	return !(r2.x > (r1.x + r1.width) || (r2.x + r2.width) < r1.x || r2.y > (r1.y + r1.height) || (r2.y + r2.height) < r1.y);
    }

}

