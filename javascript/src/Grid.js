export default class Grid {

    constructor ( Client, size ) {
        this.Client      = Client;
        this.enabled     = true;
        this.gridSize    = size;
        this.snap_assets = true;
        this.color       = '#CCCCCC';
        this.grid        = $( '#grid' );
    }

    enable () {
        this.enabled = true;
        this.draw();
    }

    disable () {
        this.enabled = false;
        this.remove();
    }

    draw () {
        console.log( 'Drawing grid' );

        let width  = this.grid.width(),
            height = this.grid.height();

        for ( let i = 0; (this.gridSize.x + i) < (width + this.gridSize.x); i += this.gridSize.x ) {
            for ( let v = 0; (this.gridSize.y + v) < (height + this.gridSize.y); v += this.gridSize.y ) {
                this.grid.append( $( '<div class="grid-line"></div>' ).css( {
                    width:       this.gridSize.x + 'px',
                    height:      this.gridSize.y + 'px',
                    left:        i + 'px',
                    top:         v + 'px',
                    borderColor: this.color
                } ) );
            }
        }

        return this;
    }

    remove () {
        this.grid.empty();

        return this;
    }

    setSize ( size ) {
        if ( typeof size !== "object" ) {
            throw new Error( 'Invalid size, expecting object received ' + (typeof size) );
        }
        this.gridSize = size;

        // Redraw
        this.remove();
        this.draw();
    }

    getSize () {
        return this.gridSize;
    }

    snapAssets () {
        return this.snap_assets;
    }

    snapToGrid ( position ) {
        if ( !this.snap_assets ) {
            return position;
        }

        return {
            x: position.x - (position.x % this.gridSize.x),
            y: position.y - (position.y % this.gridSize.y)
        };
    }

    editGrid () {
        this.Client.Popup.clear();
        this.Client.Popup.setHeader( 'Edit Grid' );
        this.Client.Popup.setBody( [
            {label: 'Enable', type: 'checkbox', name: 'grid_enabled', value: this.enabled},
            {label: 'Snap Assets', type: 'checkbox', name: 'grid_snap', value: this.snap_assets},
            {label: 'Width', type: 'text', name: 'grid_width', value: this.gridSize.x},
            {label: 'Height', type: 'text', name: 'grid_height', value: this.gridSize.y},
            {label: 'Color', type: 'text', name: 'grid_color', value: this.color}
        ] );
        this.Client.Popup.setFooter( null, null, this.saveSettings.bind( this ) );
        this.Client.Popup.openPopup();
    }

    saveSettings ( settings ) {
        console.log( 'Save grid settings', settings );

        this.enabled     = !!(settings.grid_enabled && settings.grid_enabled == "on");
        this.snap_assets = !!(settings.grid_snap && settings.grid_snap == "on");

        if ( settings.grid_width ) {
            this.gridSize.x = parseInt( settings.grid_width );
        }
        if ( settings.grid_height ) {
            this.gridSize.y = parseInt( settings.grid_height );
        }
        if ( settings.grid_color ) {
            this.color = settings.grid_color;
        }

        this.Client.Assets.snapAssets( this.snapAssets() ? [ this.gridSize.x, this.gridSize.y ] : false );

        // Redraw if grid is enabled
        this.remove();
        if ( this.enabled ) {
            this.draw();
        }
    }

}