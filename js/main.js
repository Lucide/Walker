let type = "WebGL";
if (PIXI.utils.isWebGLSupported())
    type = "WebGL";
else
    type = "canvas";
PIXI.utils.sayHello(type);
class Slider {
    constructor(pSlider, onChange, descr = "slider", pDescription = null) {
        this.pSlider = pSlider.getElementsByTagName("input")[0];
        this.pValue = pSlider.getElementsByTagName("span")[0];
        this.description = descr;
        this.onChange = (value = null) => {
            if (value != null) {
                this.pSlider.valueAsNumber = value;
                this.pValue.innerText = value + "";
            }
            else {
                this.pValue.innerText = this.pSlider.value;
                onChange(this.pSlider.valueAsNumber);
            }
        };
        this.pSlider.addEventListener("change", () => this.onChange());
        if (pDescription) {
            pSlider.addEventListener("mouseenter", () => {
                pDescription.innerText = this.description;
            });
        }
    }
}
class Combo {
    constructor(pCombo, onChange, onAdd, onRemove) {
        this.pCombo = pCombo.getElementsByTagName("select")[0];
        this.pAdd = pCombo.getElementsByTagName("button")[0];
        this.pRemove = pCombo.getElementsByTagName("button")[1];
        this.selectedIndex = () => this.pCombo.selectedIndex;
        this.onChange = (options = null) => {
            if (options != null) {
                for (let i = this.pCombo.length - 1; i > -1; i--) {
                    this.pCombo.options.remove(0);
                }
                for (; options > 0; options--) {
                    let t = document.createElement("option");
                    t.innerText = (this.pCombo.length + 1) + "";
                    this.pCombo.options.add(t);
                }
                this.pCombo.selectedIndex = (0);
            }
            if (options == null || options > 0) {
                onChange(this.pCombo.selectedIndex);
            }
        };
        this.onAdd = () => {
            let t = document.createElement("option");
            t.innerText = (this.pCombo.length + 1) + "";
            this.pCombo.options.add(t);
            this.pCombo.selectedIndex = (this.pCombo.length - 1);
            onAdd(this.pCombo.selectedIndex);
        };
        this.onRemove = () => {
            if (this.pCombo.length > 1) {
                let t = this.pCombo.selectedIndex;
                this.pCombo.options.remove(this.pCombo.selectedIndex);
                this.pCombo.selectedIndex = (t > 0 ? t - 1 : t);
                for (let i = t; i < this.pCombo.options.length; i++) {
                    this.pCombo.options[i].innerText = (i + 1) + "";
                }
                onRemove(t);
            }
        };
        this.pCombo.addEventListener("change", () => this.onChange());
        this.pAdd.addEventListener("click", this.onAdd);
        this.pRemove.addEventListener("click", this.onRemove);
    }
}
class Terrain {
    constructor(graphics, xMultiplier, options) {
        this.options = {
            simplify: (options.simplify ? options.simplify : 100),
            speed: (options.speed ? options.speed : 100),
            range: (options.range ? options.range : 100)
        };
        this.g = graphics;
        // this.r=on resize();
        this.step = -1;
        // this.progress=on tick();
        // this.base=on resize();
        // this.array=on resize();
        // this.k=on resize();
        // this.amount=on tick();
        // this.mouseY=on mouseListener();
        this.xMultiplier = xMultiplier;
    }
    tick() {
        this.step = ((this.step + 1) % this.options.speed);
        this.progress = this.step / this.options.speed;
        this.amount = this.progress * this.k;
        if (this.amount == 0) {
            this.array.shift();
            this.array.push(this.mouseY);
        }
    }
    draw() {
        let i = 0;
        this.g.moveTo(-this.amount, this.array[0]);
        for (i++; i < this.array.length; i++)
            this.g.lineTo(i * this.k - this.amount, this.array[i]);
        this.g.lineTo(this.r[0] + 1, this.mouseY);
    }
    drawPoints() {
        for (let x, i = 1; i < this.array.length; i++) {
            x = i * this.k - this.amount;
            this.g.moveTo(x, this.r[1]);
            this.g.lineTo(x, this.array[i]);
        }
    }
    drawBaseline() {
        this.g.moveTo(0, this.base + this.options.range);
        this.g.lineTo(this.r[0], this.base + this.options.range);
        this.g.moveTo(this.r[0], this.base);
        this.g.lineTo(0, this.base);
        this.g.moveTo(0, this.base - this.options.range);
        this.g.lineTo(this.r[0], this.base - this.options.range);
    }
    getSpeed() {
        return this.options.speed / this.k;
    }
    getYatX(x) {
        let p = this.progress + x / this.k, t = p % 1;
        if (p < this.array.length - 1) {
            return (1 - t) * this.array[p >> 0] + t * this.array[(p >> 0) + 1];
        }
        else {
            return (1 - t) * this.array[p >> 0] + t * this.mouseY;
        }
    }
    resizeListener(width, height) {
        this.r = [width, height];
        this.base = (this.r[1] * this.xMultiplier) >> 0;
        if (this.r[1] < (this.base + this.options.range + 5)) {
            this.base = this.r[1] - this.options.range - 5;
        }
        this.mouseY = this.base;
        this.array = Array(((this.r[0] / this.options.simplify) >> 0) + 1);
        this.k = this.r[0] / (this.array.length - 1);
        for (let i = 0; i < this.array.length; i++) {
            this.array[i] = this.base;
        }
    }
    mouseListener(e) {
        if (e.buttons == 1) {
            if (Math.abs(e.clientY - this.base) > this.options.range)
                this.mouseY = this.base + ((e.clientY - this.base < 0 ? -1 : 1) * this.options.range);
            else {
                this.mouseY = e.clientY;
            }
        }
    }
}
class RootPoint extends PIXI.Point {
    constructor(graphics, xMultiplier, options) {
        super(0, 0);
        this.options = {
            height: (options.height ? options.height : 100),
            endPoints: 0
        };
        this.g = graphics;
        this.spring = [-1, -1, 2, 0, 0];
        // this.groundY=on tick();
        this.endPoints = [];
        this.xMultiplier = xMultiplier;
    }
    addEndPoint(endPoint) {
        this.endPoints.push(endPoint);
        this.options.endPoints++;
    }
    removeEndPoint(index) {
        this.endPoints.splice(index, 1);
        this.options.endPoints--;
    }
    endPointAt(index) {
        return this.endPoints[index];
    }
    tick(terrainSpeed) {
        this.groundY = this.endPoints[0].y;
        for (let t of this.endPoints) {
            t.tick(terrainSpeed);
            if (t.y > this.groundY) {
                this.groundY = t.y;
            }
        }
        this.spring[4] = (this.spring[0] * (this.options.height - (this.groundY - this.y)) + this.spring[1] * this.spring[3]) / this.spring[2];
        this.spring[3] += this.spring[4] / 10;
        this.y += this.spring[3] / 10;
    }
    draw() {
        for (let t of this.endPoints) {
            t.draw(this.g);
        }
    }
    drawPoints(radius) {
        let a = Math.PI / 2, b = 7 / 6 * Math.PI, c = 11 / 6 * Math.PI;
        for (let t of this.endPoints) {
            t.drawPoints(this.g, a, b, c, radius);
        }
    }
    drawCircles() {
        for (let t of this.endPoints) {
            t.drawCircles(this.g);
        }
    }
    drawInterpolation() {
        for (let t of this.endPoints) {
            t.drawInterpolation(this.g);
        }
    }
    mouseListener(e) {
        for (let endPoint of this.endPoints) {
            endPoint.mouseListener(e);
        }
    }
    resizeListener(width, height) {
        this.x = width * this.xMultiplier;
    }
}
class EndPoint extends PIXI.Point {
    constructor(rootPoint, yAtX, options) {
        super(0, 0);
        this.options = {
            sizes: (options.sizes ? options.sizes : [200, 200]),
            strideLength: (options.strideLength ? options.strideLength : 100),
            strideHeight: (options.strideHeight ? options.strideHeight : 100),
            automatic: (options.automatic ? options.automatic : true)
        };
        // this.speed=on tick();
        this.step = -1;
        // this.progress=on tick();
        this.rootPoint = rootPoint;
        // this.jointPoint=on draw();
        this.yAtX = yAtX;
        // this.strideHeight=this.strideMinHeight;
        // this.groundY=on tick();
    }
    tick(terrainSpeed) {
        this.speed = terrainSpeed * this.options.strideLength;
        this.step = ((this.step + 1) % (this.speed * 2)) >> 0;
        this.progress = this.step / (this.speed * 2);
        if (this.options.automatic) {
            this.x = ((this.options.strideLength / this.speed) * (this.speed / 2 - Math.abs((this.step % (2 * this.speed)) - this.speed)) + this.rootPoint.x) >> 0;
        }
        this.groundY = this.yAtX(this.x) >> 0;
        if (this.options.automatic) {
            this.y = (Math.sin(Math.PI * this.progress * 2) * (-this.options.strideHeight) + this.groundY) >> 0;
        }
        if (this.y > this.groundY) {
            this.y = this.groundY;
        }
    }
    draw(g) {
        this.jointPoint = Solver.solve([this.rootPoint, this.options.sizes[0], this, this.options.sizes[1]])[1];
        g.moveTo(this.rootPoint.x, this.rootPoint.y);
        g.lineTo(this.jointPoint.x, this.jointPoint.y);
        g.lineTo(this.x, this.y);
    }
    drawPoints(g, a, b, c, radius) {
        g.moveTo((radius * Math.cos(a) + this.rootPoint.x) >> 0, (radius * Math.sin(a) + this.rootPoint.y) >> 0);
        g.lineTo((radius * Math.cos(b) + this.rootPoint.x) >> 0, (radius * Math.sin(b) + this.rootPoint.y) >> 0);
        g.lineTo((radius * Math.cos(c) + this.rootPoint.x) >> 0, (radius * Math.sin(c) + this.rootPoint.y) >> 0);
        g.moveTo((radius * Math.cos(a) + this.jointPoint.x) >> 0, (radius * Math.sin(a) + this.jointPoint.y) >> 0);
        g.lineTo((radius * Math.cos(b) + this.jointPoint.x) >> 0, (radius * Math.sin(b) + this.jointPoint.y) >> 0);
        g.lineTo((radius * Math.cos(c) + this.jointPoint.x) >> 0, (radius * Math.sin(c) + this.jointPoint.y) >> 0);
        g.moveTo((radius * Math.cos(a) + this.x) >> 0, (radius * Math.sin(a) + this.y) >> 0);
        g.lineTo((radius * Math.cos(b) + this.x) >> 0, (radius * Math.sin(b) + this.y) >> 0);
        g.lineTo((radius * Math.cos(c) + this.x) >> 0, (radius * Math.sin(c) + this.y) >> 0);
    }
    drawCircles(g) {
        g.drawCircle(this.rootPoint.x, this.rootPoint.y, this.options.sizes[0]);
        g.drawCircle(this.x, this.y, this.options.sizes[1]);
        g.drawCircle(this.rootPoint.x, this.rootPoint.y, this.options.sizes[0] + this.options.sizes[1]);
    }
    drawInterpolation(g) {
        g.moveTo(this.x, this.y);
        g.lineTo(this.x, this.groundY + 1);
    }
    mouseListener(e) {
        if (!this.options.automatic) {
            this.x = e.clientX;
            this.y = e.clientY;
        }
    }
}
class Solver {
    static solve(data) {
        let d = Math.sqrt(Math.pow(data[2].x - data[0].x, 2) + Math.pow(data[2].y - data[0].y, 2)), size;
        size = data[1] + data[3] - 1;
        if (d > size) {
            data[2].x -= data[0].x;
            data[2].y -= data[0].y;
            let radians = Math.atan2(data[2].y, data[2].x);
            data[2].x = Math.cos(radians) * size + data[0].x;
            data[2].y = Math.sin(radians) * size + data[0].y;
        }
        size = data[3] - data[1] + 1;
        if (size > 0) {
            if (d < size) {
                data[2].x -= data[0].x;
                data[2].y -= data[0].y;
                let radians = Math.atan2(data[2].y, data[2].x);
                data[2].x = Math.cos(radians) * size + data[0].x;
                data[2].y = Math.sin(radians) * size + data[0].y;
            }
        }
        size = data[1] - data[3] + 1;
        if (size > 0) {
            if (d < size) {
                data[2].x -= data[0].x;
                data[2].y -= data[0].y;
                let radians = Math.atan2(data[2].y, data[2].x);
                data[2].x = Math.cos(radians) * size + data[0].x;
                data[2].y = Math.sin(radians) * size + data[0].y;
            }
        }
        return [data[0], this.circleIntersection(data[0], data[1], data[2], data[3]), data[2]];
    }
    static circleIntersection(c1, d1, c2, d2) {
        if (d1 < 0 || d2 < 0)
            return;
        let d = Math.sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y));
        let a = (d1 * d1 + d * d - d2 * d2) / (2 * d);
        let b = Math.sqrt(d1 * d1 - a * a);
        return new PIXI.Point((c2.x - c1.x) * a / d + (c2.y - c1.y) * b / d + c1.x, (c2.y - c1.y) * a / d - (c2.x - c1.x) * b / d + c1.y);
    }
}
//an experiment
let rootPoints = {
    rootPoints: [],
    addRootPoint: function (rootPoint) {
        this.rootPoints.push(rootPoint);
        rootPoint.resizeListener(app.renderer.width, app.renderer.height);
    },
    removeRootPoint: function (index) {
        this.rootPoints.splice(index, 1);
    },
    rootPointAt: function (index) {
        return this.rootPoints[index];
    }
};
//Create a Pixi Application
let pMain = document.getElementsByTagName("main")[0], pCanvas = pMain.getElementsByTagName("canvas")[0], stats = new Stats(), app = new PIXI.Application({
    antialias: false,
    transparent: false,
    backgroundColor: 0x000000,
    resolution: 1,
    view: pCanvas,
    width: pCanvas.clientWidth,
    height: pCanvas.clientHeight
}), graphics = new PIXI.Graphics(), terrain = new Terrain(graphics, 1, {
    simplify: 200,
    speed: 50,
    range: 100
}), sSimplify = new Slider(document.getElementById("simplify"), () => {
    terrain.options.simplify = sSimplify.pSlider.valueAsNumber;
    terrain.resizeListener(app.renderer.width, app.renderer.height);
}), sSpeed = new Slider(document.getElementById("speed"), value => {
    terrain.options.speed = (terrain.options.simplify * (100 - value) / 100) >> 0;
}), sRange = new Slider(document.getElementById("range"), value => {
    terrain.options.range = value;
    terrain.resizeListener(app.renderer.width, app.renderer.height);
}), cRootPoint = new Combo(document.getElementById("rootPoint"), selectedIndex => {
    let t = rootPoints.rootPointAt(selectedIndex).options;
    sHeight.onChange(t.height);
    cEndPoint.onChange(t.endPoints);
}, () => {
    rootPoints.addRootPoint(new RootPoint(graphics, .5, { height: 100 }));
    cRootPoint.onChange();
    cEndPoint.onAdd();
}, selectedIndex => {
    rootPoints.removeRootPoint(selectedIndex);
    cRootPoint.onChange();
}), sHeight = new Slider(document.getElementById("height"), value => {
    rootPoints.rootPointAt(cRootPoint.selectedIndex()).options.height = value;
}), cEndPoint = new Combo(document.getElementById("endPoint"), selectedIndex => {
    let t = rootPoints.rootPointAt(cRootPoint.selectedIndex()).endPointAt(selectedIndex).options;
    sSizeA.onChange(t.sizes[0]);
    sSizeB.onChange(t.sizes[1]);
    sStrideLength.onChange(t.strideLength);
    sStrideHeight.onChange(t.strideHeight);
}, () => {
    let t = rootPoints.rootPointAt(cRootPoint.selectedIndex());
    t.addEndPoint(new EndPoint(t, x => terrain.getYatX(x), {
        sizes: [100, 100],
        strideLength: 100,
        strideHeight: 100,
        automatic: true
    }));
    cEndPoint.onChange();
}, selectedIndex => {
    rootPoints.rootPointAt(cRootPoint.selectedIndex()).removeEndPoint(selectedIndex);
    cEndPoint.onChange();
}), sSizeA = new Slider(document.getElementById("sizeA"), value => {
    rootPoints.rootPointAt(cRootPoint.selectedIndex()).endPointAt(cEndPoint.selectedIndex()).options.sizes[0] = value;
}), sSizeB = new Slider(document.getElementById("sizeB"), value => {
    rootPoints.rootPointAt(cRootPoint.selectedIndex()).endPointAt(cEndPoint.selectedIndex()).options.sizes[1] = value;
}), sStrideLength = new Slider(document.getElementById("strideLength"), value => {
    rootPoints.rootPointAt(cRootPoint.selectedIndex()).endPointAt(cEndPoint.selectedIndex()).options.strideLength = value;
}), sStrideHeight = new Slider(document.getElementById("strideHeight"), value => {
    rootPoints.rootPointAt(cRootPoint.selectedIndex()).endPointAt(cEndPoint.selectedIndex()).options.strideHeight = value;
});
stats.showPanel(0);
stats.dom.removeAttribute("style");
stats.dom.classList.add("fps");
pMain.appendChild(stats.dom);
app.stage.addChild(graphics);
terrain.resizeListener(app.renderer.width, app.renderer.height);
sSimplify.onChange(terrain.options.simplify);
sSpeed.onChange(terrain.options.speed);
sRange.onChange(terrain.options.range);
cRootPoint.onAdd();
app.ticker.add(gameLoop);
function gameLoop() {
    let i, sr = cRootPoint.selectedIndex(), se = cEndPoint.selectedIndex(), t;
    stats.begin();
    terrain.tick();
    let speed = terrain.getSpeed();
    for (t of rootPoints.rootPoints) {
        t.tick(speed);
    }
    graphics.clear();
    graphics.lineStyle(1, 0x22c0ff, .5);
    terrain.drawBaseline();
    terrain.drawPoints();
    for (t of rootPoints.rootPoints) {
        // t.drawCircles();
        t.drawInterpolation();
    }
    graphics.lineStyle(2, 0x23ff5e, 1);
    terrain.draw();
    i = 0;
    for (t of rootPoints.rootPoints) {
        if (i == sr) {
            graphics.lineStyle(3, 0x00fffa, 1);
        }
        else {
            graphics.lineStyle(3, 0xffd900, 1);
        }
        t.draw();
        i++;
    }
    graphics.lineStyle(0, 0, 1);
    graphics.beginFill(0xff3f3f, 1);
    for (t of rootPoints.rootPoints) {
        t.drawPoints(5);
    }
    graphics.endFill();
    stats.end();
}
///////////////////////////EVENTS///////////////////////////
pMain.addEventListener("mousemove", e => {
    terrain.mouseListener(e);
    for (let t of rootPoints.rootPoints) {
        t.mouseListener(e);
    }
});
window.addEventListener("resize", resizeListener);
function resizeListener() {
    app.renderer.resize(app.view.clientWidth, app.view.clientHeight);
    terrain.resizeListener(app.renderer.width, app.renderer.height);
    for (let t of rootPoints.rootPoints) {
        t.resizeListener(app.renderer.width, app.renderer.height);
    }
}
//# sourceMappingURL=main.js.map