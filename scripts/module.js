const MODULE_ID = "lancer-timesup-integrator";

Hooks.once("init", () => {
    console.log(`${MODULE_ID} | Initialized`);
});

Hooks.on("createActiveEffect", async (effect) => {
    if (!game.users.activeGM?.isSelf) return;

    const expiry = effect.getFlag(MODULE_ID, "expiry");
    if (expiry !== "sourceActivationEnd") return;

    const origin = effect.origin
        ? await fromUuid(effect.origin)
        : null;

    const sourceActor =
        origin?.documentName === "Actor"
            ? origin
            : origin?.actor ?? null;

    if (!sourceActor) return;

    const combat = game.combat;
    if (!combat) return;

    const sourceCombatant = combat.combatants.find(
        combatant => combatant.actor?.id === sourceActor.id
    );

    if (!sourceCombatant) return;

    const activationCount =
        sourceCombatant.getFlag(MODULE_ID, "activationCount") ?? 0;

    await effect.setFlag(
        MODULE_ID,
        "startActivationCount",
        activationCount
    );

    console.log(
        `${MODULE_ID} | Effect initialized`,
        {
            effect,
            sourceActor,
            sourceCombatant,
            startActivationCount: activationCount
        }
    );
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