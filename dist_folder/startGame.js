(function() {

    var api = null;
    var mainView;
    var cb;
    var allAssets = {};



    
        allAssets["media/rosa/levels/skaeg/texture-skaeg.png"] = "uri";
        allAssets["media/rosa/levels/skaeg/backgrounds/background-skaeg.jpg"] = "uri";
        allAssets["media/rosa/levels/skaeg/backgrounds/inside-skaeg.jpg"] = "uri";

        allAssets["media/rosa/levels/bamse/texture-bamse.png"] = "uri";
        allAssets["media/rosa/levels/bamse/backgrounds/background-bamse.jpg"] = "uri";
        allAssets["media/rosa/levels/bamse/backgrounds/inside-bamse.jpg"] = "uri";

        allAssets["media/rosa/levels/christian/texture-christian.png"] = "uri";
        allAssets["media/rosa/levels/christian/backgrounds/background-christian.jpg"] = "uri";
        allAssets["media/rosa/levels/christian/backgrounds/inside-christian.jpg"] = "uri";

        allAssets["media/rosa/common/backgrounds/handMixer.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds/Scene8_bg.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds/Scene9_bg.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds/Scene9a_cutOut.jpg"] = "uri";

        allAssets["media/rosa/levels/christian/texture-christian.json"] = "text";
        allAssets["media/rosa/scenes/skeleton_ske_tex.json"] = "text";
        allAssets["media/rosa/scenes/skeleton_ske_ske.json"] = "text";
        allAssets["media/rosa/common/dragonbones/texture0.json"] = "text";
        allAssets["media/rosa/common/dragonbones/texture1.json"] = "text";
        allAssets["media/rosa/common/dragonbones/texture2.json"] = "text";
        allAssets["media/rosa/levels/bamse/texture-bamse.json"] = "text";
        allAssets["media/rosa/levels/skaeg/texture-skaeg.json"] = "text";
        allAssets["media/rosa/scenes/skeleton_ske_tex.png"] = "uri";
        allAssets["media/rosa/common/dragonbones/texture0.png"] = "uri";
        allAssets["media/rosa/common/dragonbones/texture1.png"] = "uri";
        allAssets["media/rosa/common/dragonbones/texture2.png"] = "uri";
        allAssets["media/rosa/system/BackArrow.png"] = "uri";
        allAssets["media/rosa/common/backgrounds-bamse/Scene3_bamse_bg.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds-bamse/Scene4_bamse_bg.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds-christian/Scene3_christian_bg.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds-christian/Scene4_christian_bg.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds-mille/Scene3_mille_bg.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds-mille/Scene4_mille_bg.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds-skaeg/Scene3_skaeg_bg.jpg"] = "uri";
        allAssets["media/rosa/common/backgrounds-skaeg/Scene4_skaeg_bg.jpg"] = "uri";
        allAssets["media/rosa/common/preloaded-backgrounds/Scene0_bg.jpg"] = "uri";
        allAssets["media/rosa/common/preloaded-backgrounds/Scene1_bg.jpg"] = "uri";

        allAssets["media/rosa/sounds/04_Rosa_02-billeder-af-farve.mp3"] = "uri";
        allAssets["media/rosa/sounds/04_Rosa_02-billeder-af-form.mp3"] = "uri";
        allAssets["media/rosa/sounds/04_Rosa_02-billeder-af-smag.mp3"] = "uri";
        allAssets["media/rosa/sounds/08_Rosa_02-saa-er-kagen-klar-til-ovn.mp3"] = "uri";
        allAssets["media/rosa/sounds/08_Rosa_04-vil-du-saette-aeggeuret.mp3"] = "uri";
        allAssets["media/rosa/sounds/08_Rosa_05-saa-er-der-vist-en-kage-der-vil-ud-af-ovnen.mp3"] = "uri";
        allAssets["media/rosa/sounds/08_Rosa_06-uhm-den-dufter-godt.mp3"] = "uri";
        allAssets["media/rosa/sounds/10_Rosa_01-saa-er-kagen-faerdig-lad-os-komme-afsted-med-den.mp3"] = "uri";
        allAssets["media/rosa/sounds/10_Rosa_03-lad-os-komme-afsted-med-den.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/11_Rosa_01-ok-nu-ringer-jegpaa-saa.mp3"] = "uri";
        allAssets["media/rosa/sounds/11_Rosa_02-det-harvaeret-superfedt-at-bage-med-dig.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/11_Rosa_03-held-og-lykke-med-at-aflevere-kagen.mp3"] = "uri";
        allAssets["media/rosa/sounds/12_Rosa_01-godt-gaaet.mp3"] = "uri";
        allAssets["media/rosa/sounds/diceSwing3.mp3"] = "uri";
        allAssets["media/rosa/sounds/ffffffp.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/fx_hologram_zapzoing.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/fx_mysterio_boot_dr.mp3"] = "uri";
        allAssets["media/rosa/sounds/fx_swish01_low.mp3"] = "uri";
        allAssets["media/rosa/sounds/fx_swish02.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/fx_tok.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/hardStep_A.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/hardStep_B.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/rub-squeak.mp3"] = "uri";
        allAssets["media/rosa/sounds/s03-skridt-1.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s03-skridt-A.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s03-skridt-B.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s04-kamera.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s05-magnetklik_01.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s05-magnetklik_02.mp3"] = "uri";
        allAssets["media/rosa/sounds/s06-dej-aaeg.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s06-ny_kakao_01.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s06-ny_maelk_01.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s06-ny_maelk_haelder.mp3"] = "uri";
        allAssets["media/rosa/sounds/s06-ny_mel_01.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s06-ny_mel_kommer_i_01.mp3"] = "uri";
        allAssets["media/rosa/sounds/s06-ny_olie_01.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s06-ny_olie_02.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s06-ny_sukker_01.mp3"] = "uri";
        allAssets["media/rosa/sounds/s06-ny_sukker_haelder03.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08a-dej-kant-ny.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08a-dej-splat.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08b-ny_ovn_01.mp3"] = "uri";
        allAssets["media/rosa/sounds/s08b-ny_ovn_02.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08b-ny_ovn_03.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08b-ny_ovn_04.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08b-nyt_ur_ding03.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08b-nyt_ur_saettes01.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08b-nyt_ur_tikker02.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s11-Bamse-speaks-nej-en-laekker-kage-du-har-bagt.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s11-door_open_01.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s11-klokke_02.mp3"] = "uri";
        allAssets["media/rosa/sounds/scene0Swing.mp3"] = "uri";
        allAssets["media/rosa/sounds/smallTableSound1.mp3"] = "uri";
        allAssets["media/rosa/sounds/smallTableSound2.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/smallTableSound3.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/smallTableSound4.mp3"] = "uri";
        allAssets["media/rosa/sounds/smallTableSound5.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/smallTableSound6.mp3"] = "uri";
        allAssets["media/rosa/sounds/stufIntheback.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/swish_fast_low.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/swish.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/triple_swoosh_hi.mp3"] = "uri"; 

        allAssets["media/rosa/sounds/char-speaks/bamse/hov/s03-Bamse-speaks-Hov-hvad-var-det-2.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/bamse/hov/s03-Bamse-speaks-Hov-hvad-var-det.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite00-molodi.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite01-jodlelohoohoo.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite02-jodlesangen.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite04-bummelummelum.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/bamse/idle/s03-bamse-speaks-intro-bite05-sulten.mp3"] = "uri";  
        allAssets["media/rosa/sounds/char-speaks/bamse/slut/S11_bamse_thanks.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/bamse/slut/s11-01-Bamse-speaks-nej-en-laekker-kage-du-har-bagt.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/bamse/spotted/s03-Bamse-speaks-ikke-set-foer.mp3"] = "uri";

        allAssets["media/rosa/sounds/char-speaks/kristian/hov/s03-kristian-speaks-hmm.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/kristian/hov/s03-kristian-speaks-hoerte_du_det.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/kristian/hov/s03-kristian-speaks-hov_hvad_var_det.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/kristian/hov/s03-kristian-speaks-sikke_en_underlig_lyd.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/kristian/idle/s03-kristian-speaks-idle1.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/kristian/idle/s03-kristian-speaks-idle2.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/kristian/idle/s03-kristian-speaks-idle3.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/kristian/slut/S11_christian_thanks.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/kristian/slut/s11-01-kristian-speaks-ej_hvor_ser_den_kage_laekker_ud_er_den_til_mig.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/kristian/spotted/s03-kristian-speaks-hvad_i_alverden_ikke_set_foer.mp3"] = "uri"; 

       

        allAssets["media/rosa/sounds/char-speaks/skaeg/hov/s03-skaeg-speaks-hmmm_mystisk.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/skaeg/hov/s03-skaeg-speaks-hov_hvad_var_det.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/skaeg/hov/s03-skaeg-speaks-sikke_en_umderlig_lyd.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/skaeg/idle/s03-skaeg-speaks-en_to_og_der_er_tre.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/skaeg/idle/s03-skaeg-speaks-fire_og_fem_og_seks_er_derovre.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/skaeg/idle/s03-skaeg-speaks-hvor_pokker_er_syv.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/skaeg/slut/s11-01-skaeg-speaks-kage_til_mig.mp3"] = "uri";
        allAssets["media/rosa/sounds/char-speaks/skaeg/slut/s11-02-skaeg-speaks-skal_vi_ikke_smage_paa_kagen.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/char-speaks/skaeg/spotted/s03-skaeg-speaks-hvad_i_alverden_er_det.mp3"] = "uri";

        allAssets["media/rosa/sounds/code-triggered/00_Rosa_12-ejd-det-tror-jeg-ikke-er-den-helt-rigtige.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/00_Rosa_36-det-tror-jeg-han-bliver-glad-for-det-her.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/01_Rosa_01-hej-vil-du-vaere.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/02_Rosa_01-ok-nu-gaelder-det-om.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/02_Rosa_02-nu-skal-vi-snige-os-forbi.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/03_Rosa_01-ja.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/03_Rosa_02-hvor-er-du-god.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/03_Rosa_03-forsigtig.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/03_Rosa_04-aah-nej.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/03_Rosa_05-oev-vi-maa-proeve-igen.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/03_Rosa_06-tryk-paa-skaermen-for-at-gp.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_01-yes-vi-klarede-det.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_02-nu-skal-vi-tage-billeder.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_03-ja-saadan-se-ud.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_04-super-det-er-en-god-smag.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_05-ja-flot-farve.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_06-det-tror-jeg-smag.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_07-snupper-du-ikke-et-spionbillede-af-den.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_08-godt-klaret-lad-os-komme-tilbage.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_09-tryk-rund-til-du-finder.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/04_Rosa_10-mon-vi-kan-taende-for-mysterio.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/05_Rosa_01-ok-kagespion.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_01-vi-starter-med-at-lave-en-dej.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_02-yes-den-skal-i.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_03-ja-den-skal-i.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_04-yes.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_05-den-er-god.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_06-ja.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_07-saadan.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_19-smag_milk.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_20-smag_sugar.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_21-smag_yeast.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/06_Rosa_24-smag_cacao.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/07_Rosa_01-vi-skal-finde-den-helt-rigtige-kagesmag.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/07_Rosa_03-uf-den-er-sur.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/07_Rosa_07-ahr-det-er-laekkert.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/07_Rosa_10-det-smager-ikke-rigtig-afsaa-meget-det-her.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/07_Rosa_11-smag_flour.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/07_Rosa_12-smag_oil.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/07_Rosa_14-uh-det-er--en-god-kagesamg.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/07_Rosa_18-uhmm-der-har-du-fundet-noget_hodt_noget.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/08_Rosa_01-saa-ksla-der-blandes-med-fingere-eller-haandmixer.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/09_Rosa_01-nu-er-det-tid-til-at-skaere-kagen.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/09_Rosa_02-nu-skal-vi-have-pyntet-kagen.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/09_Rosa_03-ej-hvor-bliver-den-flot.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/09_Rosa_04-det-bliver-atlsaa-en-superflot-kage.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/09_Rosa_05-ja-det-ser-godt-ud.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/09_Rosa_06-uhm-den-bliver-rigtig-laekker.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/Freemode_rosa.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/s08a-dej_rammer_kant-01.mp3"] = "uri";
        allAssets["media/rosa/sounds/code-triggered/s08a-dej_rammer_kant-02.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/code-triggered/spotted.mp3"] = "uri"; 

        allAssets["media/rosa/sounds/ui/ui_klik.mp3"] = "uri"; 

        allAssets["media/rosa/sounds/music/rosa-hyggeloop.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/music/rosa-spion-nature.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/music/rosa-spion-urban.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/music/rosa-walking-loop.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/music/rosa-spion.mp3"] = "uri"; 

        allAssets["media/rosa/sounds/s08a-dej_mixer_loop_01.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08a-dej_mixer_loop_02.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s08a-dej_mixer_loop_03.mp3"] = "uri"; 
        allAssets["media/rosa/sounds/s06-ny_finger_i_dej_01.mp3"] = "uri"; 
   
        allAssets["media/rosa/sounds/s08a-dej-kant-ny.mp3"] = "uri"; 
		// this.mapSound({path:"media/rosa/sounds/s08a-dej-splat.mp3", id:"dejsplat"});
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
        // this.mapSound({path:"media/rosa/sounds/code-triggered/S08a_dej_rammer_kant_01", id:"mixerkant1"});
        // this.mapSound({path:"media/rosa/sounds/code-triggered/S08a_dej_rammer_kant_02", id:"mixerkant2"});
       
        

    var assetLoaderTest;




        function main(platform, element, callback) {
            cb = callback;
            api = platform;
            console.log("In StartGame - main");
            initGame(element);
        }


        function initGame(element) {

            api.assets.getBundle(allAssets).then(function (assets) {

                console.log("in initGAme() - bundle loaded");

                var main = new EntryPoint.Main();
                main.start(assets, api, element, cb);
            });
        }

        return main;
    
    })(); //END FUNCTION