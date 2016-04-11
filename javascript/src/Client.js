import Filehandler from './Filehandler';
import Grid from './Grid';
import Collection from './Collection';

export default class Client {

    constructor( options ) {
        this.options = options;
        console.log('Client constructed; ', options);

        this.Collection =   new Collection();

        new Filehandler(this, $('#dropzone'));
        new Grid(20).draw();
    }

}