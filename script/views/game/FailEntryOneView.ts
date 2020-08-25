import ConfigManager from "../../games/ConfigManager";
import { PlayerDataManager } from "../../common/GameDataManager";
import { GoodsType } from "../../games/CommonDefine";
import FailEntryTwoView from "./FailEntryTwoView";
import ViewChangeManager from "../../games/ViewChangeManager";
import AnimationManager from "../../manager/AnimationManager";
import SoundManager from "../../common/SoundManager";
import { MiniManeger } from "../../minigame/MiniManeger";
import MoreGameOperRequest from "./MoreGameOperRequest";
import MoreGameOperRequestTwo from "./MoreGameOperRequestTwo";
import WeCatOperReqItem713 from "./WeCatOperReqItem713";
import PlatformDY from "../../../PlatformDY";
import { GameData } from "../../common/GameData";
import MoreGameView from "./moregame/MoreGameView";

export default class FailEntryOneView extends BaseSceneUISkinPopView {
    public className_key = "FailEntryOneView";
    protected grp_center: Laya.Box;
    protected showEnterType: BasePopAnimationEnterType = BasePopAnimationEnterType.SCALE_MODE_BACK;
    public imageBtSign: Laya.Image;

    public imageRecv: Laya.Image;
    public imageGoodsType: Laya.Image;
    public spGlod: Laya.Image;
    public boxAni: Laya.Box;
    public aniReal: Laya.Skeleton;
    public img_back: Laya.Image;

    //2020.7.13-8
    public btLable: Laya.Image;
    public box_wecat: Laya.Image;
    private nBtNextLevel: number = 320;
    private nBtNextLevelSp: number = 100;
    private image_hand: Laya.Image;

    /**数据 */
    private nGlodCost: number;

    private bFlag: boolean;

    constructor() {
        super();
        this.nGlodCost = 200;
        this.bFlag = false;
        this.skin = "game/uiView/FailEntryOneView.json";
    }

    protected childrenCreated(): void {
        super.childrenCreated();

    }

    onAddStage(): void {
        MiniManeger.instance.showInterstitialAd();
        this.initView();
        this.addEvent();
        MiniManeger.instance.bFlagSpecialView = false;
    }

    public onRemoved() {
        super.onRemoved();
        this.removeEvent();
        if (this.aniReal) {
            this.aniReal.stop();
        }

    }


    private initView() {
        this.bFlag = false;

        this.forExamine();
        this.refreshLable();
        MiniManeger.instance.StopVideo();
        if (!this.aniReal) {
            this.createSkeleton("resource/assets/img/ani/failure/failure.sk");
        } else {
            this.aniReal.play(0, true);
        }
        //刷新金币数量
        this.refreshReLiveByGlod();
        //两秒后显示出来
        Laya.timer.once(2000, this, () => {
            this.btLable.visible = true;
        })

        // if (MiniManeger.instance.isWxMiniGameForOperReq()) {
        //     this.img_back.visible = true;
        // } else {
        //     this.img_back.visible = false;
        // }
        this.img_back.visible = false;
        //2020.7.13-8
        this.initViewForOperReq();
        this.proceMoreGame();
        // imageBtSign
        Laya.timer.clearAll(this.imageBtSign)
        AnimationManager.instance.zoomTween(this.imageBtSign, this.imageBtSign)
    }

    private addEvent() {
        this.imageRecv.on(Laya.Event.CLICK, this, this.onCostGlodRelive);
        this.imageBtSign.on(Laya.Event.CLICK, this, this.onWatchVideoToRelive);
        this.btLable.on(Laya.Event.CLICK, this, this.onNoThanks);
        this.img_back.on(Laya.Event.CLICK, this, this.onBack);
    }

    private removeEvent() {
        this.imageRecv.off(Laya.Event.CLICK, this, this.onCostGlodRelive);
        this.imageBtSign.off(Laya.Event.CLICK, this, this.onWatchVideoToRelive);
        this.btLable.off(Laya.Event.CLICK, this, this.onNoThanks);
        this.img_back.off(Laya.Event.CLICK, this, this.onBack);
    }

    /**
     * 点击返回
     */
    private onBack(): void {
        MoreGameOperRequestTwo.bOperFlag = true;
        MoreGameOperRequestTwo.bSuccess = false;
        ViewManager.getInstance().showView(MoreGameOperRequestTwo);
        //2020.7.13-8
        MiniManeger.instance.bFlagSpecialView = true;
        this.removeSelf();
    }

    /**看视频复活 */
    private onWatchVideoToRelive() {
        SoundManager.getInstance().playEffect("button", 1);
        this.imageBtSign.off(Laya.Event.CLICK, this, this.onWatchVideoToRelive);
        let self = this;

        if (ViewChangeManager.getInstance().CurLevelBase) {
            ViewChangeManager.getInstance().CurLevelBase.levelOnHide();
        }

        MiniManeger.instance.playViderAd({
            successFun: () => {
                Laya.timer.once(100, self, () => {

                    self.onFailRestartGame();
                    if (ViewChangeManager.getInstance().CurLevelBase) {
                        ViewChangeManager.getInstance().CurLevelBase.levelOnShow();
                    }
                })
                console.log("onFailRestartGame xxx");
                self.imageBtSign.on(Laya.Event.CLICK, self, self.onWatchVideoToRelive);
            },
            failFun: () => {
                self.imageBtSign.on(Laya.Event.CLICK, self, self.onWatchVideoToRelive);
                if (ViewChangeManager.getInstance().CurLevelBase) {
                    ViewChangeManager.getInstance().CurLevelBase.levelOnShow();
                }
            },
            errorFun: () => {
                self.imageBtSign.on(Laya.Event.CLICK, self, self.onWatchVideoToRelive);
                if (ViewChangeManager.getInstance().CurLevelBase) {
                    ViewChangeManager.getInstance().CurLevelBase.levelOnShow();
                }
            }
        });

    }

    private onFailRestartGame() {
        //为了头条的提审 隐藏binner可能会有延迟 
        if (DeviceUtil.isTTMiniGame() || DeviceUtil.isWXMiniGame()) {
            MiniManeger.instance.hideBanner();
        }
        ViewChangeManager.getInstance().restartGame(false);
        //2020.7.13-8
        MiniManeger.instance.bFlagSpecialView = true;
        this.removeSelf();
    }

    /**花费金币复活 */
    private onCostGlodRelive() {
        SoundManager.getInstance().playEffect("button", 1);
        //检测金币是否足够
        let b = PlayerDataManager.getInstance().CheckGoods(GoodsType.enum_GoodsType_Glod, this.nGlodCost);
        if (!b) {
            return;
        }
        //花费金币
        PlayerDataManager.getInstance().subGoods(GoodsType.enum_GoodsType_Glod, this.nGlodCost);

        //开启游戏
        this.onFailRestartGame();
    }

    /**不了谢谢 */
    private onNoThanks() {
        SoundManager.getInstance().playEffect("button", 1);
        //2020.7.13-8
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            // MoreGameOperRequest.bOperFlag = true;
            // MoreGameOperRequest.bSuccess = false;
            // ViewManager.getInstance().showView(MoreGameOperRequest);
            MoreGameView.bSuccess = false;
            ViewManager.getInstance().showView(MoreGameView);
        } else {
            //打开失败界面2
            ViewManager.getInstance().showView(FailEntryTwoView);
        }
        //2020.7.13-8
        MiniManeger.instance.bFlagSpecialView = true;
        this.removeSelf();
    }

    /**刷新金币复活的信息 */
    private refreshReLiveByGlod() {
        let stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(6);
        if (stGameConfig) {
            this.nGlodCost = parseInt(stGameConfig.strValue);
        }
        //检测金币是否足够
        let b = PlayerDataManager.getInstance().CheckGoods(GoodsType.enum_GoodsType_Glod, this.nGlodCost);
        if (!b) {
            this.imageRecv.visible = false;
            return;
        }
        this.imageRecv.visible = true;
        BitmapLabelUtils.setLabel(this.spGlod, this.nGlodCost.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");
    }

    public async  createSkeleton(url: string): Promise<Laya.Skeleton> {
        return new Promise<Laya.Skeleton>((resolve) => {
            AnimationManager.instance.showSkeletonAnimation(url, (boomAnimation: Laya.Skeleton) => {
                this.aniReal = boomAnimation;
                this.aniReal.player.playbackRate = 1;
                this.aniReal.autoSize = true;
                this.aniReal.scale(1, 1);
                this.aniReal.play(0, true);
                this.aniReal.x = this.aniReal.width / 2;
                this.aniReal.y = this.aniReal.height / 2;
                this.boxAni.addChild(this.aniReal);
                resolve(boomAnimation)
            }, 1);
        })

    }

    /**不了谢谢延迟显示 */
    private refreshLable() {
        //2020.7.13-8
        if (!MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.btLable.visible = false;
            Laya.timer.once(3000, this, () => {
                this.btLable.visible = true;
            });
        }
    }

   
    private forExamine() {
        
    }

    //2020.7.13-8
    private initViewForOperReq() {
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.boxAni.visible = false;
            this.box_wecat.visible = true;
            if (this.imageRecv.visible) {
                this.imageBtSign.left = 30;
                this.imageRecv.bottom = this.imageBtSign.bottom;
                this.imageRecv.right = 30
            }

            if (BaseConst.infos.gameInfo.openPsAward == 1) {
                this.btLable.bottom = this.nBtNextLevelSp;
                MiniManeger.instance.bFlagSpecialView = false;
                MiniManeger.instance.hideBanner();
                return;
            } else {
                this.btLable.bottom = this.nBtNextLevel;
            }
        } else {
            MiniManeger.instance.showBannerAd();
        }
    }

    /**控制更多游戏的函数 */
    private proceMoreGame() {

        //2020.7.13-8
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.refreshWeCatMoreGame();
        }
        //TO DO  其他平台
        //……
    }
    ////2020.7.13-8
    private refreshWeCatMoreGame() {
        let nXAddTemp = 425;
        let nYAddTemp = 450;
        let aryInfo: number[] = [];
        let nCount = 2;
        aryInfo = this.getRandomIndex_num(4);
        let nLen = 4;
        let nRandomNum = Utils.random(0, nLen - 1);
        let nHandX = 0;
        let nHandY = 0;
        nLen = nLen >= aryInfo.length ? aryInfo.length : nLen;
        for (let i = 0; i < nLen; ++i) {
            let pWeCatMoreGameItemOne: WeCatOperReqItem713 = this.box_wecat.getChildAt(i) as WeCatOperReqItem713;
            if (pWeCatMoreGameItemOne) {
                pWeCatMoreGameItemOne.setAni(true);
                pWeCatMoreGameItemOne.setData(aryInfo[i]);
            } else {
                pWeCatMoreGameItemOne = new WeCatOperReqItem713(aryInfo[i], 375, 430);
                pWeCatMoreGameItemOne.setAni(true);
                let nAddX = Math.floor(i % nCount);
                let nYAdd = Math.floor(i / nCount);
                pWeCatMoreGameItemOne.x = pWeCatMoreGameItemOne.pivotX + nXAddTemp * nAddX
                pWeCatMoreGameItemOne.y = pWeCatMoreGameItemOne.pivotY + nYAddTemp * nYAdd;
                this.box_wecat.addChild(pWeCatMoreGameItemOne);
            }
            if (nRandomNum == i) {
                nHandX = pWeCatMoreGameItemOne.x;
                nHandY = pWeCatMoreGameItemOne.y;
            }
        }

        //2020.6.2运营需求  每次使用后刷新下游戏列表
        if (BaseConst.infos.gameInfo.isDY && DeviceUtil.isWXMiniGame()) {
            PlatformDY.refreshGameList();

        }
        if (!this.image_hand) {
            this.image_hand = new Laya.Image("resource/assets/img/wecat/failed_icon_1.png");
            this.box_wecat.addChild(this.image_hand);
        }
        //刷新手的位置
        this.image_hand.visible = true;
        this.image_hand.x = nHandX;
        this.image_hand.y = nHandY;
    }

    /**运营要改成随机6个游戏 */
    //2020.7.13-8
    private getRandomIndex_num(nNum: number): number[] {
        if (GameData.getInstance().weCatMiniIconsInfo.length - 1 < 0) {
            return [];
        }
        let nRandom = Utils.random(0, GameData.getInstance().weCatMiniIconsInfo.length - 1);
        // let nCount = GameData.getInstance().weCatMiniIconsInfo.length % 3;
        // if (nCount > 0) {
        //     nCount = 3 - nCount;
        // }
        let nCount = nNum;
        //nCount = GameData.getInstance().weCatMiniIconsInfo.length + nCount;

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

}