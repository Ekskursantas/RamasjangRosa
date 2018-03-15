/**
 * Created by jakobnielsen on 20/09/2017.
 */
import { ProgressBar } from "src/rosa/util/ProgressBar";
import { Main } from "src/Main";
import { Logger } from "src/loudmotion/utils/debug/Logger";
import { AssetLoader } from "src/rosa/util/AssetLoader";
//import { HospitalGameView } from "src/hospital/view/HospitalGameView";
import { Sprite, Container, Graphics} from "pixi.js";


export class AssetHelper extends Sprite {

    private stage: Container;
    public static SOUNDS;
    private assets;
    private callback;
    private spriteSheetParsedCounter: number;
    private progressBar: ProgressBar;
    

    private static _instance: AssetHelper = null;
    static getInstance(): AssetHelper {
        if (AssetHelper._instance == null) {
            AssetHelper._instance = new AssetHelper();
            // AssetLoader._instance.init();
        }
        return AssetHelper._instance;
    }

    public static get instantiated(): boolean {
        return Boolean(AssetHelper._instance);
    }

    public static destroySingleton(): void {
        if (AssetHelper.instantiated) {
            AssetHelper._instance.destroy();
        }
    }
    public parseSpriteSheets(_assets: any, callback: Function) {
        //this.progressBar = new ProgressBar(AssetLoader.STAGE_WIDTH * .5, ProgressBar.PROGRESS_BAR_HEIGHT);
        //this.addChild(this.progressBar);
        //Logger.log(this, "loadAssets this.progressBar == " + this.progressBar);
        //console.log("AssetLoader.loadSpriteSheets() - assets: " + _assets);
        this.assets = _assets;
        this.callback = callback;

        

        this.spriteSheetParsedCounter = 0;
       



        var sprite1 = PIXI.Texture.fromImage(_assets["media/rosa/scenes/skeleton_ske_tex.png"]);

        var sprite2 = PIXI.Texture.fromImage(_assets["media/rosa/common/dragonbones/texture0.png"]);
        var sprite3 = PIXI.Texture.fromImage(_assets["media/rosa/common/dragonbones/texture1.png"]);
        var sprite4 = PIXI.Texture.fromImage(_assets["media/rosa/common/dragonbones/texture2.png"]);

        

        //var sprite6 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds/handMixer.jpg"]);
        //var sprite7 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds/Scene8_bg.jpg"]);
        //var sprite8 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds/Scene9_bg.jpg"]);
        //var sprite9 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds/Scene9a_cutOut.jpg"]);
        var sprite5 = PIXI.Texture.fromImage(_assets["media/rosa/system/BackArrow.png"]);
        var sprite10 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds-bamse/Scene3_bamse_bg.jpg"]);
        var sprite11 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds-bamse/Scene4_bamse_bg.jpg"]);

        var sprite12 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds-christian/Scene3_christian_bg.jpg"]);
        var sprite13 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds-christian/Scene4_christian_bg.jpg"]);

        var sprite14 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds-mille/Scene3_mille_bg.jpg"]);
        var sprite15 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds-mille/Scene4_mille_bg.jpg"]);

        var sprite16 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds-skaeg/Scene3_skaeg_bg.jpg"]);
        var sprite17 = PIXI.Texture.fromImage(_assets["media/rosa/common/backgrounds-skaeg/Scene4_skaeg_bg.jpg"]);

        var sprite18 = PIXI.Texture.fromImage(_assets["media/rosa/common/preloaded-backgrounds/Scene0_bg.jpg"]);
        var sprite19 = PIXI.Texture.fromImage(_assets["media/rosa/common/preloaded-backgrounds/Scene1_bg.jpg"]);

        PIXI.Texture.addTextureToCache(sprite1, "textureSkeleton");

        PIXI.Texture.addTextureToCache(sprite2, "texture0");
        PIXI.Texture.addTextureToCache(sprite3, "texture1");
        PIXI.Texture.addTextureToCache(sprite4, "texture2");

        PIXI.Texture.addTextureToCache(sprite5, "BackArrow");

        //PIXI.Texture.addTextureToCache(sprite6, "handMixer");
        //PIXI.Texture.addTextureToCache(sprite7, "Scene8_bg");
        //PIXI.Texture.addTextureToCache(sprite8, "Scene9_bg");
        //PIXI.Texture.addTextureToCache(sprite9, "Scene9a_cutOut");

        PIXI.Texture.addTextureToCache(sprite10, "Scene3_bamse_bg");
        PIXI.Texture.addTextureToCache(sprite11, "Scene4_bamse_bg");

        PIXI.Texture.addTextureToCache(sprite12, "Scene3_christian_bg");
        PIXI.Texture.addTextureToCache(sprite13, "Scene4_christian_bg");

        PIXI.Texture.addTextureToCache(sprite14, "Scene3_mille_bg");
        PIXI.Texture.addTextureToCache(sprite15, "Scene4_mille_bg");

        PIXI.Texture.addTextureToCache(sprite16, "Scene3_skaeg_bg");
        PIXI.Texture.addTextureToCache(sprite17, "Scene4_skaeg_bg");

        PIXI.Texture.addTextureToCache(sprite18, "Scene0_bg");
        PIXI.Texture.addTextureToCache(sprite19, "Scene1_bg");

        this.parseSpriteSheet("media/rosa/scenes/skeleton_ske_tex");
        //this.parseSpriteSheet("media/rosa/scenes/skeleton_ske_ske");
        this.parseSpriteSheet("media/rosa/common/dragonbones/texture0");
        this.parseSpriteSheet("media/rosa/common/dragonbones/texture1");
        this.parseSpriteSheet("media/rosa/common/dragonbones/texture2");
        this.parseSpriteSheet("media/rosa/levels/christian/texture-christian");
        this.parseSpriteSheet("media/rosa/levels/bamse/texture-bamse");
        this.parseSpriteSheet("media/rosa/levels/skaeg/texture-skaeg");
        
    }

 
    public parseSpriteSheet(spriteSheetName: string) {
        console.log("AssetLoader.parseSpriteSheet() - spriteSheetName: " + spriteSheetName);


        // var atlasData = JSON.parse(_assets['textures/start/or_atlas_menu_0.json']);
        try {
            var atlasData = JSON.parse(this.assets[spriteSheetName + ".json"]);
        }
        catch (e) {
            console.log(e);
        }
        // console.log("atlasData.frames: " + atlasData.frames.game_interactable1.frame.y);


        var image = new Image();

        image.onload = () => {
            console.log("Image loaded");
            var baseTexture = new PIXI.BaseTexture(image);

            for (var nextFrame in atlasData.frames) {
                // console.log("nextFrame: " + nextFrame);
                // console.log("atlasData.frames[nextFrame]: " + atlasData.frames[nextFrame]);
                // console.log("atlasData.frames[nextFrame].frame: " + atlasData.frames[nextFrame].frame);
                // console.log("atlasData.frames[nextFrame].frame.w: " + atlasData.frames[nextFrame].frame.w);

                // var spriteTexture1 = new PIXI.Texture(baseTexture, new PIXI.Rectangle(atlasData.frames[nextFrame].frame.x, atlasData.frames[nextFrame].frame.y, atlasData.frames[nextFrame].frame.w, atlasData.frames[nextFrame].frame.h));
				var spriteTexture1 = new PIXI.Texture(baseTexture, new PIXI.Rectangle(atlasData.frames[nextFrame].frame.x, atlasData.frames[nextFrame].frame.y, atlasData.frames[nextFrame].frame.w, atlasData.frames[nextFrame].frame.h),
					new PIXI.Rectangle(atlasData.frames[nextFrame].spriteSourceSize.x, atlasData.frames[nextFrame].spriteSourceSize.y, atlasData.frames[nextFrame].spriteSourceSize.w, atlasData.frames[nextFrame].spriteSourceSize.h),
					new PIXI.Rectangle(0, 0, atlasData.frames[nextFrame].sourceSize.w, atlasData.frames[nextFrame].sourceSize.h));

				PIXI.Texture.addTextureToCache(spriteTexture1, nextFrame);
            }

            this.spriteSheetParsedCounter++
            //console.log("Sprites loaded: "+this.spriteSheetParsedCounter);
            if (this.spriteSheetParsedCounter > 6) {
                //console.log("CALLBACK INIT GAME!");
                this.callback();
            }
        };
        image.src = this.assets[spriteSheetName + ".png"];

    }


    public mapSounds() {
        AssetHelper.SOUNDS = {};

        this.mapSound({path:"media/rosa/sounds/04_Rosa_02-billeder-af-farve.mp3", id: "04_Rosa_02-billeder-af-farve" });
		this.mapSound({path:"media/rosa/sounds/04_Rosa_02-billeder-af-form.mp3", id:"04_Rosa_02-billeder-af-form"});
		this.mapSound({path:"media/rosa/sounds/04_Rosa_02-billeder-af-smag.mp3", id:"04_Rosa_02-billeder-af-smag"});
		this.mapSound({path:"media/rosa/sounds/08_Rosa_02-saa-er-kagen-klar-til-ovn.mp3", id:"08_Rosa_02-saa-er-kagen-klar-til-ovn"});
		this.mapSound({path:"media/rosa/sounds/08_Rosa_04-vil-du-saette-aeggeuret.mp3", id:"08_Rosa_04-vil-du-saette-aeggeuret"});
		this.mapSound({path:"media/rosa/sounds/08_Rosa_05-saa-er-der-vist-en-kage-der-vil-ud-af-ovnen.mp3", id:"08_Rosa_05-saa-er-der-vist-en-kage-der-vil-ud-af-ovnen"});
		this.mapSound({path:"media/rosa/sounds/08_Rosa_06-uhm-den-dufter-godt.mp3", id:"08_Rosa_06-uhm-den-dufter-godt"});
		this.mapSound({path:"media/rosa/sounds/10_Rosa_01-saa-er-kagen-faerdig-lad-os-komme-afsted-med-den.mp3", id:"10_Rosa_01-saa-er-kagen-faerdig-lad-os-komme-afsted-med-den"});
		this.mapSound({path:"media/rosa/sounds/10_Rosa_03-lad-os-komme-afsted-med-den.mp3", id:"10_Rosa_03-lad-os-komme-afsted-med-den"});
		this.mapSound({path:"media/rosa/sounds/11_Rosa_01-ok-nu-ringer-jegpaa-saa.mp3", id:"11_Rosa_01-ok-nu-ringer-jegpaa-saa"});
		this.mapSound({path:"media/rosa/sounds/11_Rosa_02-det-harvaeret-superfedt-at-bage-med-dig.mp3", id:"11_Rosa_02-det-harvaeret-superfedt-at-bage-med-dig"});
		this.mapSound({path:"media/rosa/sounds/11_Rosa_03-held-og-lykke-med-at-aflevere-kagen.mp3", id:"11_Rosa_03-held-og-lykke-med-at-aflevere-kagen"});
		this.mapSound({path:"media/rosa/sounds/12_Rosa_01-godt-gaaet.mp3", id:"12_Rosa_01-godt-gaaet"});
		this.mapSound({path:"media/rosa/sounds/diceSwing3.mp3", id:"diceSwing3"});
		this.mapSound({path:"media/rosa/sounds/ffffffp.mp3", id:"ffffffp"});
		this.mapSound({path:"media/rosa/sounds/fx_hologram_zapzoing.mp3", id:"fx_hologram_zapzoing"});
		this.mapSound({path:"media/rosa/sounds/fx_mysterio_boot_dr.mp3", id:"fx_mysterio_boot_dr"});
		this.mapSound({path:"media/rosa/sounds/fx_swish01_low.mp3", id:"fx_swish01_low"});
		this.mapSound({path:"media/rosa/sounds/fx_swish02.mp3", id:"fx_swish02"});
		this.mapSound({path:"media/rosa/sounds/fx_tok.mp3", id:"fx_tok"});
		this.mapSound({path:"media/rosa/sounds/hardStep_A.mp3", id:"hardStep_A"});
		this.mapSound({path:"media/rosa/sounds/hardStep_B.mp3", id:"hardStep_B"});
		this.mapSound({path:"media/rosa/sounds/rub-squeak.mp3", id:"rub-squeak"});
		this.mapSound({path:"media/rosa/sounds/s03-skridt-1.mp3", id:"s03-skridt-1"});
		this.mapSound({path:"media/rosa/sounds/s03-skridt-A.mp3", id:"s03-skridt-A"});
		this.mapSound({path:"media/rosa/sounds/s03-skridt-B.mp3", id:"s03-skridt-B"});
		this.mapSound({path:"media/rosa/sounds/s04-kamera.mp3", id:"s04-kamera"});
		this.mapSound({path:"media/rosa/sounds/s05-magnetklik_01.mp3", id:"s05-magnetklik_01"});
		this.mapSound({path:"media/rosa/sounds/s05-magnetklik_02.mp3", id:"s05-magnetklik_02"});
		this.mapSound({path:"media/rosa/sounds/s06-dej-aaeg.mp3", id:"s06-dej-aaeg"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_kakao_01.mp3", id:"s06-ny_kakao_01"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_maelk_01.mp3", id:"s06-ny_maelk_01"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_maelk_haelder.mp3", id:"s06-ny_maelk_haelder"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_mel_01.mp3", id:"s06-ny_mel_01"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_mel_kommer_i_01.mp3", id:"s06-ny_mel_kommer_i_01"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_olie_01.mp3", id:"s06-ny_olie_01"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_olie_02.mp3", id:"s06-ny_olie_02"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_sukker_01.mp3", id:"s06-ny_sukker_01"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_sukker_haelder03.mp3", id:"s06-ny_sukker_haelder03"});
		this.mapSound({path:"media/rosa/sounds/s08a-dej-kant-ny.mp3", id:"s08a-dej-kant-ny"});
		this.mapSound({path:"media/rosa/sounds/s08a-dej-splat.mp3", id:"s08a-dej-splat"});
		this.mapSound({path:"media/rosa/sounds/s08b-ny_ovn_01.mp3", id:"s08b-ny_ovn_01"});
		this.mapSound({path:"media/rosa/sounds/s08b-ny_ovn_02.mp3", id:"s08b-ny_ovn_02"});
		this.mapSound({path:"media/rosa/sounds/s08b-ny_ovn_03.mp3", id:"s08b-ny_ovn_03"});
		this.mapSound({path:"media/rosa/sounds/s08b-ny_ovn_04.mp3", id:"s08b-ny_ovn_04"});
		this.mapSound({path:"media/rosa/sounds/s08b-nyt_ur_ding03.mp3", id:"s08b-nyt_ur_ding03"});
		this.mapSound({path:"media/rosa/sounds/s08b-nyt_ur_saettes01.mp3", id:"s08b-nyt_ur_saettes01"});
		this.mapSound({path:"media/rosa/sounds/s08b-nyt_ur_tikker02.mp3", id:"s08b-nyt_ur_tikker02"});
		this.mapSound({path:"media/rosa/sounds/s11-Bamse-speaks-nej-en-laekker-kage-du-har-bagt.mp3", id:"s11-Bamse-speaks-nej-en-laekker-kage-du-har-bagt"});
		this.mapSound({path:"media/rosa/sounds/s11-door_open_01.mp3", id:"s11-door_open_01"});
		this.mapSound({path:"media/rosa/sounds/s11-klokke_02.mp3", id:"s11-klokke_02"});
		this.mapSound({path:"media/rosa/sounds/scene0Swing.mp3", id:"scene0Swing"});
		this.mapSound({path:"media/rosa/sounds/smallTableSound1.mp3", id:"smallTableSound1"});
		this.mapSound({path:"media/rosa/sounds/smallTableSound2.mp3", id:"smallTableSound2"});
		this.mapSound({path:"media/rosa/sounds/smallTableSound3.mp3", id:"smallTableSound3"});
		this.mapSound({path:"media/rosa/sounds/smallTableSound4.mp3", id:"smallTableSound4"});
		this.mapSound({path:"media/rosa/sounds/smallTableSound5.mp3", id:"smallTableSound5"});
		this.mapSound({path:"media/rosa/sounds/smallTableSound6.mp3", id:"smallTableSound6"});
		this.mapSound({path:"media/rosa/sounds/stufIntheback.mp3", id:"stufIntheback"});
		this.mapSound({path:"media/rosa/sounds/swish_fast_low.mp3", id:"swish_fast_low"});
		this.mapSound({path:"media/rosa/sounds/swish.mp3", id:"swish"});
		this.mapSound({path:"media/rosa/sounds/triple_swoosh_hi.mp3", id:"triple_swoosh_hi"});

		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/hov/s03-Bamse-speaks-Hov-hvad-var-det-2.mp3", id:"s03-Bamse-speaks-Hov-hvad-var-det-2"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/hov/s03-Bamse-speaks-Hov-hvad-var-det.mp3", id:"s03-Bamse-speaks-Hov-hvad-var-det"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite00-molodi.mp3", id:"s03-bamse-speaks-intro-bite00-molodi"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite01-jodlelohoohoo.mp3", id:"s03-bamse-speaks-intro-bite01-jodlelohoohoo"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite02-jodlesangen.mp3", id:"s03-bamse-speaks-intro-bite02-jodlesangen"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite04-bummelummelum.mp3", id:"s03-bamse-speaks-intro-bite04-bummelummelum"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite05-sulten.mp3", id:"s03-bamse-speaks-intro-bite05-sulten"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/slut/S11_bamse_thanks.mp3", id:"S11_bamse_thanks"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/slut/s11-01-Bamse-speaks-nej-en-laekker-kage-du-har-bagt.mp3", id:"s11-01-Bamse-speaks-nej-en-laekker-kage-du-har-bagt"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/bamse/spotted/s03-Bamse-speaks-ikke-set-foer.mp3", id:"s03-Bamse-speaks-ikke-set-foer"});

		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/hov/s03-kristian-speaks-hmm.mp3", id:"s03-kristian-speaks-hmm"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/hov/s03-kristian-speaks-hoerte_du_det.mp3", id:"s03-kristian-speaks-hoerte_du_det"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/hov/s03-kristian-speaks-hov_hvad_var_det.mp3", id:"s03-kristian-speaks-hov_hvad_var_det"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/hov/s03-kristian-speaks-sikke_en_underlig_lyd.mp3", id:"s03-kristian-speaks-sikke_en_underlig_lyd"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/idle/s03-kristian-speaks-idle1.mp3", id:"s03-kristian-speaks-idle1"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/idle/s03-kristian-speaks-idle2.mp3", id:"s03-kristian-speaks-idle2"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/idle/s03-kristian-speaks-idle3.mp3", id:"s03-kristian-speaks-idle3"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/slut/S11_christian_thanks.mp3", id:"S11_christian_thanks"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/slut/s11-01-kristian-speaks-ej_hvor_ser_den_kage_laekker_ud_er_den_til_mig.mp3", id:"s11-01-kristian-speaks-ej_hvor_ser_den_kage_laekker_ud_er_den_til_mig"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/kristian/spotted/s03-kristian-speaks-hvad_i_alverden_ikke_set_foer.mp3", id:"s03-kristian-speaks-hvad_i_alverden_ikke_set_foer"});

		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/hov/s03-mille-speaks-hvad_er_det_for_en_underlig_lyd.mp3", id:"s03-mille-speaks-hvad_er_det_for_en_underlig_lyd"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/hov/s03-mille-speaks-jeg_synes_jeg_horte_noget.mp3", id:"s03-mille-speaks-jeg_synes_jeg_horte_noget"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/idle/s03_mille_speaks_gribe_himstergimsfuglen.mp3", id:"s03_mille_speaks_gribe_himstergimsfuglen"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/idle/s03_mille_speaks_hvorfor_virker_kameraet_nu_ikke.mp3", id:"s03_mille_speaks_hvorfor_virker_kameraet_nu_ikke"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/idle/s03-mille_speaks_pas_paa_fuglen_noedlander.mp3", id:"s03-mille_speaks_pas_paa_fuglen_noedlander"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/slut/s11_1_mille_speaks_hyggeligt_du_kom.mp3", id:"s11_1_mille_speaks_hyggeligt_du_kom"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/slut/s11_2_mille_speaks_megasjov_kage.mp3", id:"s11_2_mille_speaks_megasjov_kage"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/spotted/s03-mille-speaks-hvad_i_alverden_ikke_set_foer.mp3", id:"s03-mille-speaks-hvad_i_alverden_ikke_set_foer"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/spotted/s03-mille-speaks-hvad_var_det.mp3", id:"s03-mille-speaks-hvad_var_det"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/ubrugt/s01-mille-speaks-boernebanden_til_at_hjaelpe.mp3", id:"s01-mille-speaks-boernebanden_til_at_hjaelpe"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/ubrugt/s01-mille-speaks-byde_fuglen_paa_kage.mp3", id:"s01-mille-speaks-byde_fuglen_paa_kage"});
		// this.mapSound({path:"media/rosa/sounds/char-speaks/mille/ubrugt/s01-mille-speaks-hej_godt_at_se_dig.mp3", id:"s01-mille-speaks-hej_godt_at_se_dig"});

		this.mapSound({path:"media/rosa/sounds/char-speaks/skaeg/hov/s03-skaeg-speaks-hmmm_mystisk.mp3", id:"s03-skaeg-speaks-hmmm_mystisk"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/skaeg/hov/s03-skaeg-speaks-hov_hvad_var_det.mp3", id:"s03-skaeg-speaks-hov_hvad_var_det"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/skaeg/hov/s03-skaeg-speaks-sikke_en_umderlig_lyd.mp3", id:"s03-skaeg-speaks-sikke_en_umderlig_lyd"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/skaeg/idle/s03-skaeg-speaks-en_to_og_der_er_tre.mp3", id:"s03-skaeg-speaks-en_to_og_der_er_tre"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/skaeg/idle/s03-skaeg-speaks-fire_og_fem_og_seks_er_derovre.mp3", id:"s03-skaeg-speaks-fire_og_fem_og_seks_er_derovre"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/skaeg/idle/s03-skaeg-speaks-hvor_pokker_er_syv.mp3", id:"s03-skaeg-speaks-hvor_pokker_er_syv"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/skaeg/slut/s11-01-skaeg-speaks-kage_til_mig.mp3", id:"s11-01-skaeg-speaks-kage_til_mig"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/skaeg/slut/s11-02-skaeg-speaks-skal_vi_ikke_smage_paa_kagen.mp3", id:"s11-02-skaeg-speaks-skal_vi_ikke_smage_paa_kagen"});
		this.mapSound({path:"media/rosa/sounds/char-speaks/skaeg/spotted/s03-skaeg-speaks-hvad_i_alverden_er_det.mp3", id:"s03-skaeg-speaks-hvad_i_alverden_er_det"});

		this.mapSound({path:"media/rosa/sounds/code-triggered/00_Rosa_12-ejd-det-tror-jeg-ikke-er-den-helt-rigtige.mp3", id:"00_Rosa_12-ejd-det-tror-jeg-ikke-er-den-helt-rigtige"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/00_Rosa_36-det-tror-jeg-han-bliver-glad-for-det-her.mp3", id:"00_Rosa_36-det-tror-jeg-han-bliver-glad-for-det-her"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/01_Rosa_01-hej-vil-du-vaere.mp3", id:"01_Rosa_01-hej-vil-du-vaere"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/02_Rosa_01-ok-nu-gaelder-det-om.mp3", id:"02_Rosa_01-ok-nu-gaelder-det-om"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/02_Rosa_02-nu-skal-vi-snige-os-forbi.mp3", id:"02_Rosa_02-nu-skal-vi-snige-os-forbi"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/03_Rosa_01-ja.mp3", id:"03_Rosa_01-ja"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/03_Rosa_02-hvor-er-du-god.mp3", id:"03_Rosa_02-hvor-er-du-god"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/03_Rosa_03-forsigtig.mp3", id:"03_Rosa_03-forsigtig"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/03_Rosa_04-aah-nej.mp3", id:"03_Rosa_04-aah-nej"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/03_Rosa_05-oev-vi-maa-proeve-igen.mp3", id:"03_Rosa_05-oev-vi-maa-proeve-igen"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/03_Rosa_06-tryk-paa-skaermen-for-at-gp.mp3", id:"03_Rosa_06-tryk-paa-skaermen-for-at-gp"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_01-yes-vi-klarede-det.mp3", id:"04_Rosa_01-yes-vi-klarede-det"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_02-nu-skal-vi-tage-billeder.mp3", id:"04_Rosa_02-nu-skal-vi-tage-billeder"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_03-ja-saadan-se-ud.mp3", id:"04_Rosa_03-ja-saadan-se-ud"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_04-super-det-er-en-god-smag.mp3", id:"04_Rosa_04-super-det-er-en-god-smag"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_05-ja-flot-farve.mp3", id:"04_Rosa_05-ja-flot-farve"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_06-det-tror-jeg-smag.mp3", id:"04_Rosa_06-det-tror-jeg-smag"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_07-snupper-du-ikke-et-spionbillede-af-den.mp3", id:"04_Rosa_07-snupper-du-ikke-et-spionbillede-af-den"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_08-godt-klaret-lad-os-komme-tilbage.mp3", id:"04_Rosa_08-godt-klaret-lad-os-komme-tilbage"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_09-tryk-rund-til-du-finder.mp3", id:"04_Rosa_09-tryk-rund-til-du-finder"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/04_Rosa_10-mon-vi-kan-taende-for-mysterio.mp3", id:"04_Rosa_10-mon-vi-kan-taende-for-mysterio"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/05_Rosa_01-ok-kagespion.mp3", id:"05_Rosa_01-ok-kagespion"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_01-vi-starter-med-at-lave-en-dej.mp3", id:"06_Rosa_01-vi-starter-med-at-lave-en-dej"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_02-yes-den-skal-i.mp3", id:"06_Rosa_02-yes-den-skal-i"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_03-ja-den-skal-i.mp3", id:"06_Rosa_03-ja-den-skal-i"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_04-yes.mp3", id:"06_Rosa_04-yes"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_05-den-er-god.mp3", id:"06_Rosa_05-den-er-god"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_06-ja.mp3", id:"06_Rosa_06-ja"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_07-saadan.mp3", id:"06_Rosa_07-saadan"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_19-smag_milk.mp3", id:"06_Rosa_19-smag_milk"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_20-smag_sugar.mp3", id:"06_Rosa_20-smag_sugar"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_21-smag_yeast.mp3", id:"06_Rosa_21-smag_yeast"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/06_Rosa_24-smag_cacao.mp3", id:"06_Rosa_24-smag_cacao"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/07_Rosa_01-vi-skal-finde-den-helt-rigtige-kagesmag.mp3", id:"07_Rosa_01-vi-skal-finde-den-helt-rigtige-kagesmag"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/07_Rosa_03-uf-den-er-sur.mp3", id:"07_Rosa_03-uf-den-er-sur"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/07_Rosa_07-ahr-det-er-laekkert.mp3", id:"07_Rosa_07-ahr-det-er-laekkert"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/07_Rosa_10-det-smager-ikke-rigtig-afsaa-meget-det-her.mp3", id:"07_Rosa_10-det-smager-ikke-rigtig-afsaa-meget-det-her"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/07_Rosa_11-smag_flour.mp3", id:"07_Rosa_11-smag_flour"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/07_Rosa_12-smag_oil.mp3", id:"07_Rosa_12-smag_oil"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/07_Rosa_14-uh-det-er--en-god-kagesamg.mp3", id:"07_Rosa_14-uh-det-er--en-god-kagesamg"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/07_Rosa_18-uhmm-der-har-du-fundet-noget_hodt_noget.mp3", id:"07_Rosa_18-uhmm-der-har-du-fundet-noget_hodt_noget"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/08_Rosa_01-saa-ksla-der-blandes-med-fingere-eller-haandmixer.mp3", id:"08_Rosa_01-saa-ksla-der-blandes-med-fingere-eller-haandmixer"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/09_Rosa_01-nu-er-det-tid-til-at-skaere-kagen.mp3", id:"09_Rosa_01-nu-er-det-tid-til-at-skaere-kagen"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/09_Rosa_02-nu-skal-vi-have-pyntet-kagen.mp3", id:"09_Rosa_02-nu-skal-vi-have-pyntet-kagen"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/09_Rosa_03-ej-hvor-bliver-den-flot.mp3", id:"09_Rosa_03-ej-hvor-bliver-den-flot"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/09_Rosa_04-det-bliver-atlsaa-en-superflot-kage.mp3", id:"09_Rosa_04-det-bliver-atlsaa-en-superflot-kage"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/09_Rosa_05-ja-det-ser-godt-ud.mp3", id:"09_Rosa_05-ja-det-ser-godt-ud"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/09_Rosa_06-uhm-den-bliver-rigtig-laekker.mp3", id:"09_Rosa_06-uhm-den-bliver-rigtig-laekker"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/Freemode_rosa.mp3", id:"Freemode_rosa"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/s08a-dej_rammer_kant-01.mp3", id:"s08a-dej_rammer_kant-01"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/s08a-dej_rammer_kant-02.mp3", id:"s08a-dej_rammer_kant-02"});
		this.mapSound({path:"media/rosa/sounds/code-triggered/spotted.mp3", id:"spotted"});

		this.mapSound({path:"media/rosa/sounds/ui/ui_klik.mp3", id:"ui_klik"});

		this.mapSound({path:"media/rosa/sounds/music/rosa-hyggeloop.mp3", id:"MUSIC_ROSA_HYGGE"});
		this.mapSound({path:"media/rosa/sounds/music/rosa-spion-nature.mp3", id:"MUSIC_ROSA_SPION_NATURE"});
		this.mapSound({path:"media/rosa/sounds/music/rosa-spion-urban.mp3", id:"MUSIC_ROSA_SPION_URBAN"});
		this.mapSound({path:"media/rosa/sounds/music/rosa-walking-loop.mp3", id:"MUSIC_ROSA_WALKING"});
		this.mapSound({path:"media/rosa/sounds/music/rosa-spion.mp3", id:"MUSIC_ROSA_SPION_INSIDE"});

		this.mapSound({path:"media/rosa/sounds/s08a-dej_mixer_loop_01.mp3", id:"mixer1"});
		this.mapSound({path:"media/rosa/sounds/s08a-dej_mixer_loop_02.mp3", id:"mixer2"});
		this.mapSound({path:"media/rosa/sounds/s08a-dej_mixer_loop_03.mp3", id:"mixer3"});
		this.mapSound({path:"media/rosa/sounds/s06-ny_finger_i_dej_01.mp3", id:"finger"});
		// this.mapSound({path:"media/rosa/sounds/code-triggered/S08a_dej_rammer_kant_01", id:"mixerkant1"});
		// this.mapSound({path:"media/rosa/sounds/code-triggered/S08a_dej_rammer_kant_02", id:"mixerkant2"});
		this.mapSound({path:"media/rosa/sounds/s08a-dej-kant-ny.mp3", id:"mixerkant3"});
		// this.mapSound({path:"media/rosa/sounds/s08a-dej-splat.mp3", id:"dejsplat"});
        
    }

    private mapSound(soundObject) {
        AssetHelper.SOUNDS[soundObject.id] = soundObject.path;
    }


}