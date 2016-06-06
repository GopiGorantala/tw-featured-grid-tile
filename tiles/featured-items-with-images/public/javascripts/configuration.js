jive.tile.onOpen(function(config, options) {
    if(!config["data"])
        initReact({});
    initReact(config["data"]);
    setInterval(function(){
        gadgets.window.adjustHeight($("body").outerHeight());
    },200);
});
