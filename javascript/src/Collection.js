import _ from 'lodash';

export default class Collection {

    constructor ( Client ) {
        this.Client = Client;
        this.files  = [];
        this.list   = $( '#collection-list' );
    }

    add ( file ) {
        if ( !this.isUnique( file.hash ) ) {
            console.warn( 'Adding a file which already exists in the collection' );
            return;
        }

        let filekey = this.files.push( file ) - 1,
            img     = new Image();

        img.onload = () => {
            let element = $( '<div></div>' )
                .addClass( 'file' )
                .data( 'file-key', filekey )
                .css( 'background-image', 'url(' + file.content + ')' );

            this.list.prepend( element );

            if ( this.list && this.list[ 0 ] && this.list[ 0 ].scrollHeight > this.list.height() ) {
                this.list.find( '.file' ).addClass( 'smaller' );
            }

            element.draggable( {
                scroll: false,
                helper: function () {
                    let helper = $( this ).clone();
                    helper.css( 'margin', 0 );
                    return helper;
                }
            } );
        };

        img.src = file.content;
    }

    getFile( key ) {
        return this.files[ key ] || false;
    }


    draw () {
        this.list.empty();

        this.files.forEach( ( file ) => {
            this.add( file );
        } );
    }

    isUnique ( hash ) {
        return !_.find( this.files, [ 'hash', hash ] )
    }

}