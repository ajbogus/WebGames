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
            this.y = y + 15;
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
        this.y = this.y - 200;
        this.falling = true;
    }
}


class Obstacles{
    constructor(obstacles){
        this.obstacles = [];
        for (let i = 0; i  < obstacles.length; i++){
            this.obstacles[i] = new Obstacle(obstacles[i].width, obstacles[i].height, obstacles[i].x, obstacles[i].y, obstacles[i].color, obstacles[i].border, obstacles[i].speed);
        }
    }
    
    draw(){
        console.log("drawing");
        for (let i = 0; i < this.obstacles.length; i++){
            this.obstacles[i].x = this.obstacles[i].x - this.obstacles[i].speed;
            this.obstacles[i].draw(this.obstacles[i].x, this.obstacles[i].y);
        }
    }
}

class Obstacle{
    constructor(width, height, x, y, color, border, speed){
        this.width = width;
        this.height = height;
        this.color = color;
        this.border = border;
        this.speed = speed;
        this.x = x;
        this.y = y;
    }

    draw(x,y){
        this.x = x;
        this.y = y;
        runnerBoard_ctx.fillStyle = this.color;
        runnerBoard_ctx.strokeStyle = this.border;
        runnerBoard_ctx.fillRect(this.x, this.y, this.width, this.height);
        runnerBoard_ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

//levels
const ground_green_square = new Obstacle(14, 14, 1000, runnerBoard.height - ground_height - 14, "green", "black", 10);
const ground_green_rect = new Obstacle(14, 20, 1200, runnerBoard.height - ground_height - 20, "green", "black", 10);
const floating_grey_rect = new Obstacle(14, 20, 1200, runnerBoard.height - ground_height - 50, "grey", "black", 10);
const finish_line = new Obstacle(40, 800, 1300, runnerBoard.height - ground_height - 800, "pink", "black", 10);
const level_one_obstacles = [ground_green_square, ground_green_rect, finish_line, floating_grey_rect];
const level_two_obstacles = [floating_grey_rect, ground_green_rect, finish_line];
const level_three_obstacles = [floating_grey_rect, finish_line];

const level_obstacles = [level_one_obstacles, level_two_obstacles, level_three_obstacles];



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


function drawLevel(level){
    runnerBoard_ctx.font = "24px tahoma";
    runnerBoard_ctx.fillStyle = ground_color;
    runnerBoard_ctx.fillText("Level " + level, 40, 25);
}


function collided(p, obs){
    console.log("in collided with obslength = " + obs.obstacles.length);
    for (let i = 0; i < obs.obstacles.length; i++){
        let o = obs.obstacles[i];
        console.log("here");
        if (
            ((p.y + p.height) < (o.y)) ||
            (p.y > (o.y + o.height)) ||
            ((p.x + p.width) < o.x) ||
            (p.x > (o.x + o.width))
        ){
            continue;
        }
        else {
            return true;
        }
    }
    return false;
    
}


function failedLevel(){
    clearCanvas();
    runnerBoard_ctx.font = "64px tahoma";
    runnerBoard_ctx.fillStyle = press_play_color;
    runnerBoard_ctx.textAlign = "center";
    runnerBoard_ctx.fillText("YOU LOST!!!", runnerBoard.width / 2, 80);
}


function passedLevel(){
    let counter = 0;
    runnerBoard_ctx.font = "64px tahoma";
    runnerBoard_ctx.fillStyle = press_play_color;
    runnerBoard_ctx.textAlign = "center";
    return new Promise((resolve, reject) => {
        interval = setInterval(function(){
            console.log("passedflash");
            clearCanvas();
            if (counter % 2 == 0){
                runnerBoard_ctx.fillText("LEVEL COMPLETE", runnerBoard.width / 2, 80);
            }
            if (counter > 5){
                    clearInterval(interval);
                    resolve();
            }    
            counter++;
        }, 400);
        clearCanvas();
    });
    

}


function startLevel(level){
    // draw dude at bottom left corner of screen
    const player = new Player(player_width, player_height, player_color, player_border);
    player.draw(100, runnerBoard.height - player.height - ground_height);
    const obs = new Obstacles(level_obstacles[level]);
    
    return new Promise((resolve, reject) =>{
        //start interval for game updating (moving game starts now)
        interval = setInterval(function(){
            clearCanvas();
            drawLevel(level + 1);
            player.draw(player.x, player.y);
            obs.draw();
            document.body.onkeyup = function(e) {
                if (e.key == " " || e.code == "Space"){
                    player.jump();
                }
                if (e.key == "q"){
                    clearInterval(interval);
                    resolve("quit");
                }
            }
            if (collided(player, obs)){
                // Hit finish line
                if (player.x + player.width >= obs.obstacles[obs.obstacles.length-1].x){
                    console.log("passed");
                    clearInterval(interval);
                    resolve("passed");
                }
                // Hit obstacle and therefore lost ho
                else{
                    console.log("failed");
                    clearInterval(interval);
                    failedLevel();
                    resolve("failed");
                }
                
                clearInterval(interval);
                resolve("passed");
            }
        }, 50);
    });
    
}

async function startGame(){
    clearCanvas();
    drawGround();

    //loop through levels and see if the player passed or failed the levels
    for(let i = 0; i < level_obstacles.length; i++){
        const outcome = await startLevel(i);
        if(outcome == "failed"){
            break;
        }
        if(outcome == "passed"){
            console.log("passed that ho");
            const ready_for_next_level = await passedLevel();
        }
    }
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