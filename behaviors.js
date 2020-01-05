const emptyBehavior = {
    radiusMax:    80,
    radiusMaxSq:  6400,
    radiusMin:    0,
    radiusMinSq:  0,
    visionAngle: -1.0,
    weight:       1.0
};

const behaviorPrototype = {
    setFeatures: function (newRadiusMax, newRadiusMin, newWeight, newVisionAngle) {
        this.radiusMax   = newRadiusMax;
        this.radiusMaxSq = newRadiusMax * newRadiusMax;
        this.radiusMin   = newRadiusMin;
        this.radiusMinSq = newRadiusMin * newRadiusMin;
        this.weight      = newWeight;
        this.visionAngle = newVisionAngle
    }
};

const aggregateBehaviorPrototype = {
    getDirection: function(object, vector, distanceSq, angle, directionBase) {
        directionBase.x = 0.0;
        directionBase.y = 0.0;

        if(distanceSq >= this.radiusMinSq && distanceSq <= this.radiusMaxSq && angle > this.visionAngle) {
            directionBase.add(vector);
        }

        return directionBase;
    }
};

const separateBehaviorPrototype = {
    getDirection: function(object, vector, distanceSq, angle, directionBase) {
        directionBase.x = 0.0;
        directionBase.y = 0.0;

        if(distanceSq >= this.radiusMinSq && distanceSq <= this.radiusMaxSq && angle > this.visionAngle) {
            directionBase.add(vector);
            directionBase.mult(-1.0);
            directionBase.normalize();
            directionBase.div(distanceSq);
        }

        return directionBase;
    }
};

const alignBehaviorPrototype = {
    getDirection: function(object, vector, distanceSq, angle, directionBase) {
        directionBase.x = 0.0;
        directionBase.y = 0.0;

        if(distanceSq >= this.radiusMinSq && distanceSq <= this.radiusMaxSq && angle > this.visionAngle) {
            directionBase.add(object.velocity);
            directionBase.div(distanceSq);
        }

        return directionBase;
    }
};

function createBehavior(radiusMax, radiusMin, visionAngle, weight, prototype) {
    const newBehavior = Object.assign({}, emptyBehavior);

    newBehavior.radiusMax      = radiusMax;
    newBehavior.radiusMaxSq    = radiusMax * radiusMax;
    newBehavior.radiusMin      = radiusMin;
    newBehavior.radiusMinSq    = radiusMin * radiusMin;
    newBehavior.visionAngle = visionAngle;
    newBehavior.weight      = weight;

    const newBehaviorPrototype = Object.assign({}, behaviorPrototype, prototype);

    return Object.assign(Object.create(newBehaviorPrototype), newBehavior);
};

const emptyBehaviorsBunch = {
    objectsToInteractWith: undefined,
    behaviors:             undefined,
    directions:            undefined,
    directionBase:         undefined
};

const behaviorsBunchPrototype = {
    getForce: function(interactingObject) {
        this.resetDirections();

        const objectAngle1 = interactingObject.velocity.copy().normalize();

        this.objectsToInteractWith.forEach(objectToInteractWith => {
            if(interactingObject !== objectToInteractWith) {
                const objectToObjectvector = p5.Vector.sub(objectToInteractWith.position, interactingObject.position);
                const objectsDistanceSq    = objectToObjectvector.magSq();
                const objectAngle2         = objectToObjectvector.copy().normalize();
                const objectToObjectAngle  = p5.Vector.dot(objectAngle1, objectAngle2)

                this.behaviors.forEach((behavior, index) => {
                    const direction = behavior.getDirection(objectToInteractWith, objectToObjectvector, objectsDistanceSq, objectToObjectAngle, this.directionBase)
                    this.directions[index].add(direction);
                });
            }
        });

        const forces = this.directions.map((direction, index) => this.getForceFromDirection(direction, interactingObject, this.behaviors[index]));

        const forcesSum = forces[0];

        for(let i = 1; i < forces.length; i++) {
            forcesSum.add(forces[i]);
        }

        return forcesSum;
    },

    resetDirections: function() {
        this.directions.forEach(direction => {
            direction.x = 0.0;
            direction.y = 0.0;
        })
    },

    getForceFromDirection: function(direction, object, behavior) {
        if(direction.magSq() > 0.0) {
            direction.normalize();
            direction.mult(object.maxSpeed);
            direction.sub(object.velocity);
            direction.limit(object.maxForce);
            direction.mult(behavior.weight);
        }

        return direction;
    }
};

function createBehaviorsBunch(objectsTointeractWith, behaviors) {
    const newBehaviorsBunch = Object.assign({}, emptyBehaviorsBunch);

    newBehaviorsBunch.objectsToInteractWith = objectsTointeractWith;
    newBehaviorsBunch.behaviors             = behaviors;
    newBehaviorsBunch.directions            = [];
    newBehaviorsBunch.directionBase         = createVector(0.0, 0.0);

    newBehaviorsBunch.behaviors.forEach(() => {
        newBehaviorsBunch.directions.push(createVector(0.0, 0.0));
    });

    return Object.assign(Object.create(behaviorsBunchPrototype), newBehaviorsBunch);
};

