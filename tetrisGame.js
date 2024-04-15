/*
21130473_LamHongPhong_0376236485_DH21DTC
 */
$(document).ready(function () {
    $('#btn-start').click(function () {
        const startGame = $('.start-game')
        const beforeStartGame = $('.before-start-game')
        const btnStartGame = $('#btn-start')
        const configuraton = $('.bottom-bg')

        configuraton.hide()
        btnStartGame.text('Continue')
        beforeStartGame.css('display', 'none');
        startGame.css('display', 'flex');

        const level = parseInt($('#level').val())
        switch (level) {
            case 1:
                level_1();
                break
            case 2:
                level_2();
                break
            // case 3:
            //     break
            // case 4:
            //     break
            // case 5:
            //     break
            default:
                alert('not have other level')
                break
        }

        dropPiece()
        dialog()
    })
    //pause
    $('#btn-pause').click(() => {
        $('#btn-start').addClass('has-hover').removeClass('disabled-btn')
        showNotification('Pause')
    })
    //continue
    $('#btn-start').click(function () {
        closeDialog()
    })
    // new game
    $('.bottom-bg').on('click', '#btn-new-game', () => {
        reDrawBoard()
        score = 0
        $('#score').text(score)
        closeDialog()
        console.log('new game')
    })

})

const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ]
];

const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]
];

const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

const O = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]
];

const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
];

const canvas = document.getElementById("tetris-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const colorEmptySquare = "WHITE";
const COLUMNS = 10;
const ROWS = 20;
const squareSize = 20;

let stop = false
let score = 0;

// Tạo hàm vẽ ô vuông
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
}

// Tạo bảng
let board = [];
for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLUMNS; j++) {
        board[i][j] = colorEmptySquare;
    }
}

function reDrawBoard() {
    nextPiece = randomPiece()
    piece = randomPiece()
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            drawSquare(j, i, board[i][j] = colorEmptySquare)
            piece.y = -2
        }
    }
}

//vẽ bảng
function drawBroad() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            drawSquare(j, i, board[i][j])
        }
    }
}

drawBroad()

// Tạo đối tượng mảnh
function Piece(tetromino, color) {
    this.tetromino = tetromino; // một mảng cac mẫu của mảnh xếp
    this.color = color;
    // bắt đầu với mẫu đầu tiên của mảnh
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    // vị trí bắt đầu rơi của mảnh
    this.x = 3;
    this.y = -2;
}

// Tạo phương thức tô màu cho mảnh
Piece.prototype.fill = function (color) {
    for (let i = 0; i < this.activeTetromino.length; i++) {
        for (let j = 0; j < this.activeTetromino.length; j++) {
            if (this.activeTetromino[i][j]) drawSquare(this.x + j, this.y + i, color);
        }
    }
}

// the pieces and their colors
const PIECES = [
    [Z, "green"],
    [L, "purple"],
    [I, "orange"],
    [S, "red"],
    [T, "yellow"],
    [O, "blue"],
    [J, "cyan"]
];

// Hàm tạo mảnh rơi ngẫu nhiên
function randomPiece() {
    let randomPiecePattern = Math.floor(Math.random() * PIECES.length) // trả về 0-6
    return new Piece(PIECES[randomPiecePattern][0], PIECES[randomPiecePattern][1])
}

let nextPiece = randomPiece()
let currentPiece = nextPiece
let piece = currentPiece
nextPiece = randomPiece()

// tô một mảnh xếp
Piece.prototype.drawPiece = function () {
    this.fill(this.color)
}

// hủy tô màu một mảnh
Piece.prototype.unDrawPiece = function () {
    this.fill(colorEmptySquare)
}

//hàm xử lý va chạm
Piece.prototype.collision = function (x, y, piece) {
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece.length; j++) {
            // nếu là ô trống trong mẫu thì bỏ qua
            if (!piece[i][j]) continue;
            // toạ độ mới của piece sau khi di chuyển
            let newX = this.x + j + x;
            let newY = this.y + i + y;

            if (newX < 0 || newX >= COLUMNS || newY >= ROWS) return true;
            // nếu newY < 0 thì board[-y][x], bỏ qua nơi mảnh xếp rơi xuống
            if (newY < 0) continue;
            // Kiểm tra đã có piece ở chỗ đó hay ch
            if (board[newY][newX] != colorEmptySquare) return true;
        }
    }
    return false;
}

// hàm điều khiển xoay
Piece.prototype.rotato = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length]
    let kich = 0
    // kiểm tra mẫu xoay kế tiếp có va chạm hay không
    if (this.collision(0, 0, nextPattern)) {
        if (this.x < COLUMNS / 2) kich = 1 // dời mảnh xếp sang phải một vị trí
        else
            kich = -1 // dời mảnh xếp sang trái một vị trí
    }
    // nếu mẫu kế tiếp của mảnh xếp không xảy ra va chạm
    if (!this.collision(kich, 0, nextPattern)) {
        this.unDrawPiece()
        this.x += kich
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length
        this.activeTetromino = this.tetromino[this.tetrominoN]
        this.drawPiece()
    }
}

// hàm điều khiển sang phải
Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDrawPiece()
        this.x += 1
        this.drawPiece()
    }
}

// hàm điều khiển sang trai
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDrawPiece()
        this.x -= 1
        this.drawPiece()
    }
}

// dời mảnh xếp xuống dưới
Piece.prototype.moveDown = function () {
    // nếu chưa xảy ra va chạm
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDrawPiece()
        this.y += 1
        this.drawPiece()
    } else {
        this.lock()
        piece = currentPiece
        nextPiece = randomPiece()
    }
}

// hàm khóa di chuyển mảnh xếp khi gặp va chạm
Piece.prototype.lock = function () {
    for (let i = 0; i < this.activeTetromino.length; i++) {
        for (let j = 0; j < this.activeTetromino.length; j++) {
            // nếu là ô trắng thì bỏ qua
            if (!this.activeTetromino[i][j]) continue;
            // nếu màu tràn bảng theo chiều dọc thì kết thúc game
            if (this.y + i < 0) {
                implementGameOver()
                return
            }
            // đặt mảnh xếp khi gặp va chạm
            board[this.y + i][this.x + j] = this.color
        }
    }
    // xóa hàng đầy mảnh vuông
    for (let i = 0; i < ROWS; i++) {
        let isFullRow = true
        for (let j = 0; j < COLUMNS; j++) {
            isFullRow = isFullRow && (board[i][j] != colorEmptySquare)
        }
        // nếu có hàng đã đầy thì dời các hàng ở trên xuống dưới một vị trí và cộng điểm
        if (isFullRow) {
            for (let y = i; y > 1; y--) {
                for (let j = 0; j < COLUMNS; j++) {
                    board[y][j] = board[y - 1][j]
                }
            }
            for (let j = 0; j < COLUMNS; j++) {
                board[0][j] = colorEmptySquare
            }
            score += 10
        }
    }
    // cập nhật lại bảng
    drawBroad()

    scoreElement.innerHTML = score
}

// di chuyển mảnh xếp mỗi giây
let startDrop = Date.now()
let gameOver = false

function dropPiece() {
    let now = Date.now()
    let delta = now - startDrop
    createCurrentPiece()
    if (delta > 1000) {
        piece.moveDown()
        startDrop = Date.now()
    }
    // hàm requestAnimationFrame(callback) dùng để cập nhật và vẽ lại theo lịch đã đặt trước
    if (!gameOver && !stop) requestAnimationFrame(dropPiece)
}

function createCurrentPiece() {
    if (piece.y < 0) return
    if (currentPiece === null) return
    if (gameOver) return
    currentPiece = nextPiece
    drawNextPiece($('#suggest-piece'))
}

function implementGameOver() {
    gameOver = true
    $('#btn-start').addClass('disabled-btn').removeClass('has-hover')
    showNotification('Game Over')
}

// điều khiển mảnh xếp
document.addEventListener("keydown", CONTROL)

function CONTROL(event) {
    if (stop) {
        event.preventDefault()
        return
    }
    if (event.keyCode == 37) {
        piece.moveLeft()
        startDrop = Date.now()
    } else if (event.keyCode == 38) {
        piece.rotato()
        startDrop = Date.now()
    } else if (event.keyCode == 39) {
        piece.moveRight()
        startDrop = Date.now()
    } else {
        piece.moveDown()
    }
}

function drawNextPiece(canvas) {
    let draw = canvas.get(0).getContext('2d')
    draw.clearRect(0, 0, 100, 100)
    for (let i = 0; i < nextPiece.activeTetromino.length; i++) {
        for (let j = 0; j < nextPiece.activeTetromino.length; j++) {
            if (nextPiece.activeTetromino[i][j]) {
                draw.strokeStyle = "BLACK"
                draw.fillStyle = nextPiece.color
                draw.fillRect(j * squareSize, i * squareSize, squareSize, squareSize)
                draw.strokeRect(j * squareSize, i * squareSize, squareSize, squareSize)
            }
        }
    }
}

function level_1() {
    $('.display-suggest').addClass('suggest');
    $('.display-suggest').find('p').text("Suggest");
}

function level_2() {

}

function level_3() {

}

function level_4() {

}

function level_5() {

}

function level_6() {

}

// tạo dialog để thông báo
function dialog() {
    $("#dialog-message").dialog({
        autoOpen: false,
        modal: true,
        open: function () {
            stop = true
            $("#overlay").show();
        }
    })
}

function showNotification(text) {
    customDialog()
    $('.content-top span').text(text)
    $("#dialog-message").dialog("open");
}

function closeDialog() {
    $("#dialog-message").dialog("close");
    stop = false
    gameOver = false
    $("#overlay").hide();
    dropPiece()
}

// chỉnh sửa dialog
function customDialog() {
    const contentContainer = $('.dialog-content-container')
    if (contentContainer.parent().is('.ui-dialog-content')) {
        $('.bottom-bg').show()
        return
    }
    $('<div class="dialog-content-container"></div>').appendTo('.ui-dialog-content')
    $('<div class="content-top"><span></span></div>').appendTo('.dialog-content-container')
    $('<div class="content-bottom"></div>').appendTo('.dialog-content-container')
    $('.bottom-bg').appendTo('.content-bottom')
    $('.bottom-bg').show()
    $('<button id="btn-new-game" class="btn new-game has-hover">New Game</button>').appendTo('.bottom-bg')
}
