import { IJsBridgeConfig, IJsBridgeMessagePayload, IOptionsWithDebugLogger } from 'cross-inpage-provider-types';
import { JsBridgeBase } from 'cross-inpage-provider-core';
declare function getOrCreateExtInjectedJsBridge(options?: IJsBridgeConfig): JsBridgeBase;
export type ISetupPostMessageListenerOptions = IOptionsWithDebugLogger & {
    bridge?: JsBridgeBase;
};
declare class JsBridgeExtInjected extends JsBridgeBase {
    constructor(config: IJsBridgeConfig);
    sendAsString: boolean;
    isInjected: boolean;
    sendPayload(payloadObj: IJsBridgeMessagePayload | string): void;
}
export { JsBridgeExtInjected, getOrCreateExtInjectedJsBridge };
