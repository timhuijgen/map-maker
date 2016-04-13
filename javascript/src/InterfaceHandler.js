export default class InterfaceHandler {

    constructor(Client) {
        this.Client = Client;
        this.registerListeners();
    }

    registerListeners() {
        // Left menu toggle
        $('#toolbar .toggle').on('click', function(){
            $('#toolbar').toggleClass('out');
            $('#toolbar').toggleClass('in');
        });

        // Right menu toggle
        $('#element-manager .toggle').on('click', function () {
            $('#element-manager').toggleClass('out');
            $('#element-manager').toggleClass('in');
        })
    }
    
}