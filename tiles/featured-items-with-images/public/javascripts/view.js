jive.tile.onOpen(function(config, options) {
    if(!config)
        initView({});
    else{
        var noOfRows = Math.ceil(config.items.length / 3);
        var height = 150 + (noOfRows * 150);
        gadgets.window.adjustHeight(height);
        initView(config);
    }
});