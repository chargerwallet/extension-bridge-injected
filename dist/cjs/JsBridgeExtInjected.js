"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateExtInjectedJsBridge = exports.JsBridgeExtInjected = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const cross_inpage_provider_core_1 = require("cross-inpage-provider-core");
const cross_inpage_provider_core_2 = require("cross-inpage-provider-core");
const { JS_BRIDGE_MESSAGE_DIRECTION, JS_BRIDGE_MESSAGE_EXT_CHANNEL } = cross_inpage_provider_core_1.consts;
function getOrCreateExtInjectedJsBridge(options = {}) {
    // create ext bridge by default
    const bridgeCreator = () => new JsBridgeExtInjected(Object.assign(Object.assign({}, options), { receiveHandler: cross_inpage_provider_core_2.injectedProviderReceiveHandler }));
    const bridge = (0, cross_inpage_provider_core_2.injectJsBridge)(bridgeCreator);
    return bridge;
}
exports.getOrCreateExtInjectedJsBridge = getOrCreateExtInjectedJsBridge;
let postMessageListenerAdded = false;
function setupPostMessageListener(options = {}) {
    const debugLogger = options.debugLogger || cross_inpage_provider_core_1.fakeDebugLogger;
    if (postMessageListenerAdded) {
        return;
    }
    postMessageListenerAdded = true;
    // - receive
    // #### content-script -> injected
    window.addEventListener('message', (event) => {
        var _a, _b;
        // We only accept messages from ourselves
        if (event.source !== window) {
            return;
        }
        const eventData = event.data;
        // only accept extension messages
        if (eventData.channel === JS_BRIDGE_MESSAGE_EXT_CHANNEL &&
            eventData.direction === JS_BRIDGE_MESSAGE_DIRECTION.HOST_TO_INPAGE) {
            debugLogger.extInjected('onWindowPostMessage', eventData);
            const payload = eventData.payload;
            const jsBridge = (_a = options.bridge) !== null && _a !== void 0 ? _a : (_b = window === null || window === void 0 ? void 0 : window.$chargerwallet) === null || _b === void 0 ? void 0 : _b.jsBridge;
            if (jsBridge) {
                jsBridge.receive(payload);
            }
        }
    }, false);
}
class JsBridgeExtInjected extends cross_inpage_provider_core_2.JsBridgeBase {
    constructor(config) {
        super(config);
        this.sendAsString = false;
        this.isInjected = true;
        // receive message
        setupPostMessageListener({
            debugLogger: this.debugLogger,
            bridge: this,
        });
    }
    // send message
    sendPayload(payloadObj) {
        window.postMessage({
            channel: JS_BRIDGE_MESSAGE_EXT_CHANNEL,
            direction: JS_BRIDGE_MESSAGE_DIRECTION.INPAGE_TO_HOST,
            payload: payloadObj,
        });
    }
}
exports.JsBridgeExtInjected = JsBridgeExtInjected;
