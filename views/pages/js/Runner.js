const runnerBoard = document.getElementById("gameCanvas");
const runnerBoard_ctx = runnerBoard.getContext("2d");
const board_border = 'black';
const board_background = "white";


function clearCanvas(){
    runnerBoard_ctx.fillStyle = board_background;
    runnerBoard_ctx.strokeStyle = board_border;
    runnerBoard_ctx.fillRect(0, 0, runnerBoard.width, runnerBoard.height);
    runnerBoard_ctx.strokeRect(0, 0, runnerBoard.width, runnerBoard.height);
}


function main(){
    clearCanvas();
}


main();