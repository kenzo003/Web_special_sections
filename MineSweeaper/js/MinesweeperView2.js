class MinesweeperView {
    svg //холст
    cellSize; //разсер ячейки
    brdSize; //расстояние между ячейками
    colorOpened; //фон откртой ячейки
    colorClosed; //фон закрытой ячейки
    colorGrid; //фон сетки

    model;
    controller;
    buttonsTable = [];

    constructor(model, controller) {
        this.colorOpened = "#ededed";
        this.colorClosed = '#8f8f8f';
        this.colorGrid = '#bdbdbd';

        this.model = model;
        this.controller = controller;
        this.controller.setView(this);
        this.createBoard();
        this.syncWithModel();
        this.dispath();
    }

    dispath() {

        var cells = this.svg.getElementsByTagName('use');
        for (var i = 0, j = 0; i < cells.length; i++, j++) {
            cells[i].addEventListener('mouseup', this.callOnClick.bind(this.controller, cells[i]))
        }
        // this.svg.getElementsByTagName('use').addEventListener('mouseup', this.callOnClick.bind(this.controller));
        // this.canvas.addEventListener('mouseup', this.callOnClick.bind(this.controller));
    }

    callOnClick(cell, e) {
        var row = cell.getAttribute('y') / this.view.cellSize;
        var column = cell.getAttribute('x') / this.view.cellSize;
        // Получаем местоположение клетки, по которой кликнули мышью


        var state = this.model.getCell(row, column).state;

        if (e.button == 0 && state != 'flagged') {
            this.onLeftClick(this, row, column);
        } else if (e.button == 1) {
            this.onRightClick(this, row, column);
        }
    }

    //Компоновка игрового поля из клеток
    createBoard() {
        this.cellSize = 50;
        this.brdSize = 2;

        var width = Number(this.cellSize) * Number(this.model.columnCount);
        var height = Number(this.cellSize) * Number(this.model.rowCount);

        this.svg = SVG.create('svg', {width: width, height: height});
        document.getElementById('canvas').appendChild(this.svg);

        var grid = SVG.create('rect', {x: 0, y: 0, width: width, height: height, fill: this.colorGrid});
        this.svg.append(grid);

        this.drawItemInit();

        //Рисуем клетки

        for (var i = 0; i < this.model.rowCount; i++) {
            var buttonRow = [];
            for (var j = 0; j < this.model.columnCount; j++) {
                // this.drawClosed(i, j);
                buttonRow.push(null);
            }
            // this.drawMine(i, 0);
            this.buttonsTable.push(buttonRow);
        }
    }

    //##########################################################
    drawItemInit() {

        //library for ClosedCell id: closed_cell
        var defs_cl = SVG.create('defs', '');
        var symbol_cl = SVG.create('symbol', {id: 'closed_cell'});
        var cell_cl = SVG.create('rect', {
            width: this.cellSize - this.brdSize,
            height: this.cellSize - this.brdSize,
            fill: this.colorClosed
        });

        this.svg.append(defs_cl);
        defs_cl.append(symbol_cl);
        symbol_cl.append(cell_cl);


        //library for OpenedCell id: opened_cell
        var defs_op = SVG.create('defs', '');
        var symbol_op = SVG.create('symbol', {id: 'opened_cell'});
        var cell_op = SVG.create('rect', {
            x: 0,
            y: 0,
            width: this.cellSize - this.brdSize,
            height: this.cellSize - this.brdSize,
            fill: this.colorOpened
        });

        this.svg.append(defs_op);
        defs_op.append(symbol_op);
        symbol_op.append(cell_op);

        //library for MinedCell id: mined_cell
        var defs_mine = SVG.create('defs', '');
        var symbol_mine = SVG.create('symbol', {id: 'mined_cell'});
        var fill_mine = SVG.create('rect', {
            x: 0,
            y: 0,
            width: this.cellSize - this.brdSize,
            height: this.cellSize - this.brdSize,
            fill: this.colorOpened
        });
        var cell_mine = SVG.create('path', {
            d: "m49.35067,24.59204l-9.79526,3.5518l0,-7.09982l9.79526,3.54802zm-7.11219,-17.49615l-4.46251,9.57359l-4.92451,-5.02319l9.38702,-4.5504zm-17.16348,-7.24547l3.4828,9.9859l-6.96746,0l3.48466,-9.9859zm-17.16535,7.24547l9.39074,4.5504l-4.92638,5.02319l-4.46436,-9.57359zm-7.11032,17.49615l9.7971,-3.54802l0,7.09982l-9.7971,-3.5518zm7.11032,17.49615l4.46436,-9.56984l4.92638,5.02135l-9.39074,4.54849l0,0zm17.16535,7.25113l-3.48466,-9.98781l6.96746,0l-3.4828,9.98781zm17.16348,-7.25113l-9.38888,-4.5466l4.92451,-5.02134l4.46436,9.56794zm-29.30037,-17.49615l0,0c0,-6.8313 5.43479,-12.37083 12.13876,-12.37083c6.70209,0 12.13876,5.53953 12.13876,12.37083c0,6.83316 -5.43666,12.37268 -12.13876,12.37268c-6.70583,0 -12.13876,-5.53952 -12.13876,-12.37268l0,0z",
            fill: "black"
        });

        this.svg.append(defs_mine);
        defs_mine.append(symbol_mine);
        symbol_mine.append(fill_mine);
        symbol_mine.append(cell_mine);

        //library for FlaggedCell id: flagged_cell
        var defs_fl = SVG.create('defs', '');
        var symbol_fl = SVG.create('symbol', {id: 'flagged_cell'});
        var fill_fl = SVG.create('rect', {
            x: 0,
            y: 0,
            width: this.cellSize - this.brdSize,
            height: this.cellSize - this.brdSize,
            fill: this.colorClosed
        });
        var cell_fl = SVG.create('path', {
            d: "m9.15649,11.51124c-0.21922,-0.79888 -0.23867,-2.1074 -0.04433,-2.91082l0.64311,-2.65256c0.19432,-0.80341 1.05847,-1.57595 1.92144,-1.71654l5.92697,-0.96339c0.86235,-0.1406 2.27487,-0.13601 3.136,0.01026l6.4201,1.08799c0.86296,0.14626 2.27486,0.16112 3.14084,0.03429l6.28166,-0.92116c-0.00789,0.02857 -0.02185,0.05374 -0.02855,0.08231l-4.29949,19.22037l-1.9676,0.31995c-0.86292,0.14061 -2.27362,0.13486 -3.13658,-0.01024l-6.41827,-1.08913c-0.86113,-0.14513 -2.27487,-0.15998 -3.14086,-0.03316l-6.89194,1.01145c-0.866,0.12682 -1.44231,-0.4309 -1.28439,-1.24228l0.77182,-3.93139c0.15912,-0.8103 0.10996,-2.1257 -0.10806,-2.92459l-0.92186,-3.37136l0,0zm30.84051,-8.79645c0.86171,0.1714 1.41251,0.96338 1.23094,1.77253l-9.17472,41.011l-3.25197,0l9.30954,-41.62471c0.18461,-0.81258 1.02691,-1.33028 1.88621,-1.15882l0,0z",
            fill: "red"
        });

        this.svg.append(defs_fl);
        defs_fl.append(symbol_fl);
        symbol_fl.append(fill_fl);
        symbol_fl.append(cell_fl);

        //library for FlaggedCell id: counter_cell
        for (let i = 1; i <= 7; i++) {
            var color = 0;
            if (i == '1')
                color = 'blue';
            else if (i == '2')
                color = 'green';
            else if (i == '3')
                color = 'red';
            else if (i == '4')
                color = '#2F4F4F';
            else if (i == '5')
                color = '#800000';
            else if (i == '6')
                color = '#00FFFF';
            else if (i == '7')
                color = '#ff00ff';

            var defs_count = SVG.create('defs', '');
            var symbol_count = SVG.create('symbol', {id: "counter_cell" + i});
            var fill_count = SVG.create('rect', {
                x: 0,
                y: 0,
                width: this.cellSize - this.brdSize,
                height: this.cellSize - this.brdSize,
                fill: this.colorOpened
            });
            var text = SVG.create('text', {
                x: 16.6,
                y: 35.4,
                width: 0,
                'font-weight': 'bold',
                'xml:space': 'preserve',
                'text-anchor': 'start',
                'font-family': "Helvetica, Arial, sans-serif",
                'font-size': 30,
                'stroke-opacity': "null",
                fill: color,
            });
            text.textContent = i;
            this.svg.append(defs_count);
            defs_count.append(symbol_count);
            symbol_count.append(fill_count);
            symbol_count.append(text);
        }


    }

    drawMine(row, column) {
        if (this.buttonsTable[row][column] != null) {
        //     let use = SVG.create('use', {href: '#mined_cell', x: column * this.cellSize, y: row * this.cellSize});
        //     this.svg.append(use);
        // } else {
            this.buttonsTable[row][column].attr('href', '#mined_cell');
        }
    }

    drawOpened(row, column) {
        if (this.buttonsTable[row][column] != null) {
        //     let use = SVG.create('use', {href: '#opened_cell', x: column * this.cellSize, y: row * this.cellSize});
        //     this.svg.append(use);
        // } else {
            this.buttonsTable[row][column].attr('href', '#opened_cell');
        }
    }

    drawClosed(row, column) {
        if (this.buttonsTable[row][column] == null) {
            var use = SVG.create('use', {
                href: '#closed_cell',
                x: column * this.cellSize, y: row * this.cellSize,
                width: this.cellSize,
                height: this.cellSize
            });
            this.buttonsTable[row][column] = use;
            this.svg.append(use);
        } else {
            this.buttonsTable[row][column].attr('href', '#closed_cell');
        }
    }

    drawCounter(counter, row, column) {
        if (this.buttonsTable[row][column] != null) {
        //     let use = SVG.create('use', {href: '#counter_cell', x: column * this.cellSize, y: row * this.cellSize});
        //     this.svg.append(use);
        //     var text = SVG.create('text', {x: 0, y: 0, fill: 'red'});
        //     text.textContent = "1";
        //     use.append(text);
        // } else {
            this.buttonsTable[row][column].attr('href', "#counter_cell" + counter);
        }
    }

    drawFlag(row, column) {
        if (this.buttonsTable[row][column] != null) {
        //     let use = SVG.create('use', {href: '#flagged_cell', x: column * this.cellSize, y: row * this.cellSize});
        //     this.svg.append(use);
        // } else {
            this.buttonsTable[row][column].attr('href', '#flagged_cell');
        }
    }

    //##########################################################

    syncWithModel() {
        for (let i = 0; i < this.model.rowCount; i++) {
            for (let j = 0; j < this.model.columnCount; j++) {
                const cell = this.model.getCell(i, j);
                if (cell) {

                    if (this.model.isGameOver() && cell.mined) {
                        this.drawMine(cell.row, cell.column);
                        continue;
                    }

                    if (cell.state == 'closed') {
                        this.drawClosed(cell.row, cell.column);

                    } else if (cell.state == 'opened') {
                        this.drawOpened(cell.row, cell.column);

                        if (cell.counter > 0) {
                            this.drawCounter(cell.counter, cell.row, cell.column);
                        } else if (cell.mined) {
                            this.drawMine(cell.row, cell.column);
                        }

                    } else if (cell.state == 'flagged') {
                        this.drawFlag(cell.row, cell.column);
                    }
                }
            }
        }
    }

    showWinMessage() {
        alert("Поздравляем, Вы победили!");
    }

    showGameOverMessage() {
        alert("Игра окончена, Вы проиграли!");
    }


    blockCell(row, column, block) {
        // let btn = this.buttonsTable[row].children[column].firstChild;
        // if (!btn) {
        //     return;
        // }
        // if (block) {
        //     btn.onclick = '';
        //     // btn.disabled = true;
        // } else {
        //     btn.onmouseup = this.callOnLeftClick.bind(null, this.controller, row, column);
        //     ;
        //     // btn.disabled = false;
        // }
    }

    getGameSettings() {

    }


}