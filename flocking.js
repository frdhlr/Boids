const fishes = [];
const sharks = [];
const whales = [];
const nbFishes = 900;
const nbSharks = 5;
const nbWhales = 0;

function setup() {
    createCanvas(1500, 750);

    const fishAggregateWithSharks = createBehavior(50.0, 0.0, -0.25, 0.5, aggregateBehaviorPrototype);
    const fishSeparateFromSharks  = createBehavior(30.0, 0.0, -0.90, 5.0, separateBehaviorPrototype);
    const fishAlignWithSharks     = createBehavior(80.0, 0.0, -0.90, 1.0, alignBehaviorPrototype);
    const fishSeparateFromWhales  = createBehavior(80.0, 0.0, 0.30, 2.0, separateBehaviorPrototype);
    const fishAlignWithWhales     = createBehavior(20.0, 0.0, 0.30, 1.0, alignBehaviorPrototype);

    const fishToFishesBehaviors = createBehaviorsBunch(fishes, instanciateBehaviorsSet(behaviorsSets, "whirlingFishes"));

    const fishToSharksBehaviors = createBehaviorsBunch(sharks, [fishSeparateFromSharks,
                                                                 fishAlignWithSharks]);

    const fishToWhalessBehaviors = createBehaviorsBunch(whales, [fishSeparateFromWhales,
                                                                 fishAlignWithWhales]);

    const fishBehaviorsBunches = [fishToFishesBehaviors,
                                  fishToSharksBehaviors,
                                  fishToWhalessBehaviors];

    const fishPrototype = createBoidPrototype(5.0, 0.5, 2, color(255, 255, 255), fishBehaviorsBunches);

    for(let i = 0; i < nbFishes; i++) {
        fishes.push(createBoid(fishPrototype));
    }

    const sharkAggregateWithFishes = createBehavior(100, 0.0, 0.1,  2.0, aggregateBehaviorPrototype);
    const sharkSeparateFromSharks  = createBehavior(20, 0.0, -0.25, 3.0, separateBehaviorPrototype);
    const sharkSeparateFromWhales  = createBehavior(80, 0.0, 0.1,  2.0, separateBehaviorPrototype);

    const sharkToFishesBehaviors  = createBehaviorsBunch(fishes, [sharkAggregateWithFishes]);
    const sharkToSharksBehaviors  = createBehaviorsBunch(sharks, [sharkSeparateFromSharks]);
    const sharkToWhalessBehaviors = createBehaviorsBunch(whales, [sharkSeparateFromWhales]);

    const sharkBehaviorsBunches = [sharkToFishesBehaviors,
                                   sharkToSharksBehaviors,
                                   sharkToWhalessBehaviors];

    const sharkPrototype = createBoidPrototype(5.5, 0.07, 5, color(255, 0, 0), sharkBehaviorsBunches);

    for(let i = 0; i < nbSharks; i++) {
        sharks.push(createBoid(sharkPrototype));
    }

    const whaleAggregateWithFishes = createBehavior(200, 0.0, -0.25, 1.0, aggregateBehaviorPrototype);
    const whaleSeparateFromWhales  = createBehavior(50, 0.0, -0.25, 2.5, separateBehaviorPrototype);

    const whaleToFishesBehaviors = createBehaviorsBunch(fishes, [whaleAggregateWithFishes]);
    const whaleToWhalesBehaviors = createBehaviorsBunch(whales, [whaleSeparateFromWhales]);

    const whaleBehaviorsBunches = [whaleToFishesBehaviors,
                                   whaleToWhalesBehaviors];

    const whalePrototype = createBoidPrototype(1.0, 0.02, 10, color(0, 100, 255), whaleBehaviorsBunches);

    for(let i = 0; i < nbWhales; i++) {
        whales.push(createBoid(whalePrototype));
    }

}

function draw() {
    background(0);

    // displayFeatures();

    fishes.forEach(fish => {
        fish.move();
    });

    sharks.forEach(shark => {
        shark.move();
    });

    whales.forEach(whale => {
        whale.move();
    });

    fishes.forEach(fish => {
        fish.display();
    });

    sharks.forEach(shark => {
        shark.display();
    });

    whales.forEach(whale => {
        whale.display();
    });
}

function mouseClicked() {
    fishes[0].behaviorsBunches.forEach(behaviorsBunch => {
        behaviorsBunch.behaviors.forEach(behavior => {
            const newRadiusMax   = random(10.0, 150.0);
            const newRadiusMin   = random(0.0, newRadiusMax);
            const newWeight      = random(0.5, 5.0);
            const newVisionAngle = random(-1.0, 1.0);

            behavior.setFeatures(newRadiusMax, newRadiusMin, newWeight, newVisionAngle);
        });
    });

    const newMaxSpeed = random(1.0, 5.0);
    const newMaxForce = random(0.01, 0.5);

    fishes[0].__proto__.maxSpeed = newMaxSpeed;
    fishes[0].__proto__.maxForce = newMaxForce;
}

function displayFeatures() {
    fill(255);
    noStroke();
    textSize(15);

    let offsetY = 0;

    text(`Max speed : ${fishes[0].__proto__.maxSpeed}`, 10, 15 + offsetY);
    text(`Max force : ${fishes[0].__proto__.maxForce}`, 10, 30 + offsetY);

    fishes[0].behaviorsBunches.forEach(behaviorsBunch => {
        behaviorsBunch.behaviors.forEach(behavior => {
            text(Object.keys({behavior})[0], 10, 60 + offsetY);

            text(`Radius max : ${behavior.radiusMax}`, 20, 75 + offsetY);
            text(`Radius min : ${behavior.radiusMin}`, 20, 90 + offsetY);
            text(`Weight : ${behavior.weight}`, 20, 105 + offsetY);
            text(`Vision angle : ${behavior.visionAngle}`, 20, 120 + offsetY);

            offsetY += 90;
        });
    });
}