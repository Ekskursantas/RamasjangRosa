(function () {
    function main(platform) {
        return {

            start: function (config, element, state) {


                return new Promise(function (resolve, reject) {
                    return platform.assets.get("rosa.css", "text")
                        .then(function (text)
                        {
                            var head = document.head || document.getElementsByTagName('head')[0];
                            var style = document.createElement("style");
                            style.type = 'text/css';
                            style.id = 'rosa_style';
                            style.innerHTML = text;
                            head.appendChild(style);
                        
                           
                            var body = document.body || document.getElementsByTagName('body')[0];
                            var canvas = document.createElement('canvas');
                            var container = document.createElement('div');
                            var drrosa = document.createElement('div');
                            drrosa.id = "drrosa";
                            drrosa.style = "position:relative;"
                            container.id = "container";
                            container.className = "center-this";
                            canvas.id = "canvas_rosa";
                            canvas.style = "position:absolute; left:0px; top: 0px;";
                            drrosa.appendChild(canvas);
                            container.appendChild(drrosa);
                            element.appendChild(container);
                            return Promise.resolve();
                        }).then(function () {

                            return platform.insertScript("scripts/vendor/TweenMax.min.js").then(function () {
                                return platform.insertScript("scripts/vendor/pixi.min.js").then(function () {
                                    return platform.insertScript("scripts/vendor/createjs.min.js").then(function () {
                                        return platform.insertScript("scripts/vendor/vendor.min.js").then(function () {
                                            return platform.insertScript("scripts/vendor/jquery-3.1.1.slim.min.js").then(function () {
                                                return platform.insertScript("scripts/vendor/howler.min.js").then(function () {
                                                    return platform.insertScript("scripts/vendor/dragonBones.min.js").then(function () {
                                                        return platform.insertScript("scripts/vendor/dragonBonesPixi.min.js").then(function () {
                                                            return platform.insertScript("scripts/main.min.js").then(function () {
                                                                return platform.loadScript("startGame.js").then(function (main) {
                                                                 main(platform, element, resolve);


                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                }).catch(reject);

            },
            stop: function () {
                return Promise.resolve();
            },
            suspend: function () { },
            removeAll: function () { }
        };
    };
    return main;
})();
