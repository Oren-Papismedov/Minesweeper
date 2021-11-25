'use strict'

// console.log('hey');

const DEAD = '💀'
const WIN = '🏆'
const NORMAL = '😎'
const MARKED = '🚩'
const MINE = '💣'
const LIFE = "❤"

var gGameInterval
var elH3 = document.querySelector('h3')
var elH2 = document.querySelector('h2')
var elH1 = document.querySelector('h1')



var gBoard = []

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIFES: 1,
}

var gGame = {
    isOn: false,
    isOver: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

function init() {
    // console.log('init hey');
    gBoard = createBoard(gLevel.SIZE)
    document.querySelector('h3 span').innerText = NORMAL
    createRandomMines()
    renderLifes(gLevel.LIFES)
    renderBoard(gBoard)
    clearInterval(gGameInterval)
    gGame = {
        isOn: false,
        isOver: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    switch (gLevel.SIZE) {
        case 4:
            gLevel.LIFES = 1
            break;
        case 8:
            gLevel.LIFES = 2

            break;
        case 12:
            gLevel.LIFES = 3
            break;
    }
    elH3.style.backgroundColor = 'cornFlowerBlue'
    elH3.style.color = 'black'
    elH2.style.backgroundColor = 'cornFlowerBlue'
    elH2.style.color = 'black'
    elH1.style.backgroundColor = 'cornFlowerBlue'
    elH1.style.color = 'black'
}

function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,

            }
        }
    }
    // board[1][1].isMine = true
    // board[2][2].isMine = true
    return board;
}

function renderBoard(board) {
    var strHTML = '<br><table class="board">'
    console.table(board);
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            switch (gLevel.SIZE) {
                case 4:
                    strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this, event, ${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell"></td>`
                    // console.log(elCells.classList)
                    break;
                case 8:
                    strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this, event, ${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell-medium"></td>`
                    // console.log(elCells.classList)
                    // console.log('ffff')
                    break;
                case 12:
                    strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="cellMarked(this, event, ${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="cell-hard"></td>`
                    // console.log(elCells.classList)
                    break;


            }



        }
        strHTML += '</tr>'
    }
    strHTML += '<table>'
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    // console.log(strHTML)
}


function cellClicked(elCell, i, j,) {
    if (!gGame.isOver) {

        if (!gGame.isOn) {
            gGame.isOn = true
            gGameInterval = setInterval(() => {
                gGame.secsPassed++
                console.log(gGame.secsPassed);
                document.querySelector('.modalBtn h4').innerText = `Timer: ${gGame.secsPassed}`
            }, 1000);
        }
        if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
            if (gBoard[i][j].isMine) {
                elCell.innerText = MINE
                gLevel.LIFES--
                if (!gLevel.LIFES) {
                    var elH3 = document.querySelector('h3')
                    elH3.querySelector('span').innerText = DEAD
                    gameOver()
                } else {
                    // gLevel.LIFES--
                    renderLifes(gLevel.LIFES)
                }
                elH3.style.backgroundColor = 'black'
                elH3.style.color = 'white'
                elH2.style.backgroundColor = 'black'
                elH2.style.color = 'white'
                elH1.style.backgroundColor = 'black'
                elH1.style.color = 'white'
                // document.querySelector('h3 span').innerText = DEAD
            } else {
                gBoard[i][j].isShown = true
                gGame.shownCount = (gBoard[i][j].isShown) ? gGame.shownCount++ : gGame.shownCount
                gGame.shownCount++
                checkVictory(gBoard)
                var mineNegs = setMinesNegsCount(i, j, gBoard)
                elCell.style.backgroundColor = '#000000'
                if (!mineNegs) {
                    elCell.innerText = ''
                    showNegs(i, j, gBoard)
                } else {
                    elCell.innerText = mineNegs
                }

                // elCell.innerText = (gBoard[i][j].isMine) ? MINE : mineNegs
                // console.log(event);
            }
        }
    }
}
function gameOver() {
    gGame.isOver = true
    clearInterval(gGameInterval)
    gGame.isOn = false


}

function checkVictory(board) {
    var cellsCount = 0
    var notMineCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            cellsCount++
            if (!board[i][j].isMine) {
                notMineCount++
            }
        }
    }
    if (gGame.shownCount + gGame.markedCount === cellsCount && gGame.shownCount === notMineCount) {
        var elSpan = elH3.querySelector(' span')
        elSpan.innerText = WIN
        // elSpan.fontSize = '500px'

        elH3.style.backgroundColor = 'gold'
        elH3.style.color = 'black'
        elH2.style.backgroundColor = 'gold'
        elH2.style.color = 'black'
        elH1.style.backgroundColor = 'gold'
        elH1.style.color = 'black'

        gameOver()

    }

}


function cellMarked(elCell, ev, i, j) {
    if (!gGame.isOver) {
        elCell.addEventListener('contextmenu', (ev) => {
            ev.preventDefault();
        })
        if (!gGame.isOn) {
            gGame.isOn = true
            gGameInterval = setInterval(() => {
                gGame.secsPassed++
                document.querySelector('.modalBtn').innerText = `Timer: ${gGame.secsPassed}`
                // console.log(gGame.secsPassed)
            }, 1000);
        }
        if (ev.which === 3 && !gBoard[i][j].isShown) {
            if (!gBoard[i][j].isMarked) {
                gBoard[i][j].isMarked = true
                gGame.markedCount++
                elCell.innerText = MARKED
            } else {
                gBoard[i][j].isMarked = false
                gGame.markedCount--
                elCell.innerText = ''
            }

        }
        checkVictory(gBoard)
    }

}

function changeBoardSize(size) {
    gLevel.SIZE = size

    switch (gLevel.SIZE) {
        case 4:
            gLevel.MINES = 2
            gLevel.LIFES = 1
            break;
        case 8:
            gLevel.MINES = 12
            gLevel.LIFES = 2

            break;
        case 12:
            gLevel.MINES = 30
            gLevel.LIFES = 3
            break;


    }
    console.log(gLevel.MINES);
    init()

}


function createRandomMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var currI = getRandomInt(0, gLevel.SIZE)
        var currj = getRandomInt(0, gLevel.SIZE)
        if (gBoard[currI][currj].isMine) i--
        gBoard[currI][currj].isMine = true
    }

}

function showNegs(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            var elCurrCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            console.log(elCurrCell);
            cellClicked(elCurrCell, i, j)


        }
    }

}

function renderLifes(lifes) {
    var elLifes = document.querySelector('.level2')
    switch (lifes) {
        case 1:
            elLifes.innerText = LIFE
            break;
        case 2:
            elLifes.innerText = `${LIFE}  ${LIFE}       `
            break;
        case 3:
            elLifes.innerText = `${LIFE} ${LIFE} ${LIFE}`
            break;


    }
}
// }
// document.querySelector('elCell').addEventListener('contextmenu', (ev) => {
//     ev.preventDefault();
// })

// document.addEventListener('contextmenu', (ev) => {
//     ev.preventDefault();
// })

