const MODULE_ID = "lancer-timesup-integrator";

Hooks.once("init", () => {
    console.log(`${MODULE_ID} | Initialized`);
});

Hooks.on("combatTurnChange", (combat, previous, current) => {
    const previousCombatant = previous.combatantId
        ? combat.getEmbeddedDocument("Combatant", previous.combatantId)
        : null;

    const currentCombatant = current.combatantId
        ? combat.getEmbeddedDocument("Combatant", current.combatantId)
        : null;

    const previousName = previousCombatant?.name ?? "None";
    const currentName = currentCombatant?.name ?? "None";

    console.log(
        `${MODULE_ID} | Turn changed: ${previousName} -> ${currentName}`,
        {
            combat,
            previous,
            current,
            previousCombatant,
            currentCombatant
        }
    );
});