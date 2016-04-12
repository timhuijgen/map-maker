import Filehandler from './Filehandler';
import Grid from './Grid';
import Collection from './Collection';
import Assets from './Assets';
import InterfaceHandler from './InterfaceHandler';
import Menu from './Menu';
import Popup from './Popup';

export default class Client {

    constructor(options) {
        this.options = options;
        console.log('Client constructed; ', options);

        this.Collection = new Collection(this);
        this.Assets = new Assets(this);
        this.Grid = new Grid({x: 20, y: 20}).draw();
        this.Popup = new Popup(this);
        this.Interface = new InterfaceHandler(this);
        this.Filehandler = new Filehandler(this);
        this.Menu = new Menu(this).draw();
    }

    setMapOptions() {
        console.log('Set Map Options');

    }

}