$(document).ready(function () {


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
for (i = 0; i < ROWS; i++) {
    board[i] = [];
    for (j = 0; j < COLUMNS; j++) {
        board[i][j] = colorEmptySquare;
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
    let randomPiecePattern = Math.floor(Math.random() * PIECES.length)
    return new Piece(PIECES[randomPiecePattern][0], PIECES[randomPiecePattern][1])
}

var piece = randomPiece()

//to mot manh trong bang
Piece.prototype.drawPiece = function () {
    this.fill(this.color)
}

//huy to mot manh trong bang
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
            // nếu newY < 0 thì board[-1][x] không đúng quy tắc game
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
        if (this.x < COLUMNS / 2) kich = 1 // dời mảnh xếp sang phải
        else
            kich = -1 // dời mảnh xếp sang trái
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
    if(!this.collision(1, 0, this.activeTetromino)){
        this.unDrawPiece()
        this.x += 1
        this.drawPiece()
    }

}

// hàm điều khiển sang trai
Piece.prototype.moveLeft = function () {
    if(!this.collision(-1, 0, this.activeTetromino)){
        this.unDrawPiece()
        this.x -= 1
        this.drawPiece()
    }
}

// dời mảnh xếp xuống dưới
Piece.prototype.moveDown = function () {
    if(!this.collision(0, 1, this.activeTetromino)){
        this.unDrawPiece()
        this.y +=1
        this.drawPiece()
    }else{
        this.lock()
        piece = randomPiece()
    }
}

// hàm khóa di chuyển mảnh xếp khi gặp va chạm
Piece.prototype.lock = function () {
    for (let i = 0; i < this.activeTetromino.length ; i++) {
        for (let j = 0; j < this.activeTetromino.length; j++) {
            // nếu là ô trắng thì bỏ qua
            if(!this.activeTetromino[i][j]) continue;
            // nếu màu tràn bảng theo chiều dọc thì kết thúc game
            if(this.y + j < 0) {
                alert("game over")
                gameOver = true
                break
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
        // nếu có hàng đã đầy thì dời hàng ở trên xuống hàng dưới và cộng điểm
        if(isFullRow){
            for (let y = i; y > 1 ; y--) {
                for (let j = 0; j < COLUMNS; j++) {
                    board[y][j] = board[y-1][j]
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
function dropPiece(){
    let now = Date.now()
    let delta = now - startDrop
    if(delta > 1000){
        piece.moveDown()
        startDrop = Date.now()
    }
    if(!gameOver) requestAnimationFrame(dropPiece)
}

// điều khiển mảnh xếp
document.addEventListener("keydown",CONTROL)
function CONTROL(event){
    if(event.keyCode == 37){
        piece.moveLeft()
        startDrop = Date.now()
    }else if(event.keyCode == 38){
        piece.rotato()
        startDrop = Date.now()
    }
    else if(event.keyCode == 39){
        piece.moveRight()
        startDrop = Date.now()
    }else{
        piece.moveDown()
    }
}

dropPiece()