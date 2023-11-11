const canvas = document.getElementById('dividers');
const ctx = canvas.getContext('2d');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', 30);

class Symbol {
    constructor(x, y, fontSize, canvasHeight) {
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = '';
        this.canvasHeight = canvasHeight;
    }
    draw(context) {
        this.text = 'スパイシーカリフォルニアロール'.charAt(Math.floor(Math.random() * 'スパイシーカリフォルニアロール'.length));
        context.fillText(this.text, this.x * this.fontSize, (this.y + 1) * this.fontSize); 
    }
}

class Effect {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = 25;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
    #initialize() {
        for (let i = 0; i < this.columns; i++) {
            this.symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight);
        }
    }
    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
}

const effect = new Effect(canvas.width, canvas.height);
let lastTime = 0;
const fps = 15;
const nextFrame = 1000 / fps;
let timer = 0;

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (timer > nextFrame) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = effect.fontSize + 'px monospace';
        effect.symbols.forEach((symbol) => symbol.draw(ctx));
        timer = 0;
    } else {
        timer += deltaTime;
    }

    requestAnimationFrame(animate);
}
animate(0);

window.addEventListener('resize', function () {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', 30);
    effect.resize(canvas.width, canvas.height);
    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.4, 'green');
    gradient.addColorStop(0.6, 'cyan');
    gradient.addColorStop(1, 'magenta');
});
