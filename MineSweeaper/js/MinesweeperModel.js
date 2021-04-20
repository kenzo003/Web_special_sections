class MinesweeperModel {
    static const
    MIN_ROW_COUNT = 5;
    static const
    MAX_ROW_COUNT = 10;

    static const
    MIN_COLUMN_COUNT = 5;
    static const
    MAX_COLUMN_COUNT = 10;

    static const
    MIN_MINE_COUNT = 1;
    static const
    MAX_MINE_COUNT = 50;

    rowCount; //Количество рядов
    columnCount; //Количество столбцов
    mineCount; //Количество мин
    firstStep; //Метка первого шага
    gameOver; //Метка конца игры
    cellsTable = []; //Игровое поле

    constructor() {
        this.startGame(10, 10, 10);
    }

    //Осуществляет компоновку игрового поля по переданным параметрам (Устанавливает значение позиции, но не генерирует мины)
    startGame(rowCount, columnCount, mineCount) {
        this.rowCount = this.MIN_ROW_COUNT;
        this.columnCount = this.MIN_COLUMN_COUNT;
        this.mineCount = this.MIN_MINE_COUNT;

        //Проверка параметров на нахождение вне диапозона
        if (rowCount >= this.MIN_ROW_COUNT && rowCount <= this.MAX_ROW_COUNT) {
            this.rowCount = rowCount;
        }

        if (columnCount >= this.MIN_COLUMN_COUNT && columnCount <= this.MAX_COLUMN_COUNT) {
            this.columnCount = rowCount;
        }

        if (mineCount < rowCount * columnCount) {
            if (mineCount >= this.MIN_MINE_COUNT && mineCount <= this.MAX_MINE_COUNT) {
                this.mineCount = mineCount;
            }
        }

        this.firstStep = true;
        this.gameOver = false;

        //Создание списка клеток
        for (var i = 0; i < rowCount; i++) {
            var cellsRow = [];
            for (var j = 0; j < columnCount; j++) {
                cellsRow.push(new MinesweeperCell(i, j));
            }
            this.cellsTable.push(cellsRow);
        }
    }

    //Возвращает клетку игрового поля по строке row  и столбцу column
    getCell(row, column) {
        //Проверка на существование столбца
        if (row < 0 || column < 0 || this.rowCount <= row || this.columnCount <= column) {
            return null;
        }
        return this.cellsTable[row][column];
    }

    //Возвращает true, если все оставшиеся неоткрытые клетки игрового поля заминированы
    isWin() {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.columnCount; j++) {
                var cell = this.cellsTable[i][j];
                if (!cell.mined && (cell.state != 'opened' && cell.state != 'flagged')) {
                    return false;
                }
            }
            return true;
        }
    }

    //Проверка на конец игры
    isGameOver() {
        return this.gameOver;
    }

    //Расстановка мин на игровом поле
    generateMines() {
        for (var i = 0; i < this.mineCount; i++) {
            while (true) {
                var row = Math.floor(Math.random() * this.rowCount);
                var column = Math.floor(Math.random() * this.columnCount);

                var cell = this.getCell(row, column);

                //Проверяем что сгенерированная мина, находится не на открытой и не на заминироанной клетке
                if (cell.state != 'opened' && !cell.mined) {
                    cell.mined = true;
                    break;
                }
            }
        }
    }

    //Делегирование вызова open() объекту игровой клетки, позиция которой передается черзе параметры
    openCell(row, column) {
        //Получаем клетку игрового поля на указанной позиции
        var cell = this.getCell(row, column);

        //Проверка на существание клетки
        if (!cell) {
            return;
        }

        //Устанавливаем статус клетки 'opened'
        cell.open();

        //Если открытая клетка заминирована, то устанавливаем значение gameOver = true
        if (cell.mined) {
            this.gameOver = true;
            return;
        }

        //Если это только первый ход, то генерируем мины
        if (this.firstStep) {
            this.firstStep = false;
            this.generateMines();
            this.getCountAllMines();
        }

        // //Количество заминированных соседних клеток
        // cell.counter = this.countMinesAroundCell(row, column);

        //Если среди соседних клеток нет мин, то устанавливаем соседнем клеткам статус 'opened'
        if (cell.counter == 0) {
            //Получение списка соседних клеток
            var neighbours = this.getCellNeighbours(row, column);

            //Вызываем рукурсивно метод openCell для всех закрытых соседних клеток
            for (var i = 0; i < neighbours.length; i++) {
                if (neighbours[i].state == 'closed') {
                    this.openCell(neighbours[i].row, neighbours[i].column);
                }
            }
        }
    }

    //Делегирует вызов методу nextMark для клетки на указанной позиции
    nextCellMark(row, column) {
        var cell = this.getCell(row, column);
        if (cell) {
            cell.nextmark();
        }
    }


    //Подсчитываем количетсво мин пососедсву с указанной клеткой
    countMinesAroundCell(row, column) {
        var neighbours = this.getCellNeighbours(row, column);
        var count = 0;
        for (var i = 0; i < neighbours.length; i++) {
            if (neighbours[i].mined) {
                count++;
            }
        }
        return count;
    }

    getCountAllMines() {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.columnCount; j++) {
                var cell = this.getCell(i, j);
                cell.counter = this.countMinesAroundCell(i, j);
            }
        }
    }

    //Получаем все соседние клетки для указаной клетки
    getCellNeighbours(row, column) {
        var neighbours = [];
        for (var i = row - 1; i < row + 2; i++) {
            neighbours.push(this.getCell(i, column - 1))
            if (i != row) {
                neighbours.push(this.getCell(i, column))
            }
            neighbours.push(this.getCell(i, column + 1))
        }

        var result = [];
        //Фильтруем нулевые элементы
        for (var i = 0; i < neighbours.length; i++) {
            if (neighbours[i] != null) {
                result.push(neighbours[i]);
            }
        }
        return result;
    }
}
