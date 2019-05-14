const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.fillStyle = "#000";
context.fillRect(0, 0, canvas.width, canvas.height);

let myScore = 0;
const score = document.getElementById("score");
score.innerText = "score: " + myScore;

const player = {
    pos: {x: 0, y: 0},
    matrix: null
};

let arena = createMatrix(12, 20);
resetElement();


document.addEventListener("keydown", event => {
    if (event.keyCode === 40) {
        dropElement();
    }
    else if (event.keyCode === 37) {
        player.pos.x--;
         if (collision(arena, player))
            player.pos.x++
    }
    else if (event.keyCode === 39) {
        player.pos.x++;
        if (collision(arena, player)) {
            player.pos.x--;
        }
    }
    //q 
    else if (event.keyCode === 81) {
        rotate(player, -1);
        rotateCollision(1);
        
    }
    //w
    else if (event.keyCode === 87) {
        rotate(player, 1);
        rotateCollision(-1);
    }
});

function rotate(player, dir) {
   for (let y = 0; y < player.matrix.length; y++) {
       for (let x = 0; x < y; x++) {
           [player.matrix[y][x], player.matrix[x][y]] = [player.matrix[x][y], player.matrix[y][x]];
       }
   } 
   if ( dir > 1) {
        player.matrix.forEach((row) => {
            row.reverse();
        })  
   } else {
        player.matrix.reverse();
   }
  
}
function rotateCollision(div) {
  let position = player.pos.x;
  let offset = 1;
  while (collision(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
        rotate(player, div);
        player.pos.x = position;
        return;
    }    
  }
}

function createMatrix(w, h) {
    let myArray = [];
    for (let y = 0; y < h; y++) {
        myArray.push(new Array(w).fill(0));
    }
    return myArray;
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function resetElement() {
   player.pos.y = 0;
   const myTypes = "TOLJISZ"; 
   player.matrix = createElement(myTypes[Math.floor(Math.random() * 7)]);
   player.pos.x = Math.floor(arena[0].length / 2 - player.matrix[0].length / 2);
}

function createElement(type) {
    if (type === 'T')
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    else if (type === 'O')
        return [
            [2, 2],
            [2, 2]
        ];
    else if (type === 'L')
        return [
            [0, 3, 0],
            [0 ,3, 0],
            [0, 3, 3]
        ];
    else if (type === 'J')
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ];
    else if (type === 'I') 
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0]
        ];   
    else if (type === 'S') 
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ]; 
    else if (type === 'Z') 
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ];                    
}

function sweepMe (arena) {
    let numLines = 1;
    startLoop: for (let y = arena.length - 1; y > 0; y--) {
        for ( let x = 0; x < arena[y].length; x++) {
            if (arena[y][x] == 0) {
                continue startLoop;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        y++;
        arena.unshift(row);
        myScore += numLines * 10;
        numLines *= 2;
    }
   
}

function collision(arena, player) {
    
    for (let y = 0; y < player.matrix.length; y++) {
        for (let x = 0; x < player.matrix[y].length; x++) {
            if (player.matrix[y][x] !== 0 && (arena[y +player.pos.y] && arena[y + player.pos.y][x + player.pos.x]) != 0) {
                return true;
            }
        }
    }
    return false;
}
function dropElement() {
    player.pos.y++;
    counter = 0;
    
    if (collision(arena, player)) {
        if (player.pos.y == 1) {
            location.reload();
        }
        player.pos.y--;
        merge(arena, player);
        sweepMe(arena);
        resetElement();
    }

} 

const colors = [
    null,
    "red",
    "blue",
    "purple",
    "green",
    "orange",
    "lightblue",
    "yellow"
]

context.scale(20, 20);

function drawMatrix(matrix, position) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x+ position.x, y + position.y, 1, 1);
            }
        });
    });
}

function draw() {
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
    score.innerText = "score: " + myScore;
}

let start = 0;
let counter = 1;

function update(time = 0) {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const deltaTime = time - start;
    if (deltaTime > 1000) {
        counter = 0;
    }
    if (counter === 0) {
        dropElement();
        start = time;
        counter = 1;
    }
     
    draw();
    requestAnimationFrame(update);
}

update();