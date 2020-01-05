const behaviorsSets = new Map();

behaviorsSets.set("migratingColonies", [
    {
        radiusMax: 60.0,
        radiusMin: 40.1,
        visionAngle: -0.25,
        weight: 1.0,
        prototype: aggregateBehaviorPrototype
    },
    {
        radiusMax: 40.0,
        radiusMin: 20.1,
        visionAngle: -0.25,
        weight: 1.0,
        prototype: alignBehaviorPrototype
    },
    {
        radiusMax: 20.0,
        radiusMin: 0.0,
        visionAngle: -0.25,
        weight: 2.0,
        prototype: separateBehaviorPrototype
    }
]);

behaviorsSets.set("whirlingFishes", [
    {
        radiusMax: 50.0,
        radiusMin: 0.0,
        visionAngle: -0.25,
        weight: 1.0,
        prototype: aggregateBehaviorPrototype
    },
    {
        radiusMax: 11.0,
        radiusMin: 0.0,
        visionAngle: -0.25,
        weight: 3.6,
        prototype: separateBehaviorPrototype
    },
    {
        radiusMax: 9.6,
        radiusMin: 0.0,
        visionAngle: -0.25,
        weight: 3.6,
        prototype: alignBehaviorPrototype
    }
]);

function instanciateBehaviorsSet(behaviorsSets, setName) {
    behaviorSet= behaviorsSets.get(setName);

    const behaviors = behaviorSet.map(behavior => createBehavior(behavior.radiusMax, behavior.radiusMin, behavior.visionAngle, behavior.weight, behavior.prototype));

    return behaviors;
}