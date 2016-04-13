import _ from 'lodash';

export default class Assets {

    constructor(Client) {
        this.Client = Client;
        this.assets = [];
        this.map_list = $('#map-assets');
        this.list = $('#asset-list');
        this.selected_asset = null;
    }

    add(file, position) {
        file = _.extend({}, file);
        file.position = this.Client.Grid.snapToGrid(position);
        file.key = this.assets.push(file) - 1;

        let img = new Image(),
            self = this;

        img.onload = function () {
            file.width = this.width;
            file.height = this.height;
            self.onLoadDone(file);
        };
        img.src = file.content;
    }

    onLoadDone(file) {
        let listelement = $('<div></div>')
            .attr('id', 'list-asset-' + file.key)
            .addClass('file')
            .data('asset-key', file.key)
            .css('background-image', 'url(' + file.content + ')')
            .on('click', () => {
                this.selectAsset(file.key);
            });

        this.list.prepend(listelement);
        this.newAssetSettings(file);
    }

    selectAsset(key) {
        console.log('Selecting asset ', key);

        if (this.selected_asset) {
            this.getMapAsset(this.selected_asset).css('zIndex', 15);
        }

        this.getMapAsset(key).css('zIndex', 16);
        this.selected_asset = key;
    }

    addMapAsset(file) {
        console.log('Adding asset to map', file);

        let snap = this.Client.Grid.snapAssets(),
            drag_options = {
                scroll: false,
                stop: function (ev, ui) {
                    file.position.y = ui.position.top;
                    file.position.x = ui.position.left;
                }
            };

        if (snap) {
            let grid = this.Client.Grid.getSize();
            drag_options.grid = [grid.x, grid.y];
        }


        let element = $('<div></div>')
            .attr('id', 'map-asset-' + file.key)
            .addClass('asset-file')
            .css({
                position: 'absolute',
                left: file.position.x + 'px',
                top: file.position.y + 'px',
                width: file.width + 'px',
                height: file.height + 'px',
                backgroundImage: 'url(' + file.content + ')'
            })
            .on('mousedown', () => {
                this.selectAsset(file.key);
            })
            .draggable(drag_options);

        this.map_list.append(element);
    }

    getMapAsset(key) {
        return $('#map-asset-' + key);
    }

    getListAsset(key) {
        return $('#list-asset-' + key);
    }

    newAssetSettings(file) {
        this.Client.Popup.setHeader('Basic settings');
        this.Client.Popup.setBody([
            {label: false, type: 'hidden', name: 'asset_key', value: file.key},
            {label: 'Asset Name', type: 'text', name: 'asset_name', value: file.name},
            {label: 'Width', type: 'text', name: 'asset_width', value: file.width},
            {label: 'Height', type: 'text', name: 'asset_height', value: file.height},
            {label: 'Position top', type: 'text', name: 'asset_top', value: file.position.y},
            {label: 'Position left', type: 'text', name: 'asset_left', value: file.position.x}
        ]);
        this.Client.Popup.setFooter(null, null, this.saveAssetSettings.bind(this));
        this.Client.Popup.openPopup();
    }

    snapAssets( snap ) {
        $('.asset-file').draggable( 'option', 'grid', snap );

        if(snap) {
            this.assets.forEach(asset => {
                asset.position = this.Client.Grid.snapToGrid(asset.position);
            });
        }

        this.clear();
        this.draw();
    }

    saveAssetSettings(settings) {
        let file = this.assets[parseInt(settings.asset_key)];
        file.width = parseInt(settings.asset_width);
        file.height = parseInt(settings.asset_height);
        file.position.y = parseInt(settings.asset_top);
        file.position.x = parseInt(settings.asset_left);
        this.addMapAsset(file);
    }

    draw() {
        this.assets.forEach(asset => {
            this.addMapAsset(asset);
        });
    }

    clear() {
        this.map_list.empty();
    }
}