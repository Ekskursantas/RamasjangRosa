
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {Button} from "../../../loudmotion/ui/Button";
import {Sprite, Texture} from "pixi.js";
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";
import {SceneEvent} from "../../events/SceneEvent";
import {AssetLoader} from "../../util/AssetLoader";
import {ButtonEvent} from "../../typeddb/events/ButtonEvent";
import Container = PIXI.Container;


export class BackBtn extends Sprite {

    public static OFFSET_X: number = 20;
    public static OFFSET_Y: number = 20;

    public btnBack:Button;
    private destination:string;
    private stage:Container;
    private textureName:string;

    constructor(stage:Container, destination:string = SceneEvent.PREVIOUS, textureName:string = "BackArrow", posRight:boolean=false) {
        super();
        this.stage = stage;
        this.destination = destination;
        this.textureName = textureName;
        this.createButton(posRight);
    }

    private createButton(posRight:boolean=false):void{
        this.btnBack = new Button();
        this.btnBack.addTexture(Texture.fromFrame(this.textureName));
        this.stage.addChild(this.btnBack);
        this.btnBack.pivot.x = Math.floor(this.btnBack.width * .5);
        this.btnBack.pivot.y = Math.floor(this.btnBack.height * .5);
        this.btnBack.name = "back";

        if(posRight){
            this.btnBack.x = Math.floor(AssetLoader.STAGE_WIDTH - (BackBtn.OFFSET_X + Math.abs(Math.floor(AssetLoader.getInstance().ratioX / 2))));
        }else {
            this.btnBack.x = Math.floor(this.btnBack.width + BackBtn.OFFSET_X + Math.abs(Math.floor(AssetLoader.getInstance().ratioX / 2)));
        }
        let addedY:number = posRight ? 20 : 0;
        this.btnBack.y = Math.floor(this.btnBack.height + BackBtn.OFFSET_Y + addedY + Math.abs(Math.floor(AssetLoader.getInstance().ratioY / 2)) + addedY);
        this.btnBack.on(ButtonEvent.CLICKED, this.btnBackPressed);
    }

    private btnBackPressed = (event:Event):void => {
        Logger.log(this, "BackBtn btnBackPressed  this.destination == "+this.destination);
        this.btnBack.off(ButtonEvent.CLICKED, this.btnBackPressed);
        // if(Config.currentSpeakSound != null) {
        //     AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
        // }
        AudioPlayer.getInstance().stopAllSounds();
        this.emit(this.destination);
    }

    public destroy():void{
        this.btnBack.off(ButtonEvent.CLICKED, this.btnBackPressed);
        this.stage.removeChild(this.btnBack);
        Logger.log(this, "BackBtn this.btnBack destroy");

    }

}



