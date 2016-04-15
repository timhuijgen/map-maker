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

        this.map.droppable( {
            drop: ( ev, ui ) => {
                if ( !$( ui.draggable ).hasClass( 'file' ) ) {
                    console.warn( 'Trying to drop something on the map this is not from the collection' );
                    return;
                }

                let newPosX  = ui.offset.left - this.map.offset().left,
                    newPosY  = ui.offset.top - this.map.offset().top,
                    position = {x: newPosX, y: newPosY},
                    key      = $( ui.draggable ).data( 'file-key' );

                console.log( 'File [%s] dropped on map [%s %s]', key, position.x, position.y );
                this.Client.Assets.add( this.Client.Collection.getFile( key ), position );
            }
        } );

        return this;
    }

    editMap () {
        this.Client.Popup.clear();
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

        $( '.asset-file' ).css( 'pointer-events', ( toggle ) ? 'none' : 'auto' );
    }

    center () {
        this.position.x = ( $( window ).width() - this.width ) / 2;
        this.position.y = ( $( window ).height() - this.height ) / 2;
        this.draw();
    }
}