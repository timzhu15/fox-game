import game from "./gameState"
import initButtons from "./button";
import { TICK_RATE } from "./constants";

initButtons(game.handleUserAction);

async function init() {
    console.log("starting game");
    let nextTimeToTick = Date.now();
    function nextAnimationFrame() {
        const now = Date.now();
        if(nextTimeToTick <= now) {
            game.tick();
            nextTimeToTick = now + TICK_RATE;
        }
        requestAnimationFrame(nextAnimationFrame);
    }

    nextAnimationFrame();
}

init();
