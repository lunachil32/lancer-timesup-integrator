import { MODULE_ID, EXPIRY } from "./constants.js";
export async function createSourceActivationEndEffect({ sourceActor, targetActor, rounds = 1}) {
    if (!sourceActor || !targetActor) return;

    const [effect] = await targetActor.createEmbeddedDocuments(
        "ActiveEffect",
        [{
            name: `[Debug] sourceActivationEnd (${rounds}R)`,
            origin: sourceActor.uuid,
            duration: {
                rounds
            },
            flags: {
                [MODULE_ID]: {
                    expiry: "sourceActivationEnd"
                }
            }
        }]
    );

    return effect;
}