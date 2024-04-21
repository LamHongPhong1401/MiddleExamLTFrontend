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
        btnStartGame.hide()
        beforeStartGame.css('display', 'none')
        startGame.css('display', 'flex')

        currentLevel = parseInt($('#level').val())

        drawBroad()
        chooseLevel()
        dropPiece()
    })
    //pause
    $('#btn-pause').click(function (e) {
        showNotification('Tạm dừng')
        $('#btn-continue').prop('disabled', false)
        $('#btn-continue').addClass('has-hover').removeClass('disabled-btn')
        e.preventDefault();
        isPause = true
    })
    //continue
    $('.bottom-bg').on('click', '#btn-continue', function (e) {
        closeDialog()
        e.preventDefault();
    })
    // new game
    $('.bottom-bg').on('click', '#btn-new-game', () => {
        reDrawBoard()
        score = 0
        $('#score').text(score)
        closeDialog()
        currentLevel = alterLevel
        chooseLevel()
    })
    $('#level').change(() => {
        alterLevel = parseInt($('#level').val())
        if (currentLevel === alterLevel) {
            $('#btn-continue').prop('disabled', false)
            $('#btn-continue').addClass('has-hover').removeClass('disabled-btn')
        } else {
            $('#btn-continue').prop('disabled', true)
            $('#btn-continue').addClass('disabled-btn').removeClass('has-hover')
        }
    })

    dialog()
})

$(document).on("keydown", function (event) {
    // Kiểm tra nếu mã phím là 27 (mã phím cho phím Esc)
    if (event.keyCode === 27) {
        if (checkPauseKeydown) {
            $('#btn-pause').trigger('click')
            checkPauseKeydown = false
        } else {
            closeDialog()
            checkPauseKeydown = true
        }
    }

    if (isPause) {
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
});

let currentLevel
let alterLevel
// check pause game by keydown
let checkPauseKeydown = true
const I = [[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0],], [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0],], [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0],], [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0],]];

const J = [[[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 1], [0, 1, 0], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 0, 1]], [[0, 1, 0], [0, 1, 0], [1, 1, 0]]];

const L = [[[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 0], [0, 1, 1]], [[0, 0, 0], [1, 1, 1], [1, 0, 0]], [[1, 1, 0], [0, 1, 0], [0, 1, 0]]];

const O = [[[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0],]];

const S = [[[0, 1, 1], [1, 1, 0], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 0, 1]], [[0, 0, 0], [0, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 0], [0, 1, 0]]];

const T = [[[0, 1, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 1, 0]], [[0, 1, 0], [1, 1, 0], [0, 1, 0]]];

const Z = [[[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 0, 1], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 0], [0, 1, 1]], [[0, 1, 0], [1, 1, 0], [1, 0, 0]]];

const canvas = document.getElementById("tetris-canvas");
const ctx = canvas.getContext("2d");

const WHITE = "WHITE";
const GRAY = 'GRAY'
const COLUMNS = 10;
const ROWS = 20;
const squareSize = 20;

let score = 0;
let isPause = false
const obstacles = []


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
        board[i][j] = WHITE;
    }
}

function reDrawBoard() {
    nextPiece = randomPiece()
    piece = randomPiece()
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            drawSquare(j, i, board[i][j] = WHITE)
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
const PIECES = [[Z, "GREEN"], [L, "PURPLE"], [I, "ORANGE"], [S, "RED"], [T, "YELLOW"], [O, "BLUE"], [J, "CYAN"]];

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
    this.fill(WHITE)
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
            // Kiểm tra đã có piece ở chỗ đó hay chua
            if (board[newY][newX] !== WHITE) return true;
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
        else kich = -1 // dời mảnh xếp sang trái một vị trí
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
            if (this.y + i <= 0) {
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
            isFullRow = isFullRow && (board[i][j] !== WHITE)
        }
        // nếu có hàng đã đầy thì dời các hàng ở trên xuống dưới một vị trí và cộng điểm
        if (isFullRow) {
            for (let y = i; y > 1; y--) {
                for (let j = 0; j < COLUMNS; j++) {
                    if(board[y - 1][j] === GRAY ) {
                        board[y][j] = WHITE
                        continue
                    }
                    if(board[y][j] === GRAY) continue
                    board[y][j] = board[y - 1][j]
                }
            }
            for (let j = 0; j < COLUMNS; j++) {
                board[0][j] = WHITE
            }
            score += 10
        }
    }
    // cập nhật lại bảng
    drawBroad()

    $('#score').text(score)
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
    if (!gameOver && !isPause) requestAnimationFrame(dropPiece)
}

function createCurrentPiece() {
    if (gameOver) return
    if (piece.y < 0) return
    if (currentPiece === null) return
    currentPiece = nextPiece
    const level = parseInt($('#level').val())
    switch (level) {
        case 1:
            drawNextPiece($('#suggest-piece'))
            break
        case 2:
            break
        case 3:
            break
        // case 4:
        //     break
        // case 5:
        //     break
        default:
            break
    }

}

function implementGameOver() {
    gameOver = true
    isPause = true
    showNotification('Kết thúc')
    $('#btn-continue').addClass('disabled-btn').removeClass('has-hover')
    $('#btn-continue').prop('disabled', true)
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
    $('.display-suggest').css('visibility', 'visible')
    if ($('.display-suggest').hasClass('suggest')) {
        return
    }
    $('.display-suggest').addClass('suggest');
    $('.display-suggest').find('p').text("Suggest");
}

function level_2() {
    $('.display-suggest').css('visibility', 'hidden');
}

function level_3() {
    level_2()
    drawObstacles(5)
}

function level_4() {
    level_2()
    deleteSquare()
}

function level_5() {

}

function level_6() {

}

// tạo dialog để thông báo
function dialog() {
    $("#dialog-message").dialog({
        autoOpen: false, modal: true, open: function () {
            isPause = true
            $("#overlay").show();
        }
    })
}

function showNotification(text) {
    customDialog()
    $('.content-top span').text(text)
    $('.content-top span').css('text-transform', 'uppercase')
    $("#dialog-message").dialog("open");
}

function closeDialog() {
    $("#dialog-message").dialog("close");
    isPause = false
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
    $('<button id="btn-new-game" class="btn  has-hover"><i class="fa-solid fa-rotate-right"></i></button>').appendTo('.bottom-bg')
    $('<button id="btn-continue" class="btn has-hover"><i class="fa-solid fa-play"></i></button>').appendTo('.bottom-bg')
}

//chon level
function chooseLevel() {
    const currentLevel = parseInt($('#level').val())
    switch (currentLevel) {
        case 1:
            level_1();
            break
        case 2:
            level_2();
            break
        case 3:
            level_3()
            break
        case 4:
            level_4()
            break
        // case 5:
        //     break
        default:
            break
    }
}

// Tạo 1 chướng ngại vật xuất hiện sau mỗi 3 giây ngâu nhiên (tối đa num obstacles)
function drawObstacles(num) {
    let count = 0
    let setIntervalID = setInterval(function () {
        let obstacle = randomObstacle()

        obstacles.push(obstacle)
        drawSquare(obstacle.y, obstacle.x, board[obstacle.x][obstacle.y] = GRAY)
        count++
        if (count >= num) clearInterval(setIntervalID)
    }, 5000)
}

function Obstacle(x, y) {
    this.x = x
    this.y = y
}

Obstacle.prototype.unDraw = function () {
    drawSquare(this.y, this.x, WHITE)
}

Obstacle.prototype.draw = function () {
    drawSquare(this.y, this.x, GRAY)
}

Obstacle.prototype.checkObstacle = function (x) {
    if(this.x + x === ROWS) return false
    return board[this.x + x][this.y] === GRAY
}

Obstacle.prototype.moveObstacle = function (direction) {
    this.unDraw()
    this.x += direction
    this.draw()
}

// x,y la cot, dong
function randomObstacle() {
    let x = Math.floor(Math.random() * ROWS)
    let y = Math.floor(Math.random() * COLUMNS)
    let initialization = true
    // random lai 1 lan nua neu obstacle thuoc hang thu 1 or 0, hoac bang da ton tai mau khac
    while(initialization){
        if (x < 2 || x > 17 || board[x][y] !== WHITE) {
             x = Math.floor(Math.random() * ROWS)
             y = Math.floor(Math.random() * COLUMNS)
            initialization = true
        } else {
            initialization = false
        }

    }
    return new Obstacle(x, y)
}
function deleteSquare() {
    let dropObstacle = false
    drawObstacles(3)
    setInterval(function () {
        // tam dung event
        if (obstacles.length < 3 && !dropObstacle) return
        // lấy 1 chướng ngại vật ngẫu nhiên
        const random = Math.floor(Math.random() * obstacles.length)
        const ob = obstacles[random]

        const initialX = ob.x
        const initialY = ob.y

        let setIntervalID = setInterval(function () {
            dropObstacle = true
            if(isPause) return
            board[ob.x][ob.y] =  WHITE
            if(ob.checkObstacle(1)) {
                ob.moveObstacle(2)
            }else {
                ob.moveObstacle(1)
            }
            
            if (ob.x === ROWS) {
                ob.unDraw()
                ob.x = initialX
                ob.y = initialY
                clearInterval(setIntervalID)
                // Tìm vị trí của đối tượng cần xóa trong mảng
                const index = obstacles.indexOf(ob);
                // Loại bỏ đối tượng từ mảng
                if (index !== -1) {
                    obstacles.splice(index, 1);
                }
            }
            //tạo chướng ngại vật mới khi độ dài danh sách chứa bằng 0
            if (obstacles.length === 0){
                const newObstacle = randomObstacle()
                obstacles.push(newObstacle)
                newObstacle.draw()
                board[newObstacle.x][newObstacle.y] = GRAY
            }
        }, 500)
    }, 30000)
}
