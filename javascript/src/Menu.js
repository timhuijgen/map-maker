export default class Menu {

    constructor(Client) {
        this.Client = Client;
        this.menu = $('#main-menu');
        this.structure = [
            {title: 'File', links: [
                {type: 'action', title: 'New', callback: null},
                {type: 'action', title: 'Open', callback: null},
                {type: 'action', title: 'Save', callback: null},
                {type: 'divider'},
                {type: 'action', title: 'Export', callback: null}
            ]},
            {title: 'Edit', links: [
                {type: 'action', title: 'Map', callback: this.Client.Map.editMap.bind(this.Client.Map)},
                {type: 'action', title: 'Grid', callback: this.Client.Grid.editGrid.bind(this.Client.Grid)}
            ]}
        ];
    }

    draw() {
        this.structure.forEach((menuItem) => {
            let li = $('<li></li>')
                .addClass('dropdown')
                .append(
                    $('<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>')
                        .html(menuItem.title)
                );

            let ul = $('<ul></ul>')
                .addClass('dropdown-menu');

            menuItem.links.forEach((subItem) => {
                switch(subItem.type) {
                    case 'action':
                        ul.append(
                            $('<li></li>').append($('<a></a>').attr('href', '#').html(subItem.title))
                                .on('click', subItem.callback)
                        );
                        break;
                    case 'divider':
                        ul.append($('<li role="separator" class="divider"></li>'));
                        break;
                    case 'link':
                        ul.append(
                            $('<li></li>').append($('<a></a>').attr('href', subItem.href).html(subItem.title))
                        );
                        break;
                }

                li.append(ul);

            });
            this.menu.append(li);
        });

        return this;
    }

}