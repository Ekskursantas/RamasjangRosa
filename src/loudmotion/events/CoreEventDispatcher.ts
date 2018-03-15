import {GenericDataEvent} from "src/loudmotion/events/GenericDataEvent";
import {Logger} from "src/loudmotion/utils/debug/Logger";

export class CoreEventDispatcher {
	private static _instance:CoreEventDispatcher;
	private _activeEventMap:any;
	private timer:number;

	private _activeFuncList:Function[];

	constructor() {
        if(CoreEventDispatcher._instance){
            throw new Error("Error: Instantiation failed: Use CoreEventDispatcher.getInstance() instead of new.");
        }
    }

    static getInstance():CoreEventDispatcher{
    	if (CoreEventDispatcher._instance == null){
            CoreEventDispatcher._instance = new CoreEventDispatcher();
            CoreEventDispatcher._instance.init();
        }

        return CoreEventDispatcher._instance;
    }

	public static get instantiated():boolean {
		return Boolean(CoreEventDispatcher._instance)
	}

	public static destroySingleton():void {
		if (CoreEventDispatcher.instantiated) {
			CoreEventDispatcher._instance.destroy();
		}
	}

	public destroy():void {
		if (this._activeEventMap) {
			let prop:string;
			for (prop in this._activeEventMap) {
				this._activeEventMap[prop].length = 0;
				delete this._activeEventMap[prop];
			}
			this._activeEventMap = null;
		}
		if (this._activeFuncList) {
			this._activeFuncList.length = 0;
		}
		this._activeFuncList = null;
		CoreEventDispatcher._instance = null;
	}

	private init():void {
		this._activeEventMap = {};
	}

	public addEventListener(type:string, listener:Function):void {
		this._activeFuncList = this._activeEventMap[type];

		if (this._activeFuncList) {
			if (this._activeFuncList.indexOf(listener) < 0) {
				this._activeFuncList.push(listener);
			}
		} else {
			this._activeEventMap[type] = [listener];
			this._activeFuncList = this._activeEventMap[type];
		}
	}

	public removeEventListener(type:string, listener:Function = null):void {
		this._activeFuncList = this._activeEventMap[type];
		let i:number;
		if (this._activeFuncList) {
			if (Boolean(listener)) {
				i = this._activeFuncList.indexOf(listener);
				if (i >= 0) {
					this._activeFuncList.splice(i, 1);
				}
			} else {
				this._activeFuncList.length = 0;
			}
		} else {
			// fail silently if listener not found
		}
	}

	public dispatchEvent(e:GenericDataEvent, delay:number = 0):boolean {
		let result:boolean = false;
		this._activeFuncList = this._activeEventMap[e.type];

		if (this._activeFuncList && this._activeFuncList.length) {
			let funcList:Function[] = this._activeFuncList.concat();
			if(funcList && e){
				if (delay) {
					TweenLite.delayedCall(delay, this.wrapCallFuncs(funcList, e));
				} else {
					this.callFuncs(funcList, e);
				}
			}

			result = true;
		}
		this._activeFuncList = null;
		return result;
	}

	public hasEventListener(type:string, listener:Function = null):boolean {
		let result:boolean;
		let funcList:Function[] = this._activeEventMap[type];
		result = Boolean(funcList && funcList.length);
		if (result && Boolean(listener)) {
			result = (funcList.indexOf(listener) >= 0);
		}
		return result;
	}

	private callFuncs(funcs:Function[], e:GenericDataEvent):void {
		let func:Function;
		let funcLength:number;
		if(funcs){
			funcLength = funcs.length;
		}
		if(funcLength) {
			for (let i:number = 0; i < funcLength; i++) {
				func = funcs[i];
				if (func instanceof Function) {
					if (func.length) {
						if(e){
							func(e);
						}
					} else {
						func();
					}
				} else {
					Logger.log(this, "CoreEventDispatcher dispatchEvent bad entry");
				}
			}
		}
	}

	private wrapCallFuncs(funcs:Function[], e:GenericDataEvent):Function{
		return function():void {
			this.callFuncs(funcs, e);
		}
	}
}
