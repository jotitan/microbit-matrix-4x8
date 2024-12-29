input.onButtonPressed(Button.A, function () {
    direction*=-1;
})

let line1: neopixel.Strip = null
let green = 0
let blue = 0
let red = 0
let direction = 1;
red = 50
blue = 50
green = 50
led.enable(false)
let strip = neopixel.create(DigitalPin.P3, 32, NeoPixelMode.RGB)
strip.setBrightness(30)
line1 = strip.range(0, 8)
strip.showColor(neopixel.colors(NeoPixelColors.Black))


let position = 0;
let previousPosition = 0;
basic.forever(function () {
    //moveLines();
    runDetect();
})

function moveLines(){
    moveOnLine(0)
    moveOnLine(2)
    changePosition();
    basic.pause(20);
}

function changePosition(){
    previousPosition = position;
    let next = position + direction;
    if(next < 0 || next >=8){
        direction*=-1;
        next = position + direction;
    }
    position = next
}

function moveOnLine(line: number){
    strip.range(line*8 + previousPosition, 1).showColor(NeoPixelColors.Black);
    strip.range(line * 8 + position, 1).showColor(NeoPixelColors.Green);    
}

/* Light projector part */

let minBrightness = 40;
let color = 0;
input.onLogoEvent(TouchButtonEvent.Pressed,()=>minBrightness = (minBrightness + 20) % 255);

const colors = [NeoPixelColors.Red,NeoPixelColors.Orange, NeoPixelColors.Yellow, NeoPixelColors.Green, NeoPixelColors.Blue, NeoPixelColors.Indigo, NeoPixelColors.Violet, NeoPixelColors.Purple, NeoPixelColors.White];

function turnOn(isA: boolean, isB: boolean){
    if(isA && isB){
        // Change color
        color = (color+1) % colors.length;
    }else{
        strip.setBrightness(isA ? 255 : minBrightness);
        strip.showColor(colors[color]);
    }
}

function turnOff() {
    strip.showColor(NeoPixelColors.Black);
}

const detector = getDetectPressed().onPressed(turnOn).onReleased(turnOff);

function runDetect(){
    detector.detect();
}

function getDetectPressed(){
    class ButtonDectector{
        onPressedFunction: (isA: boolean, isB: boolean) => void;
        onReleasedFunction: () => void;
        constructor(private pressed: boolean = false){}
        onPressed(fct: (isA: boolean, isB: boolean) => void): ButtonDectector {
            this.onPressedFunction = fct;
            return this;
        }
        onReleased(fct: () => void): ButtonDectector {
            this.onReleasedFunction = fct;
            return this;
        }
        detect(){
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
    return new ButtonDectector();
}