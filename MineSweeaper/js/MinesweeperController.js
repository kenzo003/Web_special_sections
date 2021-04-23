
class MinesweeperController {
    model;
    view;

    constructor(model) {
        this.model = model;
    }

    setView(view) {
        this.view = view;
    }

    startNewGame() {
        window.location.reload();
        // this.model.startGame(this.model.rowCount, this.model.columnCount, this.model.mineCount);
        // view.createBoard();
        // view.dispath();
    }

    onLeftClick(row, column) {
        this.model.openCell(row, column);
        this.view.syncWithModel();
        if (this.model.isWin()) {
            this.view.showWinMessage();
            this.startNewGame();
        } else if (this.model.isGameOver()) {
            this.view.showGameOverMessage();
            this.startNewGame();
        }
    }

    onRightClick(row, column) {
        this.model.nextCellMark(row, column);
        this.view.syncWithModel();
        this.view.blockCell(row, column, this.model.getCell(row, column).state == 'flagged');
    }
}


var model = new MinesweeperModel();
var controller = new MinesweeperController(model);
var view = new MinesweeperView(model, controller);
