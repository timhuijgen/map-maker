export default class Popup {
    
    constructor(Client) {
        this.Client = Client;
    }
    
    setHeader(title) {
        $('.popup-header h4').html(title);
    }

    clearHeader() {
        this.setHeader('');
    }

    setFooter(cancelCb, successText, successCb) {
        successText = successText || 'Save';

        $('.popup-footer')
            .append($('<div></div>').addClass('btn btn-default').html('Cancel').on('click', this.clearAndClose.bind(this, cancelCb)))
            .append($('<div></div>').addClass('btn btn-primary pull-right').html(successText).on('click', this.clearAndClose.bind(this, successCb)))
    }

    clearFooter() {
        $('.popup-footer').empty();
    }

    setBody() {

    }

    clearBody() {
        $('.popup-body').empty();
    }

    clearAndClose(cb) {
        if(cb) {
            cb();
        }
        this.clearHeader();
        this.clearBody();
        this.clearFooter();
        this.closePopup();
    }

    closePopup() {
        $('.popup').addClass('hidden');
    }

    openPopup() {
        $('.popup').removeClass('hidden');
    }
    
}