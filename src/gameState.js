import { modFox, modScene} from "./ui";
import { SCENES, RAIN_CHANCE, DAY_LENGTH, NIGHT_LENGTH, getNextHugerTime, getNextDieTime, getNextPoopTime } from "./constants";

const gameState = {
    current: "INIT",
    clock: 1,
    wakeTime: -1,
    sleepTime: -1,
    hungryTime: -1,
    dieTime: -1,
    timeToStartCelebrating: -1,
    timeToEndCelebrating: -1,
    tick() {
        this.clock++;
        // console.log(`this is the clock ${this.clock}`)
        // console.log(`this is wake ${this.wakeTime}`)
        
        if (this.clock === this.wakeTime) {
            this.wake();
        } else if (this.clock === this.sleepTime) {
            this.sleep();
        } else if (this.clock === this.hungryTime) {
            this.getHungry();
        } else if (this.clock === this.dieTime) {
            this.die();
        } else if (this.clock === this.timeToStartCelebrating) {
            this.startCelebrating();
        } else if (this.clock === this.timeToEndCelebrating) {
            this.endCelebrating();
        }

        return this.clock;
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
        this.determineFoxState();

        this.sleepTime = this.clock + DAY_LENGTH;
        this.hungryTime = getNextHugerTime(this.clock);
    },
    sleep() {
        this.state = "SLEEP";
        modFox("sleep");
        modScene("night");
        this.wakeTime = this.clock + NIGHT_LENGTH;
    },
    getHungry() {
        this.current = "HUNGRY";
        this.dieTime - getNextDieTime(this.clock);
        this.hungryTime = -1;
        modFox("hungry");
    },
    die() {
        console.log("die");
    },
    feed() {
        if (this.current !== "HUNGRY"){
            return;
        }

        this.current = "FEEDING";
        this.dieTime = -1;
        this.poopTime = getNextPoopTime(this.clock);
        this.timeToStartCelebrating = this.clock + 2;
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
        this.scene = (1 + this.scene) % SCENES.length;
        modScene(SCENES[this.scene]);
        this.determineFoxState();
    },
    cleanUpPoop() {
        console.log("cleanUpPoop")
    },
    startCelebrating() {
        this.current = "CELEBRATING";
        modFox("celebrate");
        this.timeToStartCelebrating = -1;
        this.timeToEndCelebrating = this.clock + 2;
    },
    endCelebrating() {
        this.timeToEndCelebrating = -1;
        this.current = "IDLING";
        this.determineFoxState();
    },
    determineFoxState() {
        if (this.current === "IDLING") {
            if (SCENES[this.scene] === "rain") {
                modFox("rain");
            } else {
                modFox("idling");
            }
        }
    }
}

export const handleUserAction = gameState.handleUserAction.bind(gameState);

export default gameState;
