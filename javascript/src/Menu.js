import { remote } from 'electron';
const electronMenu = remote.Menu;

import menuStructure from './menuStructure';
      

export default class Menu {

    constructor ( Client ) {
        this.Client    = Client;
        this.menu      = $( '#main-menu' );
        this.structure = menuStructure.apply(this);

    }

    draw () {
        if(this.Client.isElectron()) {
            return this.electronMenu();
        }
        return this.htmlMenu();
    }

    electronMenu() {
        let template = this.structure;

        let menu = electronMenu.buildFromTemplate(template);
        electronMenu.setApplicationMenu(menu);

        return this;
    }

    htmlMenu() {
        this.structure.forEach( ( menuItem ) => {
            let li = $( '<li></li>' )
                .addClass( 'dropdown' )
                .append(
                    $( '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>' )
                        .html( menuItem.label )
                );

            let ul = $( '<ul></ul>' )
                .addClass( 'dropdown-menu' );

            menuItem.submenu.forEach( ( subItem ) => {
                if ( subItem.type && subItem.type == 'separator' ) {
                    ul.append( $( '<li role="separator" class="divider"></li>' ) );
                } else {
                    ul.append(
                        $( '<li></li>' ).append( $( '<a></a>' ).attr( 'href', '#' ).html( subItem.label ) )
                            .on( 'click', subItem.click || function(){})
                    );
                }

                li.append( ul );

            } );
            this.menu.append( li );
        } );

        return this;
    }

}