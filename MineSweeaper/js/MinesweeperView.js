class MinesweeperView {
    board;
    panel;
    model;
    controller;
    buttonsTable = [];

    constructor(model, controller) {
        this.panel = document.querySelector('.frame')
        this.model = model;
        this.controller = controller;
        this.controller.setView(this);
        this.createBoard();
        this.dispath();
    }

    dispath() {
        for (var i = 0; i < this.model.rowCount; i++) {
            for (var j = 0; j < this.model.columnCount; j++) {
                var button = this.buttonsTable[i].children[j].firstChild;
                button.onmouseup = this.callOnLeftClick.bind(this.controller, i, j);
            }
        }
    }

    callOnLeftClick(row,column,e) {
       var state = this.model.getCell(row, column).state;
        if (e.button == 0 && state != 'flagged'){
            this.onLeftClick(this, row, column);
        }
        else if (e.button == 1){
            this.onRightClick(this, row, column);
        }
    }

    //Компоновка игрового поля из клеток
    createBoard() {
        this.panel.textContent = '';
        this.board = document.createElement('table');
        for (var i = 0; i < this.model.rowCount; i++) {
            var row = document.createElement('tr');
            for (var j = 0; j < this.model.columnCount; j++) {
                var th = document.createElement('th');
                var btn = document.createElement('button');
                th.appendChild(btn);
                row.appendChild(th);
            }
            this.buttonsTable.push(row);
            this.board.appendChild(row);
        }
        this.panel.appendChild(this.board);
    }

    syncWithModel() {
        for (var i = 0; i < this.model.rowCount; i++) {
            for (var j = 0; j < this.model.columnCount; j++) {
                var cell = this.model.getCell(i, j);

                if (cell) {
                    var btn = this.buttonsTable[i].children[j].firstChild;

                    if (this.model.isGameOver() && cell.mined) {
                        btn.setAttribute('class', 'mine');
                        btn.setAttribute('disabled', 'true');
                        continue;
                    }

                    if (cell.state == 'closed') {
                        btn.setAttribute('class', '');
                        // if (this.model.isGameOver()) {
                        //     cell.state = 'opened';
                        // }
                        btn.textContent = '';
                    } else if (cell.state == 'opened') {
                        btn.setAttribute('class', 'opened');
                        btn.setAttribute('disabled', 'true');

                        if (cell.counter > 0) {
                            btn.textContent = cell.counter;
                        } else if (cell.mined) {
                            btn.setAttribute('class', 'mine');
                        }

                    } else if (cell.state == 'flagged') {
                        btn.setAttribute('class', 'flagged');
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
        var btn = this.buttonsTable[row].children[column].firstChild;
        if (!btn) {
            return;
        }
        if (block) {
            btn.onclick = '';
            // btn.disabled = true;
        } else {
            btn.onmouseup = this.callOnLeftClick.bind(null, this.controller, row, column);;
            // btn.disabled = false;
        }

    }

    getGameSettings() {

    }


}