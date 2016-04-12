import Filehandler from './Filehandler';
import Grid from './Grid';
import Collection from './Collection';
import Assets from './Assets';

export default class Client {

    constructor( options ) {
        this.options = options;
        console.log('Client constructed; ', options);

        this.Collection =   new Collection(this);
        this.Assets     =   new Assets(this);
        
        new Filehandler(this, $('#dropzone'));
        new Grid(20).draw();
        
        
    }

}