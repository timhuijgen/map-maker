export default class Interface {

    constructor ( Client ) {
        this.Client = Client;
        this.toolbar = $( '#toolbar' );
        this.registerListeners();
    }

    registerListeners () {
        // Left menu toggle
        this.toolbar.find('.toggle' ).on( 'click', () => {
            this.toolbar.toggleClass( 'out' );
            this.toolbar.toggleClass( 'in' );
        } );

        $( '#map-move' ).on( 'click', ( ev ) => {
            $( ev.currentTarget ).toggleClass( 'active' );

            this.Client.Map.draggable( $( ev.currentTarget ).hasClass( 'active' ) );
        } );

        $( '#map-center' ).on( 'click', () => {
            this.Client.Map.center();
        });

        $('#map-zoom-in').on( 'click', () => {
            this.Client.Map.zoomIn();
        });

        $('#map-zoom-out').on( 'click', () => {
            this.Client.Map.zoomOut();
        });
    }

}