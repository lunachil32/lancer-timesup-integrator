const MODULE_ID = "lancer-timesup-integrator";

Hooks.once("init", () => {
    console.log(`${MODULE_ID} | Initialized`);
});

Hooks.on("combatTurnChange", async (combat, previous, current) => {
    if (previous.combatantId === current.combatantId) return; // 変化がなければなにもしない ( ラウンドの変化などで発生する )

    const previousCombatant = combat.combatants.get(previous.combatantId) ?? null;
    const currentCombatant = combat.combatants.get(current.combatantId) ?? null;

    if (previousCombatant) {
        onActivationEnd(previousCombatant);
    }

    if (currentCombatant) {
        await onActivationStart(currentCombatant);
    }
});

async function onActivationStart(combatant) {
    if (!game.users.activeGM?.isSelf) return;
    const count = combatant.getFlag(MODULE_ID, "activationCount") ?? 0;

    await combatant.setFlag(
        MODULE_ID,
        "activationCount",
        count + 1
    );

    console.log(
        `${MODULE_ID} | Activation started: ${combatant.name} (${count + 1})`,
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