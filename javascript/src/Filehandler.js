export default class Filehandler {

    constructor(Client) {
        this.Client = Client;
        this.dropzone = $('#dropzone');

        this.dropzone.on('dragover', this.onDragOver.bind(this));
        this.dropzone.on('dragleave', this.onDragEnd.bind(this));
        this.dropzone.on('drop', this.onDrop.bind(this));
    }

    onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropzone.addClass('hovering');
    }

    onDragEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropzone.removeClass('hovering');
    }

    onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropzone.removeClass('hovering');

        console.log('Files dropped');

        let files = event.originalEvent.dataTransfer.files,
            reader = new FileReader(),
            iterator = 0;

        reader.onload = e => {
            this.Client.Collection.add({
                name: files[iterator].name,
                type: files[iterator].type,
                size: files[iterator].size,
                uploaded: (new Date().getTime() / 1000 | 0),
                content: e.currentTarget.result
            });

            iterator++;

            if(files[iterator]) {
                reader.readAsDataURL(files[iterator]);
            }
        };

        if(files[iterator]) {
            reader.readAsDataURL(files[iterator]);
        }
    }

}