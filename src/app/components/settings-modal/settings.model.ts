import { AppParameters } from "src/app/configuration/default-parameter";

export class SettingsModel {
    public data: AppParameters;
    constructor(
        autoReset: boolean,
        UDL: number,
        DDL: number,
        averaging: number,
        channelA: number,
        channelB: number,
        channelC: number,
        energyA: number,
        energyB: number,
        energyC: number,
        ratioA: number,
        ratioB: number
    ) {
        this.data = { autoReset, UDL, DDL, averaging, channelA, channelB, channelC, energyA, energyB, energyC, ratioA, ratioB };
     }
}