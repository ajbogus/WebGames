const runnerBoard = document.getElementById("gameCanvas");
const runnerBoard_ctx = runnerBoard.getContext("2d");
const board_border = 'black';
const board_background = "white";
const ground_color = "brown";
const player_color = "blue";
const player_border = "beige";
const press_play_color = "orange";


const ground_height = 15;
const player_width = 20;
const player_height = 20; 


class Player{
    constructor (width, height, color, border){
        this.width = width;
        this.height = height;
        this.color = color;
        this.border = border;
        this.x = 0;
        this.y = 0;
        this.falling = false;
    }


    draw(x, y){
        if(this.falling){
            if(this.y > runnerBoard.height - ground_height - this.height){
                this.falling = false;
                this.draw(x,runnerBoard.height - ground_height - this.height);
                return;
            }
            this.y = y + 10;
        }
        else{
            this.y = y;
        }
        this.x = x;
        runnerBoard_ctx.fillStyle = this.color;
        runnerBoard_ctx.strokeStyle = this.border;
        runnerBoard_ctx.fillRect(x, y, this.width, this.height);
        runnerBoard_ctx.strokeRect(x, y, this.width, this.height);
    }


    jump(){
        this.y = this.y - 40;
        this.falling = true;
    }
}


function clearCanvas(){
    runnerBoard_ctx.fillStyle = board_background;
    runnerBoard_ctx.strokeStyle = board_border;
    runnerBoard_ctx.fillRect(0, 0, runnerBoard.width, runnerBoard.height);
    runnerBoard_ctx.strokeRect(0, 0, runnerBoard.width, runnerBoard.height);
    drawGround();
}


function spaceToPlay(){
    runnerBoard_ctx.font = "64px tahoma";
    runnerBoard_ctx.fillStyle = press_play_color;
    runnerBoard_ctx.textAlign = "center";
    runnerBoard_ctx.fillText("Press Space To Play", runnerBoard.width / 2, 80);
}


function drawGround(){
    runnerBoard_ctx.fillStyle = ground_color;
    runnerBoard_ctx.strokeStyle = board_border;
    runnerBoard_ctx.fillRect(0, runnerBoard.height - ground_height, runnerBoard.width, ground_height);
    runnerBoard_ctx.strokeRect(0, runnerBoard.height - ground_height, runnerBoard.width, ground_height);
}


function startGame(){
    console.log("wth");
    clearCanvas();
    drawGround();
    // draw dude at bottom left corner of screen
    const player = new Player(player_width, player_height, player_color, player_border);
    player.draw(100, runnerBoard.height - player.height - ground_height);

    //start interval for game updating (moving game starts now)
    interval = setInterval(function(){
        clearCanvas();
        player.draw(player.x, player.y);
        document.body.onkeyup = function(e) {
            if (e.key == " " || e.code == "Space"){
                player.jump();
            }
            if (e.key == "q"){
                clearInterval(interval);
            }
        }
    }, 50);
}


function main(){
    var counter = 0;
    interval = setInterval(function(){
        console.log("here");
        clearCanvas();
        if (counter % 2 == 0){
            spaceToPlay();
        }
        document.body.onkeyup = function(e) {
            if (e.key == " " || e.code == "Space"){
                clearInterval(interval);
                startGame();
            }
        }
        counter++;
    }, 800);
}


main();