export default class ElementManager {

    constructor ( Client ) {
        this.Client = Client;

        this.asset = null;

        this.element = $( '#element-manager' );

        this.element.find( '.toggle' ).on( 'click', this.toggle.bind( this ) );

        this.filterRules = {
            object_type: {
                self: 'image',
            }
        }
    }

    toggle () {
        this.element.toggleClass( 'out' );
        this.element.toggleClass( 'in' );
    }

    open () {
        this.element.addClass( 'in' ).removeClass( 'out' );
    }

    close () {
        this.element.addClass( 'out' ).removeClass( 'in' );
    }

    setAsset ( Asset ) {
        this.asset = Asset;

        this.draw();

        return this;
    }

    draw () {
        let form = $( '<form>' ).addClass('content-wrap');

        form.append( this.getAssetTemplate( this.asset ) );

        this.clear();
        this.element.append( form );
    }

    clear () {
        this.element.find('.content-wrap').remove();
    }

    changeField ( field, value ) {
        console.log('changing %s to %s', field, value);

        let subfield = false;
        if(field.indexOf('.') > 0) {
            let chunks = field.split('.');
            field = chunks[0];
            subfield = chunks[1];
        }

        if(!this.asset) {
            return console.warn('Trying to edit an asset that does not exist');
        }

        if(subfield) {
            this.asset[field][subfield] = value;
            return this.asset.redraw();
        }
        this.asset[field] = value;
        this.asset.redraw();
    }

    applyDataFilters() {

    }

    deleteAsset() {
        this.asset.remove();
        this.close();
        this.clear();
    }

    updateForm () {
        console.log( 'Dragging', this.asset.position.x, this.asset.position.y );

        let form = this.element.find( 'form' );
        form.find( 'input[name="position_x"]' ).val( this.asset.position.x );
        form.find( 'input[name="position_y"]' ).val( this.asset.position.y );
    }

    getAssetTemplate ( asset ) {
        let template = $( '<div>' );

        let name = $( '<div>' ).addClass( 'form-group col-xs-12' );
        name.append( $( '<label>' ).html( 'Name' ) );
        name.append(
            $( '<input>' ).attr( 'type', 'text' ).attr( 'name', 'name' ).addClass( 'form-control' ).val( asset.name )
                .change(e => {
                    this.changeField('name', e.currentTarget.value)
                })
        );
        template.append( name );

        let size_left = $( '<div>' ).addClass( 'form-group col-xs-6' );
        size_left.append( $( '<label>' ).html( 'Width' ) );
        size_left.append(
            $( '<input>' ).attr( 'type', 'text' ).attr( 'name', 'width' ).addClass( 'form-control' ).val( asset.width )
                .on('change', e => {
                    this.changeField('width', e.currentTarget.value)
                })
        );
        template.append( size_left );

        let size_right = $( '<div>' ).addClass( 'form-group col-xs-6' );
        size_right.append( $( '<label>' ).html( 'Height' ) );
        size_right.append(
            $( '<input>' ).attr( 'type', 'text' ).attr( 'name', 'height' ).addClass( 'form-control' ).val( asset.height )
                .change(e => {
                    this.changeField('height', e.currentTarget.value)
                })
        );
        template.append( size_right );

        let pos_left = $( '<div>' ).addClass( 'form-group col-xs-6' );
        pos_left.append( $( '<label>' ).html( 'Left' ) );
        pos_left.append(
            $( '<input>' ).attr( 'type', 'text' ).attr( 'name', 'position_x' ).addClass( 'form-control' ).val( asset.position.x )
                .change(e => {
                    this.changeField('position.x', e.currentTarget.value)
                })
        );
        template.append( pos_left );

        let pos_top = $( '<div>' ).addClass( 'form-group col-xs-6' );
        pos_top.append( $( '<label>' ).html( 'Top' ) );
        pos_top.append(
            $( '<input>' ).attr( 'type', 'text' ).attr( 'name', 'position_y' ).addClass( 'form-control' ).val( asset.position.y )
                .change(e => {
                    this.changeField('position.y', e.currentTarget.value)
                })
        );
        template.append( pos_top );

        let type = $( '<div>' ).addClass( 'form-group col-xs-6' );
        type.append( $( '<label>' ).html( 'Object Type' ) );
        type.append(
            $( '<select>' ).attr( 'name', 'object_type' ).addClass( 'form-control' )
                .append( $( '<option>' ).attr( 'value', 'image' ).html( 'Image' ) )
                .append( $( '<option>' ).attr( 'value', 'sprite' ).html( 'Sprite' ) )
                .append( $( '<option>' ).attr( 'value', 'tilesprite' ).html( 'TileSprite' ).attr('disabled', true) )
                .append( $( '<option>' ).attr( 'value', 'button' ).html( 'Button' ).attr('disabled', true) )
                .val( asset.object_type )
                .change(e => {
                    this.changeField('object_type', e.currentTarget.value)
                })
        );
        template.append( type );

        let game_type = $( '<div>' ).addClass( 'form-group col-xs-6' );
        game_type.append( $( '<label>' ).html( 'Game Type' ) );
        game_type.append(
            $( '<select>' ).attr( 'name', 'game_type' ).addClass( 'form-control' )
                .append( $( '<option>' ).attr( 'value', 'object' ).html( 'Object' ) )
                .append( $( '<option>' ).attr( 'value', 'ladder' ).html( 'Ladder' ) )
                .append( $( '<option>' ).attr( 'value', 'decoration' ).html( 'Decoration' ) )
                .append( $( '<option>' ).attr( 'value', 'npc' ).html( 'NPC' ) )
                .append( $( '<option>' ).attr( 'value', 'portal' ).html( 'Portal' ) )
                .val( asset.game_type )
                .change(e => {
                    this.changeField('game_type', e.currentTarget.value)
                })
        );
        template.append( game_type );

        let collision = $( '<div>' ).addClass( 'form-group col-xs-6' );
        collision.append( $( '<label>' ).html( 'Collision' ) );
        collision.append(
            $( '<select>' ).attr( 'name', 'collision' ).addClass( 'form-control' )
                .append( $( '<option>' ).attr( 'value', 'none' ).html( 'None' ) )
                .append( $( '<option>' ).attr( 'value', 'all' ).html( 'All' ) )
                .append( $( '<option>' ).attr( 'value', 'monsters' ).html( 'Monsters' ) )
                .append( $( '<option>' ).attr( 'value', 'players' ).html( 'Players' ) )
                .val( asset.collision )
                .change(e => {
                    this.changeField('collision', e.currentTarget.value)
                })
        );
        template.append( collision );

        let dragLock = $('<div>').addClass('form-group col-xs-6');
        dragLock.append($('<label>').html('Drag Lock'));
        dragLock.append(
            $('<input>').attr('type', 'checkbox').addClass('checkbox').attr('checked', asset.drag_lock)
                .change(e => {
                    this.changeField('drag_lock', $(e.currentTarget).is(':checked'))
                })
        );
        template.append(dragLock);

        let spritesheet = $('<div>').addClass('form-group col-xs-6');
        spritesheet.append($('<label>').html('Spritesheet'));
        spritesheet.append(
            $('<input>').attr('type', 'checkbox').addClass('checkbox').attr('checked', asset.spritesheet)
                .change(e => {
                    this.changeField('spritesheet', $(e.currentTarget).is(':checked'))
                })
        );
        template.append(spritesheet);

        let frame = $( '<div>' ).addClass( 'form-group col-xs-6' );
        frame.append( $( '<label>' ).html( 'Frame' ) );
        frame.append(
            $( '<input>' ).attr( 'type', 'text' ).addClass( 'form-control' ).val( asset.frame )
                .change(e => {
                    this.changeField('frame', e.currentTarget.value)
                })
        );
        template.append( frame );

        let sprite_width = $( '<div>' ).addClass( 'form-group col-xs-6' );
        sprite_width.append( $( '<label>' ).html( 'Sprite Width' ) );
        sprite_width.append(
            $( '<input>' ).attr( 'type', 'text' ).addClass( 'form-control' ).val( asset.sprite_width )
                .change(e => {
                    this.changeField('sprite_width', e.currentTarget.value)
                })
        );
        template.append( sprite_width );

        let sprite_height = $( '<div>' ).addClass( 'form-group col-xs-6' );
        sprite_height.append( $( '<label>' ).html( 'Sprite Height' ) );
        sprite_height.append(
            $( '<input>' ).attr( 'type', 'text' ).addClass( 'form-control' ).val( asset.sprite_height )
                .change(e => {
                    this.changeField('sprite_height', e.currentTarget.value)
                })
        );
        template.append( sprite_height );

        let delete_btn = $( '<div>' ).addClass( 'form-group col-xs-12' );
        delete_btn.append(
            $( '<button>' ).attr( 'type', 'button' ).addClass( 'btn btn-danger pull-down' ).html( 'Remove asset' )
                .click(this.deleteAsset.bind(this))
        );
        template.append( delete_btn );


        return template;
    }

}