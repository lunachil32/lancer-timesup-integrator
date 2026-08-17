const MODULE_ID = "lancer-timesup-integrator";

Hooks.once("init", () => {
    console.log(`${MODULE_ID} | Initialized`);
});

Hooks.on("combatTurnChange", (combat, previous, current) => {
    if (previous.combatantId === current.combatantId) return; // 変化がなければなにもしない ( ラウンドの変化などで発生する )

    const previousCombatant = combat.combatants.get(previous.combatantId) ?? null;
    const currentCombatant = combat.combatants.get(current.combatantId) ?? null;

    if (previousCombatant) {
        onActivationEnd(previousCombatant);
    }

    if (currentCombatant) {
        onActivationStart(currentCombatant);
    }
});

function onActivationStart(combatant) {
    const combatantName = combatant?.name ?? "None";
    console.log(
        `${MODULE_ID} | Activation started: ${combatantName}`,
        combatant
    );
}

function onActivationEnd(combatant) {
    const combatantName = combatant?.name ?? "None";
    console.log(
        `${MODULE_ID} | Activation ended: ${combatantName}`,
        combatant
    );
}