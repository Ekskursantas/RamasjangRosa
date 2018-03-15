(function()
{
    function main(platform){
        return{
            start: function(config, element, state){
                return new Promise(function(resolve, reject){ 
                    platform.loadScript("scripts/main.min.js").then(function(){
                        return platform.loadScript("scripts/bundle.js");
                    }).then(function(f){
                        console.log(f);
                        f(element, platform);
                        resolve();
                    })
                }).catch(reject);
            },
            stop: function(){ 
                return new Promise(function(resolve, reject){ 
                    resolve();
                }).catch(reject);},
            suspend: function(){},
            removeAll: function(){}
        }
    };
    return main;
})();