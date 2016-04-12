
export default class Collection {

    constructor(Client) {
        this.Client = Client;
        this.files = [];
        this.list = $('#collection-list');
    }

    add(file) {
        let filekey = this.files.push(file) - 1,
            img = new Image();

        img.onload = () => {
            let element = $('<div></div>')
                .addClass('file')
                .data('file-key', filekey)
                .css('background-image', 'url(' + file.content + ')');

            this.list.prepend(element);

            if(this.list && this.list[0] && this.list[0].scrollHeight > this.list.height()) {
                this.list.find('.file').addClass('smaller');
            }

            $('.file').draggable({containment: '.map-area', helper: function() {
                let helper = $(this).clone();
                helper.css('margin', 0);
                return helper;
            }});
            $('.map-area').droppable({
                drop: (ev, ui) => {
                    let position = { x: ui.position.left, y: ui.position.top },
                        key = $(ui.draggable).data('file-key');

                    console.log('File [%s] dropped on map [%s %s]', key, position.x, position.y);
                    this.Client.Assets.add(this.files[key], position);
                }
            });
        };

        img.src = file.content;
    }

    draw() {
        this.list.empty();

        this.files.forEach((file) => {
            this.add(file);
        });
    }

}