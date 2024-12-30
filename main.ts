class ButtonDectector {
    onPressedFunction: (isA: boolean, isB: boolean) => void;
    onReleasedFunction: () => void;
    constructor(private pressed: boolean = false) { }
    onPressed(fct: (isA: boolean, isB: boolean) => void): ButtonDectector {
        this.onPressedFunction = fct;
        return this;
    }
    onReleased(fct: () => void): ButtonDectector {
        this.onReleasedFunction = fct;
        return this;
    }
    detect() {
        const isAPressed = input.buttonIsPressed(Button.A);
        const isBPressed = input.buttonIsPressed(Button.B);
        if (!this.pressed && (isAPressed || isBPressed)) {
            this.pressed = true
            this.onPressedFunction(isAPressed, isBPressed)
        } else {
            if (this.pressed && !isAPressed && !isBPressed) {
                this.pressed = false
                this.onReleasedFunction()
            }
        }
    }
}

class Projector{
    constructor(private color:number=0, private minBrightness: number = 40){
        input.onLogoEvent(TouchButtonEvent.Pressed, function () {
            this.minBrightness = (this.minBrightness + 20) % 255
        })
    }
    turnOn(isA: boolean, isB: boolean){
        if (isA && isB) {
            // Change color
            this.color = (this.color + 1) % colors.length
        } else {
            strip.setBrightness(isA ? 255 : this.minBrightness)
            strip.showColor(colors[this.color])
        }
    }
    turnOff(){
        strip.showColor(NeoPixelColors.Black)
    }
}

class RandomPoint{
    run(){
        const pos = randint(0, 31)
        const color = randint(0, colors.length - 1)
        strip.clear()
        strip.show()
        strip.range(pos, 1).showColor(colors[color])
        basic.pause(40)
    }
}

class MoveLines{
    constructor(private position: number = 0, 
    private previousPosition: number = 0, 
    private direction: number=1){}
    execute(){
        this.moveOnLine(0)
        this.moveOnLine(2)
        this.changePosition()
        basic.pause(20)
    }
    moveOnLine(line: number) {
        strip.range(line * 8 + this.previousPosition, 1).showColor(NeoPixelColors.Black)
        strip.range(line * 8 + this.position, 1).showColor(NeoPixelColors.Green)
    }
    changePosition() {
        this.previousPosition = this.position;
        let next = this.position + this.direction;
        if (next < 0 || next >= 8) {
            this.direction *= -1;
            next = this.position + this.direction
        }
        this.position = next
    }
}

let strip: neopixel.Strip = null
let red = 50
let blue = 50
let green = 50
led.enable(false)
strip = neopixel.create(DigitalPin.P3, 32, NeoPixelMode.RGB)
strip.setBrightness(30)
let line1 = strip.range(0, 8)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
// Light projector part
const colors = [
NeoPixelColors.Red,
NeoPixelColors.Orange,
NeoPixelColors.Yellow,
NeoPixelColors.Green,
NeoPixelColors.Blue,
NeoPixelColors.Indigo,
NeoPixelColors.Violet,
NeoPixelColors.Purple,
NeoPixelColors.White
]
const projector = new Projector();
const detector = new ButtonDectector().onPressed((a,b)=>projector.turnOn(a,b)).onReleased(()=>projector.turnOff());
const moves = new MoveLines();
const randPoint = new RandomPoint();
basic.forever(function () {
    // moveLines();
    //moves.execute();
    // detector.detect();
    randPoint.run();
})
