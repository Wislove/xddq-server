import Protocol from "#game/net/Protocol.js";
import logger from "#utils/logger.js";
import AdRewardMgr from "#game/mgr/AdRewardMgr.js";
import SystemUnlockMgr from "#game/mgr/SystemUnlockMgr.js";
import LoopMgr from "#game/common/LoopMgr.js";

export default class SpiritMgr {
    constructor() {
        this.AD_REWARD_DAILY_MAX_NUM = 2;   // 每日最大领取次数
        this.AD_REWARD_CD = 1000;           // 每次间隔时间
        this.isProcessing = false;
    }

    static get inst() {
        if (!SystemUnlockMgr.SPIRIT) {
            logger.warn(`[精怪管理] ${global.colors.red}系统未解锁${global.colors.reset}`);
            return null;
        }

        if (!this._instance) {
            this._instance = new SpiritMgr();
        }
        return this._instance;
    }

    reset() {
        this._instance = null;
    }

    clear() {
        LoopMgr.inst.remove(this);
    }

    checkReward(t) {
        this.isProcessing = true;
        this.getAdRewardTimes = t.spiritFreeAd.freeTimes || 0;
        this.lastAdRewardTime = t.spiritFreeAd.lastAdTime || 0;
        this.isProcessing = false;
    }

    processReward() {
        const now = Date.now();
        if (this.getAdRewardTimes < this.AD_REWARD_DAILY_MAX_NUM && now - this.lastAdRewardTime >= this.AD_REWARD_CD) {
            const logContent = `[精怪管理] 还剩 ${this.AD_REWARD_DAILY_MAX_NUM - this.getAdRewardTimes} 次广告激励`;
            AdRewardMgr.inst.AddAdRewardTask({ protoId: Protocol.S_SPIRIT_DRAW, data: { drawTimes: 1, isAd: true, isUseADTime: false }, logStr: logContent });
            this.getAdRewardTimes++;
            this.lastAdRewardTime = now;
        }
    }

    async loopUpdate() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            if (this.getAdRewardTimes >= this.AD_REWARD_DAILY_MAX_NUM) {
                this.clear();
                logger.info("[精怪管理] 达到每日最大领取次数，停止奖励领取");
            } else {
                this.processReward();
            }
        } catch (error) {
            logger.error(`[精怪管理] loopUpdate error: ${error}`);
        } finally {
            this.isProcessing = false;
        }
    }
}
