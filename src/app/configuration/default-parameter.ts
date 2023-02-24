export type AppCalibrationParameters = {
    channelA: number,
    channelB: number,
    channelC: number,
    energyA: number,
    energyB: number,
    energyC: number,
    ratioA: number,
    ratioB: number,
};

export type AppParameters = {
    autoReset: boolean,
    UDL: number,
    DDL: number,
    averaging: number,
} & AppCalibrationParameters;

export const defaultParameters: AppParameters = {
    autoReset: false,
    UDL: 4094,
    DDL: 0,
    averaging: 1,
    channelA: 0,
    channelB: 4094,
    channelC: 1,
    energyA: 0,
    energyB: 4094,
    energyC: 1,
    ratioA: 1,
    ratioB: 0,
}