const remote = require('electron').remote,
      electronMenu = remote.Menu;

export default class Menu {

    constructor ( Client ) {
        this.Client    = Client;
        this.menu      = $( '#main-menu' );
        this.structure = [
            {
                label: 'File',
                submenu: [
                    {label: 'New'},
                    {label: 'Open'},
                    {label: 'Save'},
                    {type: 'separator'},
                    {label: 'Export'},
                ]
            },
            {
                label:   'Edit',
                submenu: [
                    {
                        label: 'Map',
                        click: this.Client.Map.editMap.bind(this.Client.Map),
                        accelerator: 'Shift+Cmd+M'
                    },
                    {
                        label: 'Grid',
                        click: this.Client.Grid.editGrid.bind(this.Client.Grid),
                        accelerator: 'Shift+Cmd+G'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label:       'Undo',
                        accelerator: 'CmdOrCtrl+Z',
                        role:        'undo'
                    },
                    {
                        label:       'Redo',
                        accelerator: 'Shift+CmdOrCtrl+Z',
                        role:        'redo'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label:       'Cut',
                        accelerator: 'CmdOrCtrl+X',
                        role:        'cut'
                    },
                    {
                        label:       'Copy',
                        accelerator: 'CmdOrCtrl+C',
                        role:        'copy'
                    },
                    {
                        label:       'Paste',
                        accelerator: 'CmdOrCtrl+V',
                        role:        'paste'
                    },
                    {
                        label:       'Select All',
                        accelerator: 'CmdOrCtrl+A',
                        role:        'selectall'
                    },
                ]
            },
            {
                label:   'View',
                submenu: [
                    {
                        label:       'Reload',
                        accelerator: 'CmdOrCtrl+R',
                        click:       function ( item, focusedWindow ) {
                            if ( focusedWindow )
                                focusedWindow.reload();
                        }
                    },
                    {
                        label:       'Toggle Full Screen',
                        accelerator: (function () {
                            if ( process.platform == 'darwin' )
                                return 'Ctrl+Command+F';
                            else
                                return 'F11';
                        })(),
                        click:       function ( item, focusedWindow ) {
                            if ( focusedWindow )
                                focusedWindow.setFullScreen( !focusedWindow.isFullScreen() );
                        }
                    },
                    {
                        label:       'Toggle Developer Tools',
                        accelerator: (function () {
                            if ( process.platform == 'darwin' )
                                return 'Alt+Command+I';
                            else
                                return 'Ctrl+Shift+I';
                        })(),
                        click:       function ( item, focusedWindow ) {
                            if ( focusedWindow )
                                focusedWindow.toggleDevTools();
                        }
                    },
                ]
            },
            {
                label:   'Window',
                role:    'window',
                submenu: [
                    {
                        label:       'Minimize',
                        accelerator: 'CmdOrCtrl+M',
                        role:        'minimize'
                    },
                    {
                        label:       'Close',
                        accelerator: 'CmdOrCtrl+W',
                        role:        'close'
                    },
                ]
            },
            {
                label:   'Help',
                role:    'help',
                submenu: [
                    {
                        label: 'Learn More',
                        click: function () {
                            require( 'electron' ).shell.openExternal( 'http://electron.atom.io' )
                        }
                    },
                ]
            },
        ];

        if (window.process.platform == 'darwin') {
            this.structure[ 0 ].submenu.push( {
                label:       'Quit',
                accelerator: 'Command+Q',
                click:       function () {
                    remote.app.quit();
                }
            } );
        }

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