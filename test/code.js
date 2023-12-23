// Const declarations
const GREETING = 'Hello, ';

// Function declaration
function addNumbers(a, b) {
    return a + b;
}

// Class declaration with constructor and properties
class Rectangle {

    value = [1, 2, 3];

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    // Method to calculate area
    calculateArea() {
        return this.width * this.height;
    }
}

// Another class that extends Rectangle
class Square extends Rectangle {
    constructor(side) {
        // Call the constructor of the parent class (Rectangle)
        super(side, side);
    }

    // Method to calculate area (overrides the parent method)
    calculateArea() {
        console.log('Calculating area of a square');
        return super.calculateArea();
    }
}

// Function that uses const, class, and inheritance
function greetPerson(name) {
    const message = GREETING + name;
    console.log(message);
}

// Using the code
const sum = addNumbers(5, 7);
console.log('Sum:', sum);

const myRectangle = new Rectangle(4, 6);
const rectangleArea = myRectangle.calculateArea();
console.log('Rectangle Area:', rectangleArea);

const mySquare = new Square(5);
const squareArea = mySquare.calculateArea();
console.log('Square Area:', squareArea);

greetPerson('John');
