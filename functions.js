
/**
 * Utility class for common mathematical operations and angle conversions.
 */
class MathUtils {
    /**
     * Convert degrees to radians.
     * @param {number} degrees - The angle in degrees.
     * @returns {number} The angle in radians.
     */
    static degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

    /**
     * Convert radians to degrees.
     * @param {number} radians - The angle in radians.
     * @returns {number} The angle in degrees.
     */
    static radiansToDegrees(radians) {
        return (radians * 180) / Math.PI;
    }

    /**
     * Calculate angle (in degrees) from arc length and radius.
     * @param {number} radius - The radius of the arc.
     * @param {number} length - The length of the arc.
     * @returns {number} The angle in degrees.
     */
    static angleFromArcLength(radius, length) {
        return (length / radius) * (180 / Math.PI);
    }

    /**
     * Normalize an angle to the range [0, 360).
     * @param {number} angle - The angle to normalize.
     * @returns {number} The normalized angle.
     */
    static normalizeAngle(angle) {
        return (angle + 360) % 360;
    }

    /**
     * Convert polar coordinates to Cartesian coordinates.
     * @param {number} radius - The radius.
     * @param {number} angleInDegrees - The angle in degrees.
     * @returns {Vector} The Cartesian coordinates as a Vector.
     */
    static polarToCartesian(radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
        return new Vector(
            radius * Math.cos(angleInRadians),
            radius * Math.sin(angleInRadians)
        );
    }

    static normalizeAngle(angle) {
        return (angle + 360) % 360;
    }

    /**
     * Checks if an angle is between two other angles, considering wrapping and negative angles.
     * @param {number} angle - The angle to check (in degrees).
     * @param {number} startAngle - The start of the range (in degrees).
     * @param {number} endAngle - The end of the range (in degrees).
     * @returns {boolean} True if the angle is within the range, false otherwise.
     */
    static isAngleBetween(angle, startAngle, endAngle) {
        // Normalize angles to the range [0, 360)
        const normalizedAngle = MathUtils.normalizeAngle(angle);
        const normalizedStart = MathUtils.normalizeAngle(startAngle);
        const normalizedEnd = MathUtils.normalizeAngle(endAngle);

        // If the range doesn't cross 0
        if (normalizedStart <= normalizedEnd) {
            return normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd;
        }
        // If the range crosses 0
        return normalizedAngle >= normalizedStart || normalizedAngle <= normalizedEnd;
    }



    /**
     * Find the intersection points between a line and an arc.
     * @param {Vector} arcCenter - The center of the arc.
     * @param {number} r - The radius of the arc.
     * @param {number} arcStart - The start angle of the arc (in degrees).
     * @param {number} arcEnd - The end angle of the arc (in degrees).
     * @param {number} x0 - The x-coordinate of the vertical line.
     * @returns {Vector[]} An array of intersection points that lie on the arc.
     */
    static intersectionLineArcVertical(
        arcCenter,
        r,
        arcStart,
        arcEnd,
        x0 = 0,
    ) {
        const h = arcCenter.x;
        const k = arcCenter.y;

        const discriminant = r * r - (x0 - h) * (x0 - h);
        if (discriminant < 0) {
            return []; // No intersection
        }
        const sqrtD = Math.sqrt(discriminant);
        return MathUtils.getIntersectingArcs(new Vector(x0, k + sqrtD), new Vector(x0, k - sqrtD), arcCenter, arcStart, arcEnd);
    }


    /**
     * Find the intersection points between a line and an arc.
     * @param {Vector} arcCenter - The center of the arc.
     * @param {number} r - The radius of the arc.
     * @param {number} arcStart - The start angle of the arc (in degrees).
     * @param {number} arcEnd - The end angle of the arc (in degrees).
     * @param {number} y0 - The y-coordinate of the horizontal line.
     * @returns {Vector[]} An array of intersection points that lie on the arc.
     */
    static intersectionLineArcHorizontal(
        arcCenter,
        r,
        arcStart,
        arcEnd,
        isHorizontal = false,
        y0 = 0
    ) {
        const h = arcCenter.x;
        const k = arcCenter.y;

        // For a horizontal line, (y = y0),
        // circle eqn => (x - h)^2 + (y - k)^2 = r^2
        // Plug y0 in => (x - h)^2 + (y0 - k)^2 = r^2
        const term = r * r - (y0 - k) * (y0 - k);
        if (term < 0) {
            return []; // No intersection
        }
        const sqrtT = Math.sqrt(term);
        return MathUtils.getIntersectingArcs(new Vector(h + sqrtT, y0), new Vector(h - sqrtT, y0), arcCenter, arcStart, arcEnd);
    }


    /**
     * Find the intersection points between a line and an arc.
     * @param {Vector} arcCenter - The center of the arc.
     * @param {number} r - The radius of the arc.
     * @param {number} arcStart - The start angle of the arc (in degrees).
     * @param {number} arcEnd - The end angle of the arc (in degrees).
     * @param {number} m - The slope of the line (ignored if line is vertical or horizontal).
     * @param {number} c - The y-intercept of the line (ignored if line is vertical/horizontal).
     * @returns {Vector[]} An array of intersection points that lie on the arc.
     */
    static intersectionLineArcAngle(
        arcCenter,
        r,
        arcStart,
        arcEnd,
        m,
        c,
    ) {
        const h = arcCenter.x;
        const k = arcCenter.y;

        const A = 1 + m * m;
        const B = -2 * h + 2 * m * (c - k);
        const C = h * h + (c - k) * (c - k) - r * r;

        const discriminant = B * B - 4 * A * C;
        if (discriminant < 0) {
            return []; // No intersection
        }
        const sqrtDiscriminant = Math.sqrt(discriminant);

        const x1 = (-B + sqrtDiscriminant) / (2 * A);
        const x2 = (-B - sqrtDiscriminant) / (2 * A);

        return MathUtils.getIntersectingArcs(new Vector(x1, m * x1 + c), new Vector(x2, m * x2 + c), arcCenter, arcStart, arcEnd);
    }

    static getIntersectingArcs(p1, p2, arcCenter, arcStart, arcEnd) {
        const points = [];
        if (isWithinArc(p1)) points.push(p1);
        if (isWithinArc(p2)) points.push(p2);
        return points;

        // ---------------------------------------
        // Helper to check if a point is on the arc
        // ---------------------------------------
        function isWithinArc(pt) {
            // Convert point -> angle in degrees relative to arcCenter
            // Then check arcStart..arcEnd (accounting for angle wrap).
            const angle = pt.subtract(arcCenter).arg();
            return MathUtils.isAngleBetween(angle, arcStart, arcEnd);
        }
    }

}

/**
 * Represents a 2D vector with basic vector operations.
 */
class Vector {
    /**
     * Construct a Vector.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Create a vector from polar coordinates
    static fromPolar(magnitude, angleInDegrees) {
        const angleInRadians = MathUtils.degreesToRadians(angleInDegrees);
        return new Vector(
            magnitude * Math.cos(angleInRadians),
            magnitude * Math.sin(angleInRadians)
        );
    }

    /**
     * Add another vector to this vector.
     * @param {Vector} vector - The vector to add.
     * @returns {Vector} The resulting vector.
     */
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /**
     * Subtract another vector from this vector.
     * @param {Vector} vector - The vector to subtract.
     * @returns {Vector} The resulting vector.
     */
    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    /**
     * Scale this vector by a scalar.
     * @param {number} scalar - The scalar to multiply by.
     * @returns {Vector} The scaled vector.
     */
    scale(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    /**
     * Calculate the magnitude (length) of the vector.
     * @returns {number} The magnitude of the vector.
     */
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * Calculate the angle (argument) of the vector in degrees.
     * @returns {number} The angle in degrees.
     */
    arg() {
        return Math.atan2(this.y, this.x) * (180 / Math.PI);
    }

    /**
     * Convert the vector to a string representation.
     * @returns {string} The string representation of the vector.
     */
    toString() {
        return `Vector(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

    /**
     * Rotate this vector by the given angle (in degrees) around the origin (0,0).
     * @param {number} angleInDegrees - The angle to rotate by (in degrees).
     * @returns {Vector} A new Vector that is the result of the rotation.
     */
    rotate(angleInDegrees) {
        const angleInRadians = (angleInDegrees * Math.PI) / 180;
        const cosA = Math.cos(angleInRadians);
        const sinA = Math.sin(angleInRadians);

        // Standard 2D rotation around the origin:
        // x' = x*cos(θ) - y*sin(θ)
        // y' = x*sin(θ) + y*cos(θ)
        const newX = this.x * cosA - this.y * sinA;
        const newY = this.x * sinA + this.y * cosA;

        return new Vector(newX, newY);
    }
}

/**
 * Utility class for exporting SVG.
 */
class ExportSvg {
    /**
     * Retrieve all CSS rules from the document.
     * @returns {string} The concatenated CSS rules.
     */
    static getAllCSS() {
        let cssRules = "";

        // Iterate through all stylesheets
        for (let i = 0; i < document.styleSheets.length; i++) {
            const sheet = document.styleSheets[i];
            if (sheet.href === null) { // Process only local stylesheets
                try {
                    // Check if the stylesheet is accessible
                    if (sheet.cssRules) {
                        for (let j = 0; j < sheet.cssRules.length; j++) {
                            cssRules += sheet.cssRules[j].cssText + "\n";
                        }
                    }
                } catch (e) {
                    console.warn("Unable to access stylesheet:", sheet.href, e);
                }
            }
        }

        return cssRules;
    }

    /**
     * Export the SVG content as a downloadable file.
     * @param {SVGElement} svg - The SVG element to export.
     */
    static export(svg) {
        // Clone the SVG to avoid modifying the original
        const clonedSvg = svg.cloneNode(true);

        // Add embedded CSS
        const defs = document.createElementNS(svgNs, "defs");
        const style = document.createElementNS(svgNs, "style");
        style.textContent = ExportSvg.getAllCSS();
        defs.appendChild(style);
        clonedSvg.insertBefore(defs, clonedSvg.firstChild);

        // Serialize the SVG
        const serializer = new XMLSerializer();
        const svgData = serializer.serializeToString(clonedSvg);

        // Create a blob and trigger download
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "bowl_saver.svg";
        link.click();

        URL.revokeObjectURL(url);
    }
}

class Cut {
    constructor(center, rotation, radius) {
        this.center = center;        // Vector
        this.rotation = rotation;    // number
        this.radius = radius;        // number
        this.svg_arc = null;
        this.wasSaved = false;
    }

    clone() {
        return new Cut(this.center, this.rotation, this.radius);
    }
}


function throttle(callback, limit) {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            callback(...args);
        }
    };
}

let animationFrame;
function throttleToFrame(callback) {
    if (!animationFrame) {
        animationFrame = requestAnimationFrame(() => {
            callback();
            animationFrame = null;
        });
    }
}

function evtToMouseCoords(e, svg) {
    let point2D;
    if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0]; // Get the first touch point
        point2D = new DOMPointReadOnly(touch.clientX, touch.clientY);
    } else if (e.clientX !== undefined && e.clientY !== undefined) {
        point2D = new DOMPointReadOnly(e.clientX, e.clientY);
    }
    const pt = point2D.matrixTransform(svg.getScreenCTM().inverse());
    return new Vector(pt.x, pt.y);
}

class Draggable {
    constructor(element, svgRoot, options) {
        this.element = element;
        this.svgRoot = svgRoot;
        this.isDragging = false;

        this.onDragStart = options.onDragStart || (() => { });
        this.onDrag = options.onDrag || (() => { });
        this.onDragEnd = options.onDragEnd || (() => { });

        this.addEventListeners();
    }

    addEventListeners() {
        const events = [
            { event: "mousedown", handler: this.startDrag.bind(this) },
            { event: "touchstart", handler: this.startDrag.bind(this) },
            { event: "mousemove", handler: this.performDrag.bind(this) },
            { event: "touchmove", handler: this.performDrag.bind(this) },
            { event: "mouseup", handler: this.endDrag.bind(this) },
            { event: "touchend", handler: this.endDrag.bind(this) },
        ];
        events.forEach(({ event, handler }) => {
            this.element.addEventListener(event, handler);
        });
    }

    startDrag(e) {
        this.isDragging = true;
        this.onDragStart(this.getCoords(e));
    }

    performDrag(e) {
        if (this.isDragging) {
            e.preventDefault();
            this.onDrag(this.getCoords(e));
        }
    }

    endDrag(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.onDragEnd(this.getCoords(e));
        }
    }

    getCoords(e) {
        return evtToMouseCoords(e, this.svgRoot);
    }
}

function showValidationError(input, message) {
    const errorSpan = document.createElement("span");
    errorSpan.textContent = message;
    errorSpan.style.color = "red";
    input.parentNode.appendChild(errorSpan);
}


const svgNs = "http://www.w3.org/2000/svg";

const cutterKerf = 10;
const tailstockFixArcRadius = 175;
const tailstockFixArcDegrees = MathUtils.angleFromArcLength(tailstockFixArcRadius, 115);
const cutterArcDegrees = 90;
const DEFAULT_CUTTER_POSITION = new Vector(150, 20);
const GRID_STEP = 50;

class SVGElement {
    constructor(type, klass, attributes = {}) {
        this.element = document.createElementNS(svgNs, type);
        this.setAttributes({ class: klass });
        this.setAttributes(attributes);
    }

    setAttributes(attributes) {
        Object.keys(attributes).forEach((key) => {
            this.element.setAttribute(key, attributes[key]);
        });
    }

    appendTo(parent) {
        parent.appendChild(this.element);
    }

    appendTitle(text) {
        var title = document.createElementNS(svgNs, 'title');
        title.textContent = text;
        this.element.appendChild(title);
    }

    setTransform(translation, rotation) {
        const { x, y } = translation;
        this.setAttributes({ transform: `translate(${x},${y}) rotate(${rotation})` });
    }

}

class Group extends SVGElement {
    constructor(parent, klass) {
        super("g", klass);
        this.appendTo(parent);
    }
}

class Dimension extends Group {
    constructor(parent, dy = 0) {
        super(parent, "dimension");

        this.line = new SVGElement("line", "dim-line");
        this.text = new SVGElement("text", "dim-text");
        this.textBg = new SVGElement("rect", "dim-bg");

        this.line.appendTo(this.element);
        this.textBg.appendTo(this.element);
        this.text.appendTo(this.element);

        this.dy = dy;
    }

    setVisible(isVisible) {
        this.setAttributes({ visibility: isVisible ? "visible" : "hidden" });
    }

    /**
     * @param {Vector} start
     * @param {Vector} dir
     */
    update(start, dir) {
        const length = dir.magnitude();
        const angle = dir.arg();
        this.line.setAttributes({
            x1: 0,
            y1: 0,
            x2: length,
            y2: 0
        });
        let text_bb = this.text.element.getBBox();
        let yoff = this.dy ? this.dy : (text_bb.width < (0.6 * length) ? 0 : text_bb.height);

        this.text.setAttributes({
            x: length / 2,
            y: yoff,
        });
        text_bb = this.text.element.getBBox();
        this.textBg.setAttributes({
            x: text_bb.x,
            y: text_bb.y,
            width: text_bb.width,
            height: text_bb.height,
        });
        this.text.element.textContent = `${length.toFixed(0)} mm`;

        this.setTransform(start, angle);
    }
}

class Circle extends SVGElement {
    constructor(parent, klass, radius) {
        super("circle", klass);
        this.appendTo(parent);
        this.setRadius(radius);
    }

    setRadius(radius) {
        this.setAttributes({ r: radius });
    }
}

/**
* Represents an SVG-based button (using a <g> with <rect> and <text>).
*/
class SVGButton extends SVGElement {
    /**
     * @param {SVGElement} parent - The parent DOM element to append this button to.
     * @param {string} label - The text label on the button.
     * @param {Vector} position - Where to place the button in the SVG coordinate system.
     * @param {object} [options] - Optional callbacks or sizing.
     *   @param {number} [options.width=80]  - The width of the button in SVG units.
     *   @param {number} [options.height=30] - The height of the button in SVG units.
     *   @param {function} [options.onClick] - Called on button click.
     *   @param {function} [options.onHover] - Called on mouseenter/mouseover.
     *   @param {function} [options.onLeave] - Called on mouseleave/mouseout.
     */
    constructor(parent, label, position, options = {}) {
        super("g", "svg-button"); // Creates <g class="svg-button">
        this.appendTo(parent);

        // Default sizes or use provided
        const width = options.width || 80;
        const height = options.height || 30;
        const onClick = options.onClick || null;
        const onHover = options.onHover || null;
        const onLeave = options.onLeave || null;

        // Button rect
        this.rect = new SVGElement("rect", "svg-button-rect", {
            x: 0,
            y: 0,
            rx: 5,
            ry: 5,
            width: width,
            height: height,
            fill: "#007bff",       // A "Bootstrap-ish" blue
            stroke: "#0056b3",     // Darker border
            "stroke-width": 2,
            style: "cursor: pointer;"
        });
        this.rect.appendTo(this.element);

        // Text label
        this.text = new SVGElement("text", "svg-button-text", {
            x: width / 2,
            y: height / 2,
            fill: "#ffffff",
            "text-anchor": "middle",
            "alignment-baseline": "middle",
            style: "cursor: pointer; font-family: sans-serif; font-size: 14px;"
        });
        this.text.element.textContent = label;
        this.text.appendTo(this.element);

        // Position the entire <g> at (position.x, position.y)
        this.setTransform(position, 0);

        // Attach event listeners
        if (onClick) {
            // We attach the listener on the entire <g> so rect and text both respond
            this.element.addEventListener("click", (evt) => {
                onClick(evt);
            });
        }
        if (onHover) {
            this.element.addEventListener("mouseover", (evt) => {
                onHover(evt);
            });
            this.element.addEventListener("mouseenter", (evt) => {
                onHover(evt);
            });
        }
        if (onLeave) {
            this.element.addEventListener("mouseout", (evt) => {
                onLeave(evt);
            });
            this.element.addEventListener("mouseleave", (evt) => {
                onLeave(evt);
            });
        }
    }

    /**
     * Change the button label text.
     * @param {string} newLabel - The new label to display.
     */
    setLabel(newLabel) {
        this.text.element.textContent = newLabel;
    }

    /**
     * Change the button color style.
     * @param {string} fill - The new fill color for the button background.
     * @param {string} stroke - The new stroke color for the button border.
     */
    setColor(fill, stroke) {
        this.rect.setAttributes({
            fill: fill,
            stroke: stroke
        });
    }
}

class Arc extends SVGElement {
    constructor(parent, klass, radius, arcAngle, inherentRotation) {
        super("path", klass);
        this.appendTo(parent);

        this.arcAngle = arcAngle;
        this.inherentRotation = inherentRotation;
        this.setRadius(radius);
    }

    setRadius(radius) {
        this.setAttributes({ d: this.generateArcPath(radius) });
    }

    generateArcPath(radius) {
        let startAngle = this.inherentRotation;
        let endAngle = startAngle + this.arcAngle;

        const start = Vector.fromPolar(radius, endAngle);
        const end = Vector.fromPolar(radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    }
}

class CutArc extends SVGElement {
    constructor(parent, klass, cut, workpieceRect) {
        super("g", "");
        this.appendTo(parent);

        this.arc = new SVGElement("path", klass);
        this.arc.appendTo(this.element);

        this.breakLine = new SVGElement('path', "breakline");
        this.breakLine.appendTo(this.element);

        this.cut = cut;
        this.workpieceRect = workpieceRect;
        this.updatePath();
    }

    updatePath() {
        const startAngle = 90; // or depends on how your arcs are oriented
        const endAngle = 90 + 90; // e.g. 90 degrees wide
        const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;

        const start = Vector.fromPolar(this.cut.radius, endAngle);
        const end = Vector.fromPolar(this.cut.radius, startAngle);

        const start_rot = start.rotate(this.cut.rotation);
        const end_rot = end.rotate(this.cut.rotation);

        this.breakLine.setAttributes({
            "d": `M ${start.x} -1000 L ${start_rot.x} ${start_rot.y}`
        });

        this.arc.setAttributes({
            "d": `M ${start_rot.x} ${start_rot.y} A ${this.cut.radius} ${this.cut.radius} 0 ${largeArcFlag} 0 ${end_rot.x} ${end_rot.y}`
        });

        this.setAttributes({
            transform: `translate(${this.cut.center.x}, ${this.cut.center.y}) `
        })
    }
}

class Workpiece extends SVGElement {
    constructor(svg, width, height) {

        super("rect", "workpiece");
        this.appendTo(svg);

        this.x = 0;
        this.width = width;
        this.height = height;

        this.appendTitle("Workpiece");

        this.widthDim = new Dimension(svg, -20);
        this.heightDim = new Dimension(svg, -20);

        this.resize(width, height)
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.setAttributes({
            y: -this.height / 2,
            x: 0,
            width: this.width, height: this.height
        });

        this.widthDim.update(new Vector(this.x, -this.height / 2), new Vector(this.width, 0));
        this.heightDim.update(new Vector(this.x, this.height / 2), new Vector(0, -this.height));
    }
}


class BowlSaverPlate extends SVGElement {
    constructor(parent) {
        super("path", "plate", {
            d: "M -10 -10 L -11 140 L 0 140 C 95 139 153 128 156 -10",
        });
        this.appendTo(parent);
        this.appendTitle("Bowl saver plate");
    }
}

class Tailstock extends SVGElement {
    constructor(parent) {
        super("path", "tailstock", {
            d: "M 0 0 L 20 -20 L 170 -20 L 170 20 L 20 20 Z"
        });
        this.appendTo(parent);
        this.appendTitle("Tailstock");
    }
}

class CutterAssembly {

    constructor(parent, cutterRadius, currentCut) {
        this.center = new Vector(0, 0);
        this.rotationAngle = 0; // Initial rotation angle
        this.cutterRadius = cutterRadius;
        this.currentCut = currentCut;
        this.workpieceDim = new Vector();

        this.group = new Group(parent, "assembly");

        this.plate = new BowlSaverPlate(this.group.element);
        let plateDragOffset;
        this.plateDraggable = new Draggable(this.plate.element, parent, {
            onDragStart: (pos) => {
                plateDragOffset = pos.subtract(this.center);
            }, onDrag: (pos) => {
                const center = pos.subtract(plateDragOffset);
                this.moveTo(center);
            }
        })
        this.tailstock = new Tailstock(parent);

        this.centerMarker = new Circle(this.group.element, "center-marker", 5);
        this.handle = new Circle(this.group.element, "handle", 10);
        this.handle.setTransform(new Vector(140, 0), 0);
        this.handle.appendTitle("drag to rotate plate");
        this.handleDraggable = new Draggable(this.handle.element, parent, {
            onDrag: (pos) => {
                this.rotate(pos.subtract(this.center).arg());
            }
        })

        this.cutterArc = new Arc(this.group.element,
            "cutter-arc",
            cutterRadius,
            cutterArcDegrees,
            90);
        this.cutterArc.appendTitle("Cutter cut line");

        this.tailstockFixArc = new Arc(this.group.element,
            "tailstock-arc",
            tailstockFixArcRadius,
            tailstockFixArcDegrees,
            - tailstockFixArcDegrees / 2);
        this.tailstockFixArc.appendTitle("Tailstock morse taper sliding range")

        this.restDim = new Dimension(parent);
        this.offCenterDim = new Dimension(parent);
        this.distDim = new Dimension(parent);
        this.entryPointDim = new Dimension(parent);
    }

    setWorkpieceDim(dim) {
        this.workpieceDim = dim;
    }

    setRadius(radius) {
        this.cutterRadius = radius;
        this.cutterArc.setRadius(radius);
        this.currentCut.radius = radius;
        this.currentCut.svg_arc.updatePath();
    }

    moveTo(pos) {
        this.center = pos;
        this.currentCut.center = pos;
        this.currentCut.svg_arc.updatePath();

        this.group.setTransform(pos, this.rotationAngle);
        this.tailstock.setTransform(new Vector(pos.x + 180, 0), 0);

        if (pos.y < 0) {
            this.offCenterDim.update(new Vector(pos.x, 0), new Vector(0, pos.y));
        }
        else {
            this.offCenterDim.update(new Vector(pos.x, pos.y), new Vector(0, -pos.y));
        }

        this.restDim.update(
            new Vector(0, pos.y),
            new Vector(pos.x - this.cutterRadius - cutterKerf / 2, 0));
        this.distDim.update(
            new Vector(this.workpieceDim.x, pos.y),
            new Vector(pos.x - this.workpieceDim.x, 0));

        const mostLeft = pos.x - this.cutterRadius;
        const dimVis = mostLeft > 0 && mostLeft < this.workpieceDim.x;
        this.restDim.setVisible(dimVis);
        this.distDim.setVisible(dimVis);
        this.offCenterDim.setVisible(Math.abs(pos.y) > 1);
        this.checkTailstockArc();
        this.updateEntryPointDim();
    }

    rotate(angle) {
        this.rotationAngle = angle % 360;
        this.group.setTransform(this.center, this.rotationAngle);
        this.checkTailstockArc();
        this.currentCut.rotation = angle;
        this.currentCut.svg_arc.updatePath();
    }

    checkTailstockArc() {
        const startAngle = this.tailstockFixArc.inherentRotation + this.rotationAngle;
        const endAngle = startAngle + this.tailstockFixArc.arcAngle;

        const intersections = MathUtils.intersectionLineArcHorizontal(
            this.center,
            tailstockFixArcRadius,
            startAngle,
            endAngle,
            0, // y0
        );

        const hasIntersections = intersections.length > 0;
        this.tailstockFixArc.element.classList.toggle("has-intersections", hasIntersections);
    }

    updateEntryPointDim() {
        const startAngle = this.cutterArc.inherentRotation + this.rotationAngle;
        const endAngle = startAngle + this.cutterArc.arcAngle;

        const intersections = MathUtils.intersectionLineArcVertical(
            this.center,
            this.cutterRadius + cutterKerf / 2,
            startAngle,
            endAngle,
            this.workpieceDim.x // x0
        );

        let showDim = false;
        if (intersections.length == 1) {
            const intersectPoint = intersections[0];
            const dy = this.workpieceDim.y / 2 - intersectPoint.y;
            if (dy > 0 && dy < this.workpieceDim.y / 2) {
                this.entryPointDim.update(intersectPoint,
                    new Vector(0, dy));
                showDim = true;
            }
        }
        this.entryPointDim.setVisible(showDim);
    }
}


class Drawing extends SVGElement {
    constructor(svg) {
        super("svg", "root", {
            width: "100%",
            height: "100%",
            viewBox: "-40 -200 700 400",
            xmlns: svgNs
        })
        document.getElementById("svg-container").appendChild(this.element);

        this.cuts = [];
        this.currentCut = new Cut(new Vector(0, 0), 0, 0);

        this.defs = this.makeSvgDefs();
        this.makeCutClipPath();
        this.makeArrowHeadDefs();
        this.makeGridLines();

        this.workpiece = new Workpiece(this.element, 50, 50, 80, 300);

        this.cutGroup = new Group(this.element, "");
        this.cutGroup.setAttributes({ "clip-path": "url(#workpiece-clip)" })
        this.cutGroup.setAttributes({ "id": "stored-cuts" });
        this.cutGroupMirror = new SVGElement("use", "", { "href": "#stored-cuts", "transform": "scale(1,-1)" })
        this.cutGroupMirror.appendTo(this.element);

        this.storedCuts = new Group(this.cutGroup.element, "stored-cuts");

        this.currentCutArc = new CutArc(this.cutGroup.element, "current-cut-arc", this.currentCut, this.workpiece);
        this.currentCut.svg_arc = this.currentCutArc;

        this.cutterAssembly = new CutterAssembly(this.element, 120, this.currentCut);

        this.addCutButton = new SVGButton(
            this.element,           // parent: the main <svg> or a <g> in it
            "Add Cut",            // label
            new Vector(-100, 0),   // position
            {
                width: 100,
                height: 40,
                onClick: (evt) => {
                    drawing.addCurrentCut();
                },
            }
        );


        // Center Line
        const centerLine = new SVGElement("line", "centerline", {
            x1: -1000,
            y1: 0,
            x2: 1000,
            y2: 0
        });
        centerLine.appendTo(this.element);
    }

    makeSvgDefs() {
        // Create a <defs> element for markers
        const defs = document.createElementNS(svgNs, "defs");
        this.element.appendChild(defs);
        return defs;
    }

    makeCutClipPath() {
        const cp = document.createElementNS(svgNs, "clipPath");
        cp.setAttribute("id", "workpiece-clip");

        const cr = document.createElementNS(svgNs, "rect");
        cr.setAttribute("id", "workpiece-clip-rect");
        cr.setAttribute("x", 0);
        cr.setAttribute("y", 0);
        cr.setAttribute("width", 100);
        cr.setAttribute("height", 100);

        cp.appendChild(cr);
        this.defs.appendChild(cp);
    }

    makeArrowHeadDefs() {
        // Define the arrowhead marker
        const markerStart = document.createElementNS(svgNs, "marker");
        markerStart.setAttribute("id", "arrow");
        markerStart.setAttribute("markerWidth", "10");
        markerStart.setAttribute("markerHeight", "10");
        markerStart.setAttribute("refX", "10");
        markerStart.setAttribute("refY", "5.5");
        markerStart.setAttribute("orient", "auto-start-reverse");
        markerStart.setAttribute("markerUnits", "strokeWidth");

        // Define the arrowhead shape
        const arrowPathStart = document.createElementNS(svgNs, "path");
        arrowPathStart.setAttribute("d", "M 4 3 L 10 5 L 4 8 z");
        arrowPathStart.setAttribute("fill", "black");
        markerStart.appendChild(arrowPathStart);

        // Add the marker to <defs>
        this.defs.appendChild(markerStart);
    }

    makeGridLines(step = GRID_STEP) {
        const { width, height } = this.element.viewBox.baseVal;
        const range = Math.max(width, height) / step;


        const createLine = (isHorizontal, value) => {
            const attributes = isHorizontal
                ? { x1: -1000, y1: value, x2: 1000, y2: value }
                : { x1: value, y1: -1000, x2: value, y2: 1000 };
            new SVGElement("line", "grid-line", attributes).appendTo(this.element);
        };

        for (let i = -range; i <= range; i++) {
            createLine(true, i * step); // Horizontal lines
            createLine(false, i * step); // Vertical lines
        }
    }

    // Function to update shapes based on form input
    updateShapes() {
        const workpieceDiameter = parseFloat(document.getElementById("diameter").value);
        const workpieceHeight = parseFloat(document.getElementById("height").value);
        const cutterDiameter = parseFloat(document.getElementById("cutter").value);

        if (isNaN(workpieceDiameter) || workpieceDiameter <= 0 || isNaN(workpieceHeight) || workpieceHeight <= 0 || isNaN(cutterDiameter) || cutterDiameter <= 0) {
            showValidationError(document.getElementById("diameter"), "Please enter valid values for diameter, height, and cutter size.");
            return;
        }

        // calculate viewbox
        const viewBoxHeight = workpieceDiameter + 100;
        this.setAttributes({ "viewBox": `-40, ${- viewBoxHeight / 2}, ${workpieceHeight + 300}, ${viewBoxHeight}` });

        this.addCutButton.setTransform(new Vector(workpieceHeight + 50, -120), 0);

        // Update workpiece dimensions
        this.workpiece.resize(workpieceHeight, workpieceDiameter);

        // Update cutter assembly
        this.cutterAssembly.setWorkpieceDim(new Vector(workpieceHeight, workpieceDiameter));
        this.cutterAssembly.setRadius(cutterDiameter / 2)
        this.cutterAssembly.moveTo(DEFAULT_CUTTER_POSITION);

        this.currentCut.radius = cutterDiameter / 2;
        this.currentCut.center = DEFAULT_CUTTER_POSITION;
        this.currentCut.rotation = 0;

        const clip = document.getElementById("workpiece-clip-rect");
        clip.setAttribute("x", 0);
        clip.setAttribute("y", 0);
        clip.setAttribute("width", workpieceHeight);
        clip.setAttribute("height", workpieceDiameter / 2);
    }

    exportSvg() {
        ExportSvg.export(this.element);
    }

    addCurrentCut() {
        this.cuts.push(this.currentCut.clone());
        this.currentCut.wasSaved = false;
        this.renderCutShapes();
    }

    // Position the cutterAssembly to the chosen cut
    selectCut(index) {
        const cut = this.cuts[index];
        this.cuts.splice(index, 1);
        if (this.currentCut.wasSaved) {
            // modified a saved cut, save it again
            this.cuts.push(this.currentCut.clone());
        }
        // must modify existing object because multiple hold refernce to currentCut
        this.currentCut.center = cut.center;
        this.currentCut.radius = cut.radius;
        this.currentCut.rotation = cut.rotation;
        this.currentCut.wasSaved = true;
        this.cutterAssembly.moveTo(cut.center);
        this.cutterAssembly.rotate(cut.rotation);
        this.cutterAssembly.setRadius(cut.radius);
        this.renderCutShapes();
    }

    // Remove old arcs and draw new ones
    renderCutShapes() {
        const existingCutArcs = this.element.querySelectorAll(".cut-arc-group");
        existingCutArcs.forEach(arc => arc.remove());

        this.cuts.forEach((cut, idx) => {
            let e = new CutArc(this.storedCuts.element, "cut-arc", cut, this.workpiece);
            e.element.classList.add("cut-arc-group");
            e.element.addEventListener("click", (evt) => {
                this.selectCut(idx);
            });
        });
    }

}



