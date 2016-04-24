import Filehandler from './Filehandler';
import Grid from './Grid';
import Collection from './Collection';
import Assets from './Assets';
import Interface from './Interface';
import Menu from './Menu';
import Popup from './Popup';
import Map from './Map';
import ElementManager from './ElementManager';

export default class Client {

    constructor ( options ) {
        this.options = options;
        console.log( 'Client constructed; ', options );

        this.ElementManager = new ElementManager(this);
        this.Collection  = new Collection( this );
        this.Assets      = new Assets( this );
        this.Map         = new Map( this, 800, 600 ).draw();
        this.Grid        = new Grid( this, {x: 20, y: 20} ).draw();
        this.Popup       = new Popup( this );
        this.Interface   = new Interface( this );
        this.Filehandler = new Filehandler( this );
        this.Menu        = new Menu( this ).draw();
    }

    isElectron() {
        return this.options.electron;
    }

}