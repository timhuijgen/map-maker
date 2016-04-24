export default class ElementManager {

    constructor(Client) {
        this.Client = Client;

        this.asset = null;

        this.element = $( '#element-manager' );

        this.element.find('.toggle' ).on( 'click', this.toggle.bind(this) );
    }

    toggle() {
        this.element.toggleClass( 'out' );
        this.element.toggleClass( 'in' );
    }

    open() {
        this.element.addClass('in').removeClass('out');
    }

    close() {
        this.element.addClass('out').removeClass('in');
    }

    setAsset( Asset ) {
        this.asset = Asset;

        this.draw();

        return this;
    }

    draw() {
        let form = $('<form>');

        form.append( ElementManager.getAssetTemplate(this.asset) );

        form.change(e => this.handleFormChange);

        this.clear();
        this.element.append(form);
    }

    clear() {
        this.element.empty();
    }

    handleFormChange() {

    }

    updateForm() {
        console.log('Dragging', this.asset.position.x, this.asset.position.y);

        let form = this.element.find('form');
        form.find('input[name="position_x"]').val(this.asset.position.x);
        form.find('input[name="position_y"]').val(this.asset.position.y);
    }

    static getAssetTemplate( asset ) {
        let template = $('<div>');

        let name = $('<div>').addClass('form-group col-xs-12');
        name.append($('<label>').html('Name'));
        name.append($('<input>').attr('type', 'text').attr('name', 'name').addClass('form-control').val(asset.name));
        template.append( name );

        let size_left = $('<div>').addClass('form-group col-xs-6');
        size_left.append($('<label>').html('Width'));
        size_left.append($('<input>').attr('type', 'text').attr('name', 'width').addClass('form-control').val(asset.width));
        template.append( size_left );

        let size_right = $('<div>').addClass('form-group col-xs-6');
        size_right.append($('<label>').html('Height'));
        size_right.append($('<input>').attr('type', 'text').attr('name', 'height').addClass('form-control').val(asset.height));
        template.append( size_right );

        let pos_left = $('<div>').addClass('form-group col-xs-6');
        pos_left.append($('<label>').html('Left'));
        pos_left.append($('<input>').attr('type', 'text').attr('name', 'position_x').addClass('form-control').val(asset.position.x));
        template.append( pos_left );

        let pos_top = $('<div>').addClass('form-group col-xs-6');
        pos_top.append($('<label>').html('Top'));
        pos_top.append($('<input>').attr('type', 'text').attr('name', 'position_y').addClass('form-control').val(asset.position.y));
        template.append( pos_top );

        let type = $('<div>').addClass('form-group col-xs-6');
        type.append($('<label>').html('Object Type'));
        type.append(
            $('<select>').attr('name', 'object_type').addClass('form-control')
                .append($('<option>').attr('value', 'image').html('Image'))
                .append($('<option>').attr('value', 'sprite').html('Sprite'))
                .append($('<option>').attr('value', 'tilesprite').html('TileSprite'))
                .append($('<option>').attr('value', 'button').html('Button'))
                .val(asset.object_type)
        );
        template.append( type );

        let game_type = $('<div>').addClass('form-group col-xs-6');
        game_type.append($('<label>').html('Game Type'));
        game_type.append(
            $('<select>').attr('name', 'game_type').addClass('form-control')
                .append($('<option>').attr('value', 'object').html('Object'))
                .append($('<option>').attr('value', 'ladder').html('Ladder'))
                .append($('<option>').attr('value', 'decoration').html('Decoration'))
                .append($('<option>').attr('value', 'npc').html('NPC'))
                .append($('<option>').attr('value', 'portal').html('Portal'))
                .val(asset.game_type)
        );
        template.append( game_type );

        let collision = $('<div>').addClass('form-group col-xs-6');
        collision.append($('<label>').html('Collision'));
        collision.append(
            $('<select>').attr('name', 'game_type').addClass('form-control')
                .append($('<option>').attr('value', 'none').html('None'))
                .append($('<option>').attr('value', 'all').html('All'))
                .append($('<option>').attr('value', 'monsters').html('Monsters'))
                .append($('<option>').attr('value', 'players').html('Players'))
                .val(asset.collision)
        );
        template.append(collision);

        let delete_btn = $('<div>').addClass('form-group col-xs-12');
        delete_btn.append($('<button>').attr('type', 'button').addClass('btn btn-danger pull-down').html('Remove asset'));
        template.append( delete_btn );


        return template;
    }

}