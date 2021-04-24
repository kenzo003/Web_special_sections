
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

    onLeftClick(obj ,row, column) {
        obj.model.openCell(row, column);
        obj.view.syncWithModel();
        if (obj.model.isWin()) {
            obj.view.showWinMessage();
            obj.startNewGame();
        } else if (obj.model.isGameOver()) {
            obj.view.showGameOverMessage();
            obj.startNewGame();
        }
    }

    onRightClick(obj ,row, column) {
        obj.model.nextCellMark(row, column);
        obj.view.syncWithModel();
        obj.view.blockCell(row, column, obj.model.getCell(row, column).state == 'flagged');
    }
}


var model = new MinesweeperModel();
var controller = new MinesweeperController(model);
var view = new MinesweeperView(model, controller);
