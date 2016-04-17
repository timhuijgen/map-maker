export default class ElementManager {

    constructor(Client) {
        this.Client = Client;

        this.element = $( '#element-manager' );

        this.element.find('.toggle' ).on( 'click', this.toggle.bind(this) );
    }

    toggle() {
        this.element.toggleClass( 'out' );
        this.element.toggleClass( 'in' );
    }

    open() {
        this.element.addClass('out').removeClass('in');
    }

    close() {
        this.element.addClass('in').removeClass('out');
    }

}