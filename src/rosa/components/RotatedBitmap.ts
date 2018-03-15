
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {AssetLoader} from "src/rosa/util/AssetLoader";

export class RotatedBitmap {

	public static create(bitmap:PIXI.Sprite):PIXI.Sprite {
		let container:PIXI.Sprite = new PIXI.Sprite();
		container.addChild(bitmap);

		bitmap.x = -bitmap.width / 2;
		bitmap.y = -bitmap.height / 2;

		container.x = AssetLoader.STAGE_WIDTH / 2;
		container.y = AssetLoader.STAGE_HEIGHT / 2;

		// let pp1:PerspectiveProjection = new PerspectiveProjection(); //TODO
		// pp1.fieldOfView = 30;
		// pp1.projectionCenter = new PIXI.Point(container.x, container.y);
		//
		// container.transform.perspectiveProjection = pp1;
		// container.rotationX = -60;

		return container;
	}
}
