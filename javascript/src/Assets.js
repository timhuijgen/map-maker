import _ from 'lodash';

export default class Assets {
    
    constructor(Client) {
        this.Client = Client;
        this.files = [];
        this.map_list = $('#map-assets');
        this.list = $('#asset-list');
        this.selected_asset = null;
    }
    
    add(file, position) {
        console.log('Adding asset');
        file = _.extend({}, file);
        file.position = this.Client.Grid.snapToGrid(position);
        file.key = this.files.push(file) - 1;

        let img = new Image(),
            self = this;

        img.onload = function() {
            file.width = this.width;
            file.height = this.height;
            self.onLoadDone(file);
        };
        img.src = file.content;
    }


    onLoadDone(file) {
        let grid = this.Client.Grid.getSize();

        let element = $('<div></div>')
            .attr('id', 'map-asset-' + file.key)
            .addClass('asset-file')
            .css({
                position: 'absolute',
                left: file.position.x,
                top: file.position.y,
                width: file.width,
                height: file.height,
                backgroundImage: 'url(' + file.content + ')'
            })
            .on('click', () => {
                this.selectAsset(file.key);
            })
            .draggable({grid: [grid.x, grid.y]});

        this.map_list.append(element);

        let listelement = $('<div></div>')
            .attr('id', 'list-asset-' + file.key)
            .addClass('file')
            .css('background-image', 'url(' + file.content + ')')
            .on('click', () => {
                this.selectAsset(file.key);
            });

        this.list.prepend(listelement);

    }

    selectAsset(key) {
        console.log('Selecting asset ', key);

        if(this.selected_asset) {
            this.getMapAsset(this.selected_asset).css('zIndex', 15);
        }

        this.getMapAsset(key).css('zIndex', 16);
        this.selected_asset = key;
    }

    getMapAsset(key) {
        return $('#map-asset-' + key);
    }

    getListAsset(key) {
        return $('#list-asset-' + key);
    }
}