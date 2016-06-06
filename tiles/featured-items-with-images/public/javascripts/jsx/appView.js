var React = require('react');
var ReactDOM = require('react-dom');

var Items = React.createClass({
    getInitialState: function(){
        if(!this.props.savedConfig) return {items: [], heading: ""};
        return this.props.savedConfig;
    },
    getImageUrl: function(url){
        var domainName="";
        try{
            if(opensocial){
                domainName = opensocial.getEnvironment()['jiveUrl'];
            }
        }
        catch(err){};

        if(url.startsWith("/resources/statics/"))
            return domainName + url;
        else
            return url;
    },
    itemStyle: function(imageUrl){
        return {background: "url(" + this.getImageUrl(imageUrl) + ") center center #00BCCE"};
    },
    render: function(){
        return (
            <div className="featured-items">
            <h1 className="text-center view-title">{this.state.heading}</h1>
            <div className="row margin-bottom-md">
            {this.state.items.map(function(item, idx){
                var itemHeading = "";
                if(item.linkTitle.length > 100)
                    itemHeading = item.linkTitle.slice(0,100)+"...";
                else
                    itemHeading = item.linkTitle;

                return(
                    <div className="col-4" key={idx}>
                    <div className="featured-items-item" style={this.itemStyle(item.imageUrl)}>
                    <a className="dm-content font-style" target="_blank" href={item.linkUrl}>{item.linkTitle}</a>
                    </div>
                    </div>);
            }.bind(this))}
            </div>
            </div>
        );
    }
});

var initView = function(savedConfig){
    ReactDOM.render(React.createElement(Items, {savedConfig: savedConfig}), document.getElementById('view'));
};

window.initView = initView;