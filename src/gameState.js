import { modFox, modScene} from "./ui";
import { SCENES, RAIN_CHANCE } from "./constants";

const gameState = {
    current: "INIT",
    clock: 1,
    wakeTime: -1,
    tick() {
        this.clock++;
        // console.log(`this is the clock ${this.clock}`)
        // console.log(`this is wake ${this.wakeTime}`)
        
        if (this.clock === this.wakeTime) {
            this.wake();
        }

        return this.clock
    },
    startGame() {
        console.log("hatching");
        this.current = "HATCHING";
        this.wakeTime = this.clock + 3;
        modFox("egg");
        modScene("day");
    },
    wake() {
        console.log("hatched");
        this.current = "IDLING";
        this.wakeTime = -1;
        modFox("idling");
        this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
        modScene(SCENES[this.scene]);
    },
    handleUserAction(icon) {
        if (["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)) {
            return;
        }

        if (this.current === "INIT" || this.current === "DEAD") {
            this.startGame();
            return;
        }

        switch(icon){
            case "weather":
                this.changeWeather();
                break;
            case "poop":
                this.cleanUpPoop();
                break;
            case "fish":
                this.feed();
                break;
        }
    },
    changeWeather() {
        console.log("changeWeather")
    },
    cleanUpPoop() {
        console.log("cleanUpPoop")
    },
    feed() {
        console.log("feed")
    }
}

export const handleUserAction = gameState.handleUserAction.bind(gameState);

export default gameState;
