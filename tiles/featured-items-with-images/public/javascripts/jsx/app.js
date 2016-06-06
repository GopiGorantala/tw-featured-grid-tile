var React = require('react');
var ReactDOM = require('react-dom');
var sortable = require('./react-sortable-mixin');

var TILE_TITLE_CHARACTER_LIMIT= 50;
var LINK_TITLE_CHARACTER_LIMIT= 45;

var RequiredValidation = React.createClass({
    render: function(){
        return (
            <div className="inline-error-message">Required</div>
        );
    }
});

var UrlValidation = React.createClass({
    render: function(){
        return (
            <div className="inline-error-message">Invalid Url</div>
        );
    }
});

var TitleLengthMsg = React.createClass({
    render: function(){
        var warnStyle={
            color:'#D2691E'
        };
        var msg;
        if(this.props.title && this.props.title.length >= TILE_TITLE_CHARACTER_LIMIT)
            msg = <div className="block"><div className="inline-error-message" style={warnStyle} >You have added the maximum (50) allowed characters for title.</div></div>;
        else
            msg = <div></div>;

        return msg;
    }
});

var Item = React.createClass({
    mixins: [sortable.ItemMixin],
    itemOptions:{
        handle: "ItemHandle",
        placeholder: "dashed"
    },
    changeImageUrl: function(e){
        this.props.handleChange({id: this.props.item.id,
            order: this.props.item.order,
            imageUrl: e.target.value,
            linkTitle: this.props.item.linkTitle,
            linkUrl: this.props.item.linkUrl
        });
    },
    changeLinkTitle: function(e){
        var title = e.target.value;
        if(title.length>LINK_TITLE_CHARACTER_LIMIT)
            title = title.slice(0,LINK_TITLE_CHARACTER_LIMIT);
        this.props.handleChange(_.merge(this.props.item, {linkTitle: title}));
    },
    changeLinkUrl: function(e){
        this.props.handleChange({id: this.props.item.id,
            order: this.props.item.order,
            imageUrl: this.props.item.imageUrl,
            linkTitle: this.props.item.linkTitle,
            linkUrl: e.target.value
        });
    },
    deleteLink:function(e){
        this.props.handleDelete(this.props.item.id);
    },
    isFieldFilled: function(text){
        if(text && text.trim() != "")
            return true;
        return false;
    },
    requiredValidation: function(text){
        if (!this.isFieldFilled(text) && this.props.showValidations)
            return <RequiredValidation />;
        return <div></div>;
    },
    urlValidation: function(url){
        if (this.isFieldFilled(url) && this.props.showValidations && !this.props.validUrl(url))
            return <UrlValidation />;
        return <div></div>;
    },
    render: function(){
        var imageUrlEmpty = this.requiredValidation(this.props.item.imageUrl);
        var linkTitleEmpty = this.requiredValidation(this.props.item.linkTitle);
        var linkUrlEmpty = this.requiredValidation(this.props.item.linkUrl);

        var urlValid = this.urlValidation(this.props.item.linkUrl);

        return (
            <div className="row margin-bottom-sm" data-docid={this.props.item.id}>
              <i className="fa fa-ellipsis-v dragable-icon" ref="ItemHandle"></i>

              <div className="col-4">
                <input placeholder="http://image" type="text" value={this.props.item.imageUrl} onChange={this.changeImageUrl} />
                {imageUrlEmpty}
              </div>

              <div className="col-4">
                <input placeholder={"Max " + LINK_TITLE_CHARACTER_LIMIT +" characters"} type="text" value={this.props.item.linkTitle} onChange={this.changeLinkTitle} />
                {linkTitleEmpty}
              </div>

              <div className="col-4">
                <div className= { this.props.itemSize ===1 ? null :"margin-right-lg"}>
                  <input placeholder="http://link" type="text" value={this.props.item.linkUrl} onChange={this.changeLinkUrl} />
                  {linkUrlEmpty} {urlValid}
                </div>
                  {this.props.itemSize === 1 ? null : <i className="fa fa-trash trash-icon fa-lg" onClick={this.deleteLink}></i>}
              </div>
            </div>
        );
    }
});

var ApplyChanges = React.createClass({
    close: function() {
        jive.tile.close();
    },
    render: function(){
        return (
            <div className="margin-top-lg">
                <a href="#" className="btn btn-primary" onClick={this.props.clickHandler}>Apply</a>
                <a href="#" className="btn btn-secondary margin-left-md" onClick={this.close}>Cancel</a>
            </div>
        );
    }
});

var TileTitle = React.createClass({
    render:function(){
        return (
            <div>
                <h1 className="tile-name margin-bottom-sm">
                    TW-Featured Items with Images
                </h1>
                <p className="description">
                    Display important links in a set of tiles with image backgrounds. We recommend you resize/crop your images to 400*136 for best results.
                </p>
            </div>
        )
    }
});

var ConfigTitle = React.createClass({
    render:function(){
        return (
          <div className="row margin-bottom-sm margin-top-lg">
            <div className="col-4"><h2 className="title">Image URL<span className="required-mark"></span></h2></div>
            <div className="col-4"><h2 className="title">Link Title<span className="required-mark"></span></h2></div>
            <div className="col-4"><h2 className="title">Link URL<span className="required-mark"></span></h2></div>
          </div>
        );
    }
});


var AddLink = React.createClass({
    render:function(){
        var msg = null;

        if (this.props.items && this.props.items.length >= 12)
            msg = <span>You have added the maximum number of items.</span>;
        else
            msg = "You can add a maximum of 12 items.";

        return (
          <div className="margin-top-md">
            <a className={this.props.items.length >= 12 ? "add-button disabled":"add-button" } href="#" onClick={this.props.addlink}>+ Add</a>
            <span className="hint">{msg}</span>
        </div>);
    }
});

var AddTitle = React.createClass({
    render:function(){
        return (
            <div>
                <h2 className="title">Title of This Tile</h2>
                <input type="text" placeholder={"Max " + TILE_TITLE_CHARACTER_LIMIT + " characters"} ref="tileTitle" value={this.props.title} onChange={this.props.onChangeTitle} />
            </div>
        );
    }
});

var Items = React.createClass({
    mixins: [sortable.ListMixin],
    listOptions:{
        resortFuncName: "reorderItems",
        left : 0,
        side : "y",
        restrict : "parent",
        model: "item"
    },
    getInitialState: function(){
        if(!this.props.savedConfig.items) return {items: [], heading: ""};
        return this.props.savedConfig;
    },
    componentWillMount: function(){
        if(this.state.items && this.state.items.length==0)
            this.addLink();
    },
    setDraggedId: function(id){
        this.setState({dragged_id: id});
    },
    setDroppedId: function(id){
        this.setState({dropped_id: id});
    },
    reorderItems: function(sourceIdx, targetIdx){
        var tmp = this.state.items[sourceIdx];
        this.state.items.splice(sourceIdx, 1);
        this.state.items.splice(targetIdx, 0, tmp);

        this.state.items.map(function(item, idx){
            this.state.items[idx].order = idx + 1;
        }.bind(this));

        this.setState({"items": this.state.items});
    },
    getItem: function(id){
        var items = _.filter(this.state.items, function(item){
            return item.id === id;
        });

        return items[0];
    },
    changeTitle: function(e){
        var title = e.target.value;
        if (title.length >TILE_TITLE_CHARACTER_LIMIT)
            title = title.slice(0,TILE_TITLE_CHARACTER_LIMIT);
        this.setState({heading: title});
        },
    changeLink: function(link){
        this.setState(function(state, props){
            var toKeep = _.filter(state["items"], function(l){
                return l["id"] != link["id"];
            });
            var sorted = _.sortBy(toKeep.concat(link), function(v){
                return v.order;
            });
            return {items: sorted};
        });
    },
    deleteLink: function(id){
        this.setState(function(state, props){
            var toKeep = _.filter(state["items"], function(l){
                return l["id"] != id;
            });

            var sorted = _.sortBy(toKeep, function(v){
                return v.id;
            });

            return {items: sorted};
        });
    },
    getNextId: function(){
        if(this.state.items.length == 0)
            return 1;
        else{
            var maxId = _.reduce(this.state.items, function(max, n){
                if (max.id > n.id)
                    return max;
                else
                    return n;
            });
        }
        return maxId.id +1;
    },
    getNextOrder: function(){
        if(this.state.items.length == 0)
            return 1;
        else{
            var maxOrder = _.reduce(this.state.items, function(max, n){
                if (max.order > n.order)
                    return max;
                else
                    return n;
            });
        }
        var newOrder = maxOrder.order +1;
        return newOrder;
    },
    addLink: function(){
        this.setState({show_validations: false});
        this.setState(function(state){
            var newLink = {id: this.getNextId(), order: this.getNextOrder(), linkTitle: ""};
            return {items: state.items.concat(newLink)};
        });
    },
    isFilled: function(v){
        if(v != "")
            return true;
        return false;
    },
    isTitleFilled: function(){
        if(this.state.heading != "")
            return true;
        return false;
    },
    notEmpty: function(key){
        var emptyItems = this.state.items.filter(function(item){
            if(item[key] && item[key].trim() != "")
                return false;
            return true;
        });

        if(emptyItems.length > 0)
            return false;
        return true;
    },
    validUrl: function(url){
        var reg = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

        if(url){
            return reg.test(url);
        }

        return false;
    },
    validUrls: function(){
        var invalidUrls = this.state.items.filter(function(item){
            if(item.linkUrl && this.validUrl(item.linkUrl))
                return false;
            return true;
         }.bind(this));

        if(invalidUrls.length > 0)
            return false;
        return true;
    },
    isValid: function(){
        if(this.notEmpty("imageUrl") && this.notEmpty("linkTitle") && this.notEmpty("linkUrl") && this.validUrls() && this.state.items.length > 0)
            return true;
        return false;
    },
    hasPrefix: function(url){
        return /^(http|https):\/\//.test(url);
    },
    appendPrefixes: function(){
        _.map(this.state.items, function(item){
            if(!this.hasPrefix(item.linkUrl)){
                var newLink = "http://".concat(item.linkUrl);
                this.changeLink(_.merge(item, {linkUrl: newLink}));
            }
        }.bind(this));
    },
    applyChanges: function(){
        this.setState({show_validations: true});
        if(this.isValid()){
            this.appendPrefixes();
            jive.tile.close({data:this.state});
        }
    },
    showTitleValidation: function(){
        var value = !this.isTitleFilled() && this.state.show_validations;
        return value;
    },
    render: function(){
        return (
            <div className="tile-wrapper">
                <TileTitle />

                <div className="item-container bg-color-gray margin-top-lg">

                    <AddTitle title={this.state.heading} onChangeTitle={this.changeTitle}/>
                    <ConfigTitle />

                    <div>
                    {this.state.items.map(function(v, idx){
                        return <Item validUrl={this.validUrl}
                                     reorderItems={this.reorderItems}
                                     setDraggedId={this.setDraggedId}
                                     setDroppedId={this.setDroppedId}
                                     item={v}
                                     key={idx}
                                     index={idx}
                                     handleChange={this.changeLink}
                                     handleDelete={this.deleteLink}
                                     showValidations={this.state.show_validations}
                                     itemSize={this.state.items.length}
                                    {...this.movableProps}/>;
                    }.bind(this))}
                    </div>
                    <div>
                        < AddLink addlink={this.addLink} show_validations={this.state.show_validations} items={this.state.items}/>
                    </div>
                </div>
                <ApplyChanges clickHandler={this.applyChanges}/>
            </div>
        );
    }
});

var initReact = function(savedConfig){
    ReactDOM.render( React.createElement(Items, {savedConfig: savedConfig}), document.getElementById('app'));
};

window.initReact = initReact;

//initReact({});