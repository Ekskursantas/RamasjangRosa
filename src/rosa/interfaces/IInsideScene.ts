//package dk.nozebra.rosa.interfaces
//{
//	import dk.nozebra.rosa.generated.common.armatures.proxies.Color_clueProxy;
//	import dk.nozebra.rosa.generated.common.armatures.proxies.Form_clueProxy;
//	import dk.nozebra.rosa.generated.common.armatures.proxies.PolaroidProgressProxy;
//	import dk.nozebra.rosa.generated.common.armatures.proxies.ShootPictureProxy;
//	import dk.nozebra.rosa.generated.common.armatures.proxies.SpySceneTouchProxy;
//	import dk.nozebra.rosa.generated.common.armatures.proxies.Taste_clueProxy;
//	import dk.nozebra.rosa.typeddb.interfaces.IArmatureProxy";

	//import starling.display.createjs.Sprite;

	import {IArmatureProxy} from "src/rosa/typeddb/interfaces/IArmatureProxy";
	import {Color_clueProxy} from "src/rosa/generated/common/armatures/proxies/Color_clueProxy";
	import {Taste_clueProxy} from "src/rosa/generated/common/armatures/proxies/Taste_clueProxy";
	import {Form_clueProxy} from "src/rosa/generated/common/armatures/proxies/Form_clueProxy";
	import {ShootPictureProxy} from "src/rosa/generated/common/armatures/proxies/ShootPictureProxy";
	import {PolaroidProgressProxy} from "src/rosa/generated/common/armatures/proxies/PolaroidProgressProxy";
	import {SpySceneTouchProxy} from "src/rosa/generated/common/armatures/proxies/SpySceneTouchProxy";

export interface IInsideScene extends IArmatureProxy {
	gotoDefault():void;
	gotoIntro():void;
	gotoOuttro():void;

	getColor_clue():Color_clueProxy
	getTaste_clue():Taste_clueProxy
	getForm_clue():Form_clueProxy
	getShootPicture():ShootPictureProxy
	getProgress():PolaroidProgressProxy;
	getTouch():SpySceneTouchProxy
}
