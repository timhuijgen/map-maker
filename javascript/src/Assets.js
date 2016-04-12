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
        file.position = position;
        file.key = this.files.push(file) - 1;
        console.log('New filekey ', file.key );

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
        this.map_list.append(
            $('<div></div>')
                .addClass('asset-file')
                .css({
                    left: file.position.x,
                    top: file.position.y,
                    width: file.width,
                    height: file.height,
                    backgroundImage: 'url(' + file.content + ')'
                })
                .on('click', () => {
                    this.selectAsset(file.key);
                })
        );
        this.list.prepend(
            $('<div></div>')
                .addClass('file')
                .css('background-image', 'url(' + file.content + ')')
                .on('click', () => {
                    this.selectAsset(file.key);
                })
        );
    }

    selectAsset(key) {
        console.log('Selecting asset ', key);

        this.selected_asset = key;
    }
    
}