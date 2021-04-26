class MinesweeperView {
    canvas //холст
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
        this.dispath();
    }

    dispath() {
        this.canvas.addEventListener('mouseup', this.callOnClick.bind(this.controller));
    }

    callOnClick(e) {
        //Получаем местоположение клетки, по которой кликнули мышью
        var row = Math.floor(Number(e.pageX) / Number(this.view.cellSize));
        var column = Math.floor(Number(e.pageY) / Number(this.view.cellSize));

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

        this.canvas = document.getElementById('canvas');
        canvas.width = Number(this.cellSize) * Number(this.model.columnCount);
        canvas.height = Number(this.cellSize) * Number(this.model.rowCount);
        let context = canvas.getContext('2d');

        //Рисуем сетку
        context.fillStyle = this.colorGrid;
        context.fillRect(0, 0, canvas.width, canvas.height);

        //Рисуем клетки
        context.fillStyle = this.colorClosed;
        for (var i = 0; i < this.model.rowCount; i++) {
            var buttonRow = [];
            for (var j = 0; j < this.model.columnCount; j++) {
                context.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize - this.brdSize, this.cellSize - this.brdSize);
                buttonRow.push({i, j});
            }
            this.buttonsTable.push(buttonRow);
        }
    }

    //##########################################################
    drawMine(cellSize, column, row) {
        let context = this.canvas.getContext('2d');
        //Координты мины
        let cx = column * cellSize + (cellSize / 2);
        let cy = row * cellSize + (cellSize / 2);
        let radius = (cellSize / 4);

        context.beginPath();
        context.fillStyle = 'black';
        context.arc(cx, cy, radius, 0, 2 * Math.PI);
        context.fill();
    }

    drawOpened(cellSize, brdSize, column, row) {
        var context = this.canvas.getContext('2d');
        context.fillStyle = this.colorOpened;
        context.fillRect(column * cellSize, row * cellSize, cellSize - brdSize, cellSize - brdSize);
    }

    drawClosed(cellSize, brdSize, column, row) {
        var context = this.canvas.getContext('2d');
        context.fillStyle = this.colorClosed;
        context.fillRect(column * cellSize, row * cellSize, cellSize - brdSize, cellSize - brdSize);
    }

    drawCounter(cellSize, counter, x, y) {
        var fontSize = (cellSize / 2);
        var col = x * cellSize + cellSize / 3;
        var row = y * cellSize + cellSize / 1.5;
        var context = this.canvas.getContext('2d');

        if (counter == '1')
            context.fillStyle = 'blue';
        if (counter == '2')
            context.fillStyle = 'green';
        if (counter == '3')
            context.fillStyle = 'red';
        if (counter == '4')
            context.fillStyle = '#2F4F4F';
        if (counter == '5')
            context.fillStyle = '#800000';
        if (counter == '6')
            context.fillStyle = '#00FFFF';
        if (counter == '7')
            context.fillStyle = '#ff00ff';

        context.font = fontSize + "px Arial";
        context.fillText(counter, col, row);
    }

    drawFlag(cellSize, x, y) {
        let context = this.canvas.getContext('2d');

        let d = cellSize / 4;
        //Координты мины
        let cx = x * cellSize + d;
        let cy = y * cellSize + d;
        let width = (cellSize / 3);

        context.fillStyle = 'red';
        context.fillRect(cx, cy, width, width);
        context.fillStyle = 'black';
        context.fillRect(cx + width, cy - d / 4, 2, d * 2.5);

    }

    //##########################################################

    syncWithModel() {
        for (let i = 0; i < this.model.rowCount; i++) {
            for (let j = 0; j < this.model.columnCount; j++) {
                const cell = this.model.getCell(i, j);
                if (cell) {

                    if (this.model.isGameOver() && cell.mined) {
                        this.drawOpened(this.cellSize, this.brdSize, cell.row, cell.column);
                        this.drawMine(this.cellSize, cell.row, cell.column);
                        continue;
                    }

                    if (cell.state == 'closed') {
                        this.drawClosed(this.cellSize, this.brdSize, cell.row, cell.column);

                    } else if (cell.state == 'opened') {
                        this.drawOpened(this.cellSize, this.brdSize, cell.row, cell.column);

                        if (cell.counter > 0) {
                            this.drawCounter(this.cellSize, cell.counter, cell.row, cell.column);
                        } else if (cell.mined) {
                            this.drawMine(this.cellSize, cell.row, cell.column);
                        }

                    } else if (cell.state == 'flagged') {
                        this.drawFlag(this.cellSize, cell.row, cell.column);
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