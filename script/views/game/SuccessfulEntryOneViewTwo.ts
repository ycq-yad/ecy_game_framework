import { MiniManeger } from "../../minigame/MiniManeger";
import SoundManager from "../../common/SoundManager";
import MoreGameOperRequest from "./MoreGameOperRequest";
import SuccessfulEntryThreeView from "./SuccessfulEntryThreeView";
import ViewChangeManager from "../../games/ViewChangeManager";
import { PlayerDataManager } from "../../common/GameDataManager";
import { GoodsType } from "../../games/CommonDefine";
import MoreGameOperRequestTwo from "./MoreGameOperRequestTwo";
import AnimationManager from "../../manager/AnimationManager";
import { GameData } from "../../common/GameData";
import PlatformDY from "../../../PlatformDY";
import WeCatMoreGameItemOne from "./WeCatMoreGameItemOne";

export default class SuccessfulEntryOneViewTwo extends BaseSceneUISkinPopView {

    public className_key = "SuccessfulEntryOneViewTwo";
    protected grp_center: Laya.Box;
    protected showEnterType: BasePopAnimationEnterType = BasePopAnimationEnterType.SCALE_MODE_BACK;


    public btLable: Laya.Sprite;
    public imageBtSign: Laya.Box;
    public lableAwardInfo: Laya.Label;
    public img_back: Laya.Image;

    public imageWeCatMoreGame: Laya.Image;
    public panelWeCatMoreGame: Laya.Panel;

    private bRecvAward: boolean;

    public aniReal: Laya.Skeleton;

    public boxAni: Laya.Box;

    constructor() {
        super();
        this.skin = "game/uiView/SuccessfulEntryOneViewTwo.json";
        this.bRecvAward = false;
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.grp_center.width = this.width;
        this.grp_center.height = this.height;
        // this.imageWeCatMoreGame.height = (this.height - this.imageWeCatMoreGame.y - (1920 - this.imageWeCatMoreGame.y - this.imageWeCatMoreGame.height));
        // this.panelWeCatMoreGame.height = this.imageWeCatMoreGame.height - 110;
    }

    onAddStage(): void {
        MiniManeger.instance.showBannerAd();
        this.initView();
        this.addEvent();
    }

    public onRemoved() {
        super.onRemoved();
        this.removeEvent();
        if (this.aniReal) {
            this.aniReal.stop();
        }
    }



    private initView() {

        this.initPanel();
        this.proceMoreGame();

        this.bRecvAward = false;
        this.btLable.visible = false;
        Laya.timer.once(3000, this, () => {
            this.btLable.visible = true;
        })
        if (DeviceUtil.isWXMiniGame()) {
            this.img_back.visible = true;
        } else {
            this.img_back.visible = false;
        }
        this.startGameAni();

        if (DeviceUtil.isWXMiniGame() || DeviceUtil.isTTMiniGame()) {
            this.imageWeCatMoreGame.visible = true;
        } else {
            this.imageWeCatMoreGame.visible = false;
            if (!this.aniReal) {
                this.createSkeleton("resource/assets/img/ani/tiaoyue/tiaoyue.sk");
            } else {
                this.aniReal.play(0, true);
            }
        }
    }

    private addEvent() {
        this.btLable.on(Laya.Event.CLICK, this, this.onNoThinks);
        this.imageBtSign.on(Laya.Event.CLICK, this, this.onWatchVideoRecvAward);
        this.img_back.on(Laya.Event.CLICK, this, this.onBack);
        if (DeviceUtil.isTTMiniGame()) {
            this.panelWeCatMoreGame.on(Laya.Event.CLICK, this, this.onShowMoreGame);
        }
    }

    private removeEvent() {
        this.btLable.off(Laya.Event.CLICK, this, this.onNoThinks);
        this.imageBtSign.off(Laya.Event.CLICK, this, this.onWatchVideoRecvAward);
        this.img_back.off(Laya.Event.CLICK, this, this.onBack);
        if (DeviceUtil.isTTMiniGame()) {
            this.panelWeCatMoreGame.off(Laya.Event.CLICK, this, this.onShowMoreGame);
        }
    }

    /**返回 */
    private onBack() {
        SoundManager.getInstance().playEffect("button", 1);
        MoreGameOperRequestTwo.bOperFlag = true;
        MoreGameOperRequestTwo.bSuccess = true;
        ViewManager.getInstance().showView(MoreGameOperRequestTwo);
        this.removeSelf();
    }

    /**不了谢谢 */
    private onNoThinks() {
        SoundManager.getInstance().playEffect("button", 1);
        if (DeviceUtil.isWXMiniGame()) {
            MoreGameOperRequest.bOperFlag = true;
            MoreGameOperRequest.bSuccess = true;
            ViewManager.getInstance().showView(MoreGameOperRequest);
        } else {
            //打开成功界面2
            ViewManager.getInstance().showView(SuccessfulEntryThreeView);
        }

        this.removeSelf();
    }

    /**领取奖励 */
    private onWatchVideoRecvAward() {
        SoundManager.getInstance().playEffect("button", 1);
        this.imageBtSign.off(Laya.Event.CLICK, this, this.onWatchVideoRecvAward);
        let self = this;

        if (ViewChangeManager.getInstance().CurLevelBase) {
            ViewChangeManager.getInstance().CurLevelBase.levelOnHide();
        }

        MiniManeger.instance.playViderAd({
            successFun: () => {
                Laya.timer.once(100, self, () => {
                    if (ViewChangeManager.getInstance().CurLevelBase) {
                        ViewChangeManager.getInstance().CurLevelBase.levelOnShow();
                    }
                })
                console.log("onFailRestartGame xxx");
                self.imageBtSign.on(Laya.Event.CLICK, self, self.onWatchVideoRecvAward);
                //this.bRecvAward = true;
                //增加体力
                PlayerDataManager.getInstance().AddGoods(GoodsType.enum_GoodsType_Sp, 2);
                PlayerDataManager.getInstance().addWatchVideoAddSpTime();
                //打开成功界面2
                ViewManager.getInstance().showView(SuccessfulEntryThreeView);
                this.removeSelf();
            },
            failFun: () => {
                self.imageBtSign.on(Laya.Event.CLICK, self, self.onWatchVideoRecvAward);
                if (ViewChangeManager.getInstance().CurLevelBase) {
                    ViewChangeManager.getInstance().CurLevelBase.levelOnShow();
                }
            },
            errorFun: () => {
                self.imageBtSign.on(Laya.Event.CLICK, self, self.onWatchVideoRecvAward);
                if (ViewChangeManager.getInstance().CurLevelBase) {
                    ViewChangeManager.getInstance().CurLevelBase.levelOnShow();
                }
            }
        });
    }

    private startGameAni() {
        Laya.Tween.clearAll(this.imageBtSign);
        Laya.Tween.to(this.imageBtSign, { scaleX: 1.1, scaleY: 1.1 }, 300, Laya.Ease.sineOut, Laya.Handler.create(this, (args) => {
            Laya.Tween.to(this.imageBtSign, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.sineOut, Laya.Handler.create(this, (args) => {
                Laya.timer.once(0, this, this.startGameAni);
            }));
        }));
    }

    public async  createSkeleton(url: string): Promise<Laya.Skeleton> {
        return new Promise<Laya.Skeleton>((resolve) => {
            AnimationManager.instance.showSkeletonAnimation(url, (boomAnimation: Laya.Skeleton) => {
                this.aniReal = boomAnimation;
                this.aniReal.player.playbackRate = 1;
                this.aniReal.autoSize = true;
                this.aniReal.scale(1, 1);
                this.aniReal.play(0, true);
                this.aniReal.x = this.aniReal.width + 400;
                this.aniReal.y = this.aniReal.height / 2;
                this.boxAni.addChild(this.aniReal);
                resolve(boomAnimation)
            }, 1);
        })

    }

    /**控制更多游戏的函数 */
    private proceMoreGame() {
        //微信平台
        if (DeviceUtil.isWXMiniGame() || DeviceUtil.isTTMiniGame()) {
            this.refreshWeCatMoreGame();
            this.imageWeCatMoreGame.visible = true;
        }

        //TO DO  其他平台
        //……
    }

    /**微信运营需求初始化 */
    private refreshWeCatMoreGame() {
        // //this.imageWeCatMoreGame.visible = true;
        // if(!DeviceUtil.isWXMiniGame() || !DeviceUtil.isWXMiniGame()){
        //     this.imageWeCatMoreGame.visible = false;
        //     return;
        // }else{
        //     this.imageWeCatMoreGame.visible = true;
        // }
        this.panelWeCatMoreGame;
        let nXStart = 5;
        let nXAddTemp = 150;// + 107;
        let nYAddTemp = 180;// + 47;
        let nYStart = 5;
        let aryInfo: number[] = [];
        let nCount = 3;
        aryInfo = this.getRandomIndex();

        let nLen = 6;
        // if (DeviceUtil.isWXMiniGame()) {
        //     nLen = aryInfo.length;
        // } else {
        //     nLen = 9;
        //     nLen = nLen < aryInfo.length ? nLen : aryInfo.length;
        // }
        nLen = nLen >= aryInfo.length ? aryInfo.length : nLen;

        for (let i = 0; i < nLen; ++i) {
            let pWeCatMoreGameItemOne: WeCatMoreGameItemOne = this.panelWeCatMoreGame.getChildAt(i) as WeCatMoreGameItemOne;
            if (pWeCatMoreGameItemOne) {
                pWeCatMoreGameItemOne.setData(aryInfo[i]);
            } else {
                pWeCatMoreGameItemOne = new WeCatMoreGameItemOne(aryInfo[i]);
                let nAddX = Math.floor(i % nCount);
                let nYAdd = Math.floor(i / nCount);
                pWeCatMoreGameItemOne.x = nXStart + pWeCatMoreGameItemOne.width * nAddX + 10 * nAddX;
                pWeCatMoreGameItemOne.y = nYStart + pWeCatMoreGameItemOne.height * nYAdd + 10 * nYAdd;
                this.panelWeCatMoreGame.addChild(pWeCatMoreGameItemOne);
                this.scrollSizeMax = 180 * (nYAdd + 1);
                this.nTimePanel = (nYAdd + 1) * 1000;
            }
        }

        //2020.6.2运营需求  每次使用后刷新下游戏列表
        if (BaseConst.infos.gameInfo.isDY && DeviceUtil.isWXMiniGame()) {
            PlatformDY.refreshGameList();

        }
        //this.panelScrollAni();
    }

    /**随机得到8个编号 */
    private getRandomIndex(): number[] {
        if (GameData.getInstance().weCatMiniIconsInfo.length - 1 < 0) {
            return [];
        }
        let nRandom = Utils.random(0, GameData.getInstance().weCatMiniIconsInfo.length - 1);
        let nCount = GameData.getInstance().weCatMiniIconsInfo.length % 3;
        if (nCount > 0) {
            nCount = 3 - nCount;
        }

        nCount = GameData.getInstance().weCatMiniIconsInfo.length + nCount;

        let aryInfo: number[] = [];
        for (let i = 0; i < nCount; ++i) {
            aryInfo.push(nRandom);
            nRandom += 1;
            if (nRandom >= GameData.getInstance().weCatMiniIconsInfo.length) {
                nRandom = 0;
            }
        }
        return aryInfo;
    }

    private onShowMoreGame() {
        MiniManeger.instance.showMoreGamesModal();
    }

    /**滚动效果 */
    private scrollSizeMax = 50;
    private nTimePanel = 5000;
    private panelScrollAni() {
        Laya.Tween.clearAll(this.panelWeCatMoreGame.vScrollBar);
        Laya.timer.clearAll(this.panelScrollAni);
        // this.panelWeCatMoreGame.vScrollBar.touchScrollEnable =
        //     this.panelWeCatMoreGame.vScrollBar.mouseWheelEnable = true;
        // this.panelWeCatMoreGame.vScrollBar.touchScrollEnable =
        //     this.panelWeCatMoreGame.vScrollBar.mouseWheelEnable = false;
        Laya.Tween.to(this.panelWeCatMoreGame.vScrollBar, { value: this.scrollSizeMax }, this.nTimePanel, null, Laya.Handler.create(this, (args) => {

            Laya.Tween.to(this.panelWeCatMoreGame.vScrollBar, { value: 0 }, this.nTimePanel, null, Laya.Handler.create(this, (args) => {
                this.scrollSizeMax = this.panelWeCatMoreGame.vScrollBar.max;
                Laya.timer.once(0, this, this.panelScrollAni);
            }));
        }));
    }

    /**初始话pinnel***/
    private initPanel() {
        if (!DeviceUtil.isWXMiniGame()) {
            this.panelWeCatMoreGame.vScrollBarSkin = "";
            this.panelWeCatMoreGame.elasticEnabled = true;
            this.panelWeCatMoreGame.vScrollBar.elasticDistance = 200;
            this.panelWeCatMoreGame.vScrollBar.elasticBackTime = 100;
        }
    }
}