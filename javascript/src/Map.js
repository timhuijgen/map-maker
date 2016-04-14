export default class Map {

    constructor ( Client, width = 1920, height = 1080 ) {
        this.Client     = Client;
        this.background = null;
        this.width      = width;
        this.height     = height;
        this.name       = '';
        this.position   = {x: 0, y: 0};
        this.map        = $( '#map-area' )
    }

    draw () {
        this.map.css( {
            width:  this.width,
            height: this.height,
            left:   this.position.x,
            top:    this.position.y
        } );

        return this;
    }

    editMap () {
        this.Client.Popup.setHeader( 'Edit Map' );
        this.Client.Popup.setBody( [
            {label: 'Map Name', type: 'text', name: 'map_name', value: this.name},
            {label: 'Width', type: 'text', name: 'map_width', value: this.width},
            {label: 'Height', type: 'text', name: 'map_height', value: this.height},
        ] );
        this.Client.Popup.setFooter( null, null, this.saveSettings.bind( this ) );
        this.Client.Popup.openPopup();
    }

    saveSettings ( settings ) {
        console.log( 'Saving map options', settings );

        if ( settings.map_width ) {
            this.width = settings.map_width;
        }
        if ( settings.map_height ) {
            this.height = settings.map_height;
        }
        if ( settings.map_name ) {
            this.name = settings.map_name;
        }

        this.draw();
        this.Client.Grid.remove().draw();
    }

    draggable ( toggle ) {
        this.map.draggable( {disabled: !toggle} );

        if ( toggle ) {
            $( '.asset-file' ).css( 'pointer-events', 'none' );
        } else {
            $( '.asset-file' ).css( 'pointer-events', 'auto' );
        }
    }
}