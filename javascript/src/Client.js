import Filehandler from './Filehandler';
import Grid from './Grid';
import Collection from './Collection';
import Assets from './Assets';
import InterfaceHandler from './InterfaceHandler';

export default class Client {

    constructor( options ) {
        this.options = options;
        console.log('Client constructed; ', options);

        this.Collection =   new Collection(this);
        this.Assets     =   new Assets(this);
        this.Grid       =   new Grid({x:20, y:20}).draw();
        this.Filehandler = new Filehandler(this);
        this.Interface  = new InterfaceHandler();
    }

}