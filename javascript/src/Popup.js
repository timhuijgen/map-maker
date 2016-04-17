export default class Popup {

    constructor ( Client ) {
        this.Client = Client;
    }

    setHeader ( title ) {
        $( '.popup-header h4' ).html( title );

        return this;
    }

    clearHeader () {
        this.setHeader( '' );

        return this;
    }

    setFooter ( cancelCb, successText, successCb ) {
        successText = successText || 'Save';

        $( '.popup-footer' )
            .append( $( '<div></div>' ).addClass( 'btn btn-default' ).html( 'Cancel' ).on( 'click', this.clearAndClose.bind( this, cancelCb ) ) )
            .append( $( '<div></div>' ).addClass( 'btn btn-primary pull-right' ).html( successText ).on( 'click', this.clearAndClose.bind( this, successCb ) ) );

        return this;
    }

    clearFooter () {
        $( '.popup-footer' ).empty();

        return this;
    }

    setBody ( data ) {
        let form = $( '<form></form>' );

        data.forEach( ( rowData ) => {
            let row = $( '<div></div>' );

            if ( rowData.type == 'checkbox' ) {
                row.addClass( 'checkbox' );
            } else {
                row.addClass( 'form-group' );
            }

            let input = $( '<input />' )
                .attr( 'type', rowData.type || 'text' )
                .attr( 'name', rowData.name );

            if ( rowData.type == 'checkbox' ) {
                input.attr( 'checked', rowData.value );
            } else {
                input.val( rowData.value );
                input.addClass( 'form-control' );
            }

            let label;
            if ( rowData.label ) {
                label = $( '<label></label>' ).html( rowData.label );
                row.append( label );
            }

            if ( label && rowData.type == 'checkbox' ) {
                label.prepend( input );
            } else {
                row.append( input );
            }
            form.append( row );
        } );

        $( '.popup-body' ).append( form );

        return this;
    }

    clearBody () {
        $( '.popup-body' ).empty();

        return this;
    }

    clearAndClose ( cb ) {
        if ( cb ) {
            let rawData = $( '.popup-body form' ).serializeArray(),
                data    = {};

            rawData.forEach( obj => {
                console.log( 'val', obj );

                data[ obj.name ] = obj.value;
            } );

            cb( data );
        }

        this.clear();
        this.closePopup();

        return this;
    }

    clear() {
        this.clearHeader();
        this.clearBody();
        this.clearFooter();

        return this;
    }

    closePopup () {
        $( '.popup' ).addClass( 'hidden' );

        return this;
    }

    openPopup () {
        $( '.popup' ).removeClass( 'hidden' );

        return this;
    }

}