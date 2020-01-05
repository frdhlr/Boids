const emptyBoid = {
    position: undefined,
    velocity: undefined
}

const boidPrototype = {
    display: function()  {
        stroke(this.col);
        strokeWeight(this.size);
        point(this.position.x, this.position.y);
    },

    move: function() {
        let acceleration = createVector(0, 0);

        this.behaviorsBunches.forEach(behaviorsBunch => {
            acceleration.add(behaviorsBunch.getForce(this));
        });

        this.velocity.add(acceleration);
        this.position.add(this.velocity);

        this.boundPosition();
    },

    boundPosition: function() {
        if(this.position.x < 0) {
            this.position.x += width;
        }
        else if(this.position.x > width) {
            this.position.x -= width;
        }

        if(this.position.y < 0) {
            this.position.y += height;
        }
        else if(this.position.y > height) {
            this.position.y -= height;
        }
    }
}

function createBoidPrototype(maxSpeed, maxForce, size, col, behaviorsBunches) {
    const prototypeSettings = {
        maxSpeed:         maxSpeed,
        maxForce:         maxForce,
        size:             size,
        col:              col,
        behaviorsBunches: behaviorsBunches
    };

    return Object.assign(prototypeSettings, boidPrototype);
}

function createBoid(prototype) {
    const newBoid = Object.assign({}, emptyBoid);

    newBoid.position = createVector(random(width), random(height));
    newBoid.velocity = createVector(random(-2, 2), random(-2, 2));
    newBoid.color    = color;

    return Object.assign(Object.create(prototype), newBoid);
}