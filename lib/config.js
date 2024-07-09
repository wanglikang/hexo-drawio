"use strict";
function getConfig(hexo) {
    const drawioConfig = hexo.config.drawio || {};
    const isSkipOnFail = drawioConfig.isSkipOnFail || true;
    return {
        //暂时没有啥作用
        isSkipOnFail: isSkipOnFail
    };
}

module.exports = getConfig;
