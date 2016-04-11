
export default class Collection {

    constructor() {
        this.files = [];
        this.list = $('#collection-list');
    }

    add(file) {
        this.files.push(file);

        this.list.prepend(
            $('<div></div>')
                .addClass('file')
                .css('background-image', 'url(' + file.content + ')')
        );

        if(this.list && this.list[0] && this.list[0].scrollHeight > this.list.height()) {
            this.list.find('.file').addClass('smaller');
        }
    }

    draw() {
        this.list.empty();

        for(let i = 0; i < this.files.length; i++) {
            this.list
                .apppend(
                    $('<div></div>')
                        .addClass('file')
                        .css('background-image', 'url(' + this.files[i].content + ')')
                );
        }
    }

}