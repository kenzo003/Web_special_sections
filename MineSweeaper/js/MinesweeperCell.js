//Класс игровой клетки
class MinesweeperCell {
    // Состояния клетки
    // - закрыты
    // - открыта
    // - помечена флажком

    row; //Координаты клетки (ряд)
    column; //Координаты клетки(столбец)
    state; //Состояние клетки
    mined; //Информация о наличии мины в клетке
    counter; //Счетчик мин в соседних клетках
    //Последовательность меток
    markSequence = [];

    constructor(row, column) {
        this.markSequence.push('closed');
        this.markSequence.push('flagged');

        this.row = row;
        this.column = column;
        this.state = this.markSequence[0];
        this.mined = false;
        this.counter = 0;
    }

    //Циклический переход по состояниям клетки (ПКМ)
    nextmark() {
        if (this.state == this.markSequence[0] || this.state == this.markSequence[1]) {
            var stateIndex = this.markSequence.indexOf(this.state);
            this.state = this.markSequence[(stateIndex + 1) % this.markSequence.length];
        }
    }

    //ЛКМ
    open() {
        if (this.state != this.markSequence[1]) {
            this.state = 'opened';
        }
    }

}
