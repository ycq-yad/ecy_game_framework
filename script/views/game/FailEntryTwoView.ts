import ViewChangeManager from "../../games/ViewChangeManager";
import GameStateManager from "../../games/GameStateManager";
import { EnterGameType, GoodsType } from "../../games/CommonDefine";
import { LevelManager } from "../../manager/LevelManager";
import { PlayerDataManager } from "../../common/GameDataManager";
import ConfigManager from "../../games/ConfigManager";
import SoundManager from "../../common/SoundManager";
import { MiniManeger } from "../../minigame/MiniManeger";
import AnimationManager from "../../manager/AnimationManager";
import GameEvent from "../../games/GameEvent";
import { GameData } from "../../common/GameData";
import WeCatMoreGameItemOne from "./WeCatMoreGameItemOne";
import AddPsView from "./AddPsView";
import MiniEventConst from "../../minigame/MiniEventConst";
import PlatformDY from "../../../PlatformDY";
import MoreGameOperRequestTwo from "./MoreGameOperRequestTwo";
import WeCatOperReqItem713 from "./WeCatOperReqItem713";
import MoreGameOperRequest from "./MoreGameOperRequest";
import { LotterySelScene } from "./lottery/LotterySelScene";

export default class FailEntryTwoView extends BaseSceneUISkinPopView {
    public className_key = "FailEntryTwoView";
    protected grp_center: Laya.Box;
    protected showEnterType: BasePopAnimationEnterType = BasePopAnimationEnterType.SCALE_MODE_BACK;

    private box_content: Laya.Box;

    public imageRecv: Laya.Image;
    public imageGoodsType: Laya.Image;
    public btLable: Laya.Label;
    public imageBtRestart: Laya.Image;
    public imageBtShare: Laya.Image;
    public imageBtToHome: Laya.Image;
    public spCount: Laya.Sprite;
    public spCost: Laya.Sprite;
    public imageShareName: Laya.Image;

    private nGlodAddByWathcVideo: number;
    private bIsRunning: boolean;
    private shareGlodCount: Laya.Sprite;
    private imageShareIcon: Laya.Image;

    private ttGoodsType: Laya.Image;
    private ttSpecial: Laya.Sprite;

    public imageWeCatMoreGame: Laya.Image;
    public panelWeCatMoreGame: Laya.Panel;


    private bRecvAward: boolean;
    private bShareAward: boolean;
    private bOpneBox2: boolean;


    private selLotteryScene: LotterySelScene;
    constructor() {
        super();
        this.nGlodAddByWathcVideo = 200;
        this.bIsRunning = false;
        this.bRecvAward = false;
        this.bShareAward = false;
        this.bOpneBox2 = false;
        this.skin = 'game/uiView/FailEntryTwoView.json';
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        //处理适配推荐高度
        this.grp_center.width = this.width;
        this.grp_center.height = this.height;
        // this.imageWeCatMoreGame.height = (this.height - this.imageWeCatMoreGame.y - (1920 - this.imageWeCatMoreGame.y - this.imageWeCatMoreGame.height));
        // this.panelWeCatMoreGame.height = this.imageWeCatMoreGame.height - 110;
        this.bOpneBox2 = false;
        //
    }

    onAddStage(): void {
        ViewChangeManager.getInstance().CommonView.addBtEvent();
        MiniManeger.instance.showInterstitialAd();
        this.initView();
        this.addEvent();
        //MiniManeger.instance.showBannerAd();
        this.bOpneBox2 = false;
    }

    public onRemoved() {
        super.onRemoved();
        this.removeEvent();
        this.bIsRunning = false;
        this.bRecvAward = false;
        Laya.Tween.clearAll(this.imageBtShare);
        Laya.timer.clearAll(this);

    }

    private addEvent() {
        this.imageBtRestart.on(Laya.Event.CLICK, this, this.failEntryTwoReStartGame);
        this.imageBtToHome.on(Laya.Event.CLICK, this, this.returnToGameHome);
        this.imageBtShare.on(Laya.Event.CLICK, this, this.failSharGame);
        this.imageRecv.on(Laya.Event.CLICK, this, this.onWatchVideoRecvAward);
        //this.btLable.on(Laya.Event.CLICK, this, this.failSharGame);
        EventMgr.getInstance().addEvent(GameEvent.EVENT_FLAY_GLOD, this, this.flayGlodFileShare);

        if (DeviceUtil.isTTMiniGame()) {
            this.panelWeCatMoreGame.on(Laya.Event.CLICK, this, this.onShowMoreGame);
        }
    }

    private removeEvent() {
        this.imageBtRestart.off(Laya.Event.CLICK, this, this.failEntryTwoReStartGame);
        this.imageBtToHome.off(Laya.Event.CLICK, this, this.returnToGameHome);
        this.imageBtShare.off(Laya.Event.CLICK, this, this.failSharGame);
        this.imageRecv.off(Laya.Event.CLICK, this, this.onWatchVideoRecvAward);
        //this.btLable.off(Laya.Event.CLICK, this, this.failSharGame);
        EventMgr.getInstance().removeEvent(GameEvent.EVENT_FLAY_GLOD, this, this.flayGlodFileShare);
        if (DeviceUtil.isTTMiniGame()) {
            this.panelWeCatMoreGame.off(Laya.Event.CLICK, this, this.onShowMoreGame);
        }
    }

    /**分享游戏 */
    private failSharGame() {
        MiniManeger.instance.reportMonitorSome(MiniEventConst.GAMEOVER_SHARE, 1);
        SoundManager.getInstance().playEffect("button", 1);
        let self = this;
        if (DeviceUtil.isTTMiniGame()) {

            if (this.bShareAward) {
                TipsManager.getInstance().showDefaultTips("已经领过奖励了哦");
                return;
            }

            this.removeEvent();
            let info = platform.getSystemInfoSync() as any;
            if (info.appName.toUpperCase() == 'DOUYIN') {
                MiniManeger.instance.bFlagDouYin = true;
                MiniManeger.instance.shareAppMessage({
                    sucFun: () => {
                        console.log("发布录制视频成功");
                        self.addEvent();
                        self.bShareAward = true;
                        TipsManager.getInstance().showDefaultTips('分享成功');
                        if (MiniManeger.instance.onShareVideoSuccess) {
                            return;
                        }
                        let nGlodCount = 50;
                        let stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(18);
                        if (stGameConfig) {
                            nGlodCount = parseInt(stGameConfig.strValue);
                        }
                        PlayerDataManager.getInstance().AddGoods(GoodsType.enum_GoodsType_Glod, nGlodCount);
                        MiniManeger.instance.onShareVideoSuccess = true;
                        Laya.timer.once(1000, self, () => {
                            self.flayGlodFileShare();
                        })

                        //EventMgr.getInstance().sendEvent(GameEvent.EVENT_FLAY_GLOD);
                    },
                    failFun: () => {
                        self.addEvent();
                        console.log("发布录制视频失败");
                        TipsManager.getInstance().showDefaultTips('分享失败');
                    }
                });
            } else {
                MiniManeger.instance.onShareVideo({
                    successFun: () => {
                        console.log("发布录制视频成功");
                        self.addEvent();
                        self.bShareAward = true;
                        if (MiniManeger.instance.onShareVideoSuccess) {
                            return;
                        }
                        let nGlodCount = 50;
                        let stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(18);
                        if (stGameConfig) {
                            nGlodCount = parseInt(stGameConfig.strValue);
                        }
                        PlayerDataManager.getInstance().AddGoods(GoodsType.enum_GoodsType_Glod, nGlodCount);
                        MiniManeger.instance.onShareVideoSuccess = true;
                        self.flayGlodFileShare();
                    },
                    failFun: () => {
                        console.log("发布录制视频失败");
                        self.addEvent();
                    }
                });
            }
        } else {
            if (DeviceUtil.isWXMiniGame() && BaseConst.infos.gameInfo.isDY) {
                MiniManeger.instance.shareAppMessage({
                    sucFun: () => {
                        ViewManager.getInstance().showView(MoreGameOperRequestTwo);
                    },
                    failFun: () => {
                        ViewManager.getInstance().showView(MoreGameOperRequestTwo);
                    }
                });
            } else {
                MiniManeger.instance.shareAppMessage();
            }
        }
    }

    /**开始游戏 */
    private failEntryTwoReStartGame() {
        MiniManeger.instance.reportMonitorSome(MiniEventConst.GAMEOVER_AGIN, 1);
        SoundManager.getInstance().playEffect("button", 1);
        let nSpCost = 1;
        let stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(8);
        if (stGameConfig) {
            nSpCost = parseInt(stGameConfig.strValue);
        }
        //检测体力是否足够
        let b = PlayerDataManager.getInstance().CheckGoods(GoodsType.enum_GoodsType_Sp, nSpCost);
        if (!b) {
            TipsManager.getInstance().showDefaultTips("体力不足");
            ViewChangeManager.getInstance().showBufferLoadingView();
            ResUtil.getIntance().loadGroups(["adsp"], async () => {
                ViewManager.getInstance().showView(AddPsView);
                ViewChangeManager.getInstance().hideBufferLoadingView();
            });
            return;
        }
        //2020.7.13-9
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            MoreGameOperRequest.bReStartGame = true;
            MoreGameOperRequest.bEnterHotBox = true;
            ViewManager.getInstance().showView(MoreGameOperRequest);
        } else {
            //扣除体力
            PlayerDataManager.getInstance().subGoods(GoodsType.enum_GoodsType_Sp, nSpCost);
            //重新开始游戏
            ViewChangeManager.getInstance().restartGame(true);
        }


        //2020.7.13-9
        MiniManeger.instance.bFlagSpecialView = true;
        this.removeSelf();
    }

    /**返回主页 */
    private returnToGameHome() {
        SoundManager.getInstance().playEffect("button", 1);
        //PlayerDataManager.getInstance().setCurLevel(PlayerDataManager.getInstance().getCurLevelMax());
        //2020.6.1 用户点击左上角【主页】按钮，先弹盒子2。
        if (BaseConst.infos.gameInfo.isDY) {
            if (PlayerDataManager.getInstance().bIsNewPlayer || BaseConst.infos.gameInfo.openPsAward == 0 ||
                BaseConst.infos.gameInfo.glodegg == 0) {
                MoreGameOperRequestTwo.toHome = true;
                ViewManager.getInstance().showView(MoreGameOperRequestTwo);
            } else {
                GameStateManager.getInstance().levelState = EnterGameType.enum_EnterGameType_GameHome;
                ViewChangeManager.getInstance().CurLevelBase.returnToGameHome();
                //ViewChangeManager.getInstance().restartEnterGameHome();
            }
        } else {
            GameStateManager.getInstance().levelState = EnterGameType.enum_EnterGameType_GameHome;
            ViewChangeManager.getInstance().CurLevelBase.returnToGameHome();
        }
        //2020.7.13-9
        MiniManeger.instance.bFlagSpecialView = true;
        this.removeSelf();
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

    /**刷新界面 */
    private initView() {
        MiniManeger.instance.onShareVideoSuccess = false;
        this.initPlView();
        this.initPanel();
        //2020.7.13-9
        this.initViewForOperReq();
        this.proceMoreGame();
        this.bIsRunning = true;
        this.bRecvAward = false;
        this.bShareAward = false;
        //刷新视频领取奖励的数值
        let stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(7);
        if (stGameConfig) {
            this.nGlodAddByWathcVideo = parseInt(stGameConfig.strValue);
        }
        BitmapLabelUtils.setLabel(this.spCount, this.nGlodAddByWathcVideo.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");

        //扣除的体力数值
        let nCost = 1;
        stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(8);
        if (stGameConfig) {
            nCost = parseInt(stGameConfig.strValue);
        }
        BitmapLabelUtils.setLabel(this.spCost, nCost.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");


        //开启放大缩小的动画
        this.startimageBtShareAni();

        if (DeviceUtil.isQQMiniGame() && BaseConst.infos.gameInfo.openPsAward == 1) {
            if (this.selLotteryScene == null) {
                this.selLotteryScene = new LotterySelScene(null);
            }
            this.box_content.visible = true;

            this.box_content.addChild(this.selLotteryScene);
            MiniManeger.instance.showBoxAd()

        }
    }

    private startimageBtShareAni() {
        //2020.7.13-9
        if (!this.bIsRunning || MiniManeger.instance.isWxMiniGameForOperReq()) {
            return;
        }
        Laya.Tween.clearAll(this.imageBtShare);
        Laya.Tween.to(this.imageBtShare, { scaleX: 1.1, scaleY: 1.1 }, 300, Laya.Ease.sineOut, Laya.Handler.create(this, (args) => {
            Laya.Tween.to(this.imageBtShare, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.sineOut, Laya.Handler.create(this, (args) => {
                Laya.timer.once(0, this, this.startimageBtShareAni);
            }));
        }));
    }

    private onWatchVideoRecvAward() {
        if (this.bRecvAward) {
            TipsManager.getInstance().showDefaultTips("已经领过奖励了哦");
            return;
        }
        MiniManeger.instance.reportMonitorSome(MiniEventConst.GAMEOVER_GET, 1);
        // this.addGlodReal();
        this.imageRecv.off(Laya.Event.CLICK, this, this.onWatchVideoRecvAward);
        MiniManeger.instance.playViderAd({
            successFun: () => {
                this.addGlodReal();
                this.imageRecv.on(Laya.Event.CLICK, this, this.onWatchVideoRecvAward);
            },
            failFun: () => {
                this.imageRecv.on(Laya.Event.CLICK, this, this.onWatchVideoRecvAward);
            },
            errorFun: () => {
                this.imageRecv.on(Laya.Event.CLICK, this, this.onWatchVideoRecvAward);
            }
        });
    }

    private addGlodReal() {
        this.bRecvAward = true;
        //增加金币
        PlayerDataManager.getInstance().AddGoods(GoodsType.enum_GoodsType_Glod, this.nGlodAddByWathcVideo);
        this.flayGlodRecv();
    }

    /**头条的特殊界面初始化 */
    private initPlView() {
        if (DeviceUtil.isTTMiniGame()) {
            this.imageShareName.skin = "resource/assets/img/ui/success/failure_word_8.png";
            this.imageShareIcon.skin = "resource/assets/img/common/succeed_icon_3.png";
            this.imageShareName.y = 15;
            this.shareGlodCount.visible = true;
            this.ttGoodsType.visible = true;
            this.ttSpecial.visible = true;
            /**刷新分享的金币 */
            let nGlodCount = 50;
            let stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(18);
            if (stGameConfig) {
                nGlodCount = parseInt(stGameConfig.strValue)
            }
            BitmapLabelUtils.setLabel(this.shareGlodCount, nGlodCount.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");
        } else {
            this.imageShareName.skin = "resource/assets/img/ui/success/failure_word_2.png";
            this.imageShareIcon.skin = "resource/assets/img/common/common_icon_3.png";
            this.shareGlodCount.visible = false;
            this.ttGoodsType.visible = false;
            this.ttSpecial.visible = false;
            this.imageShareName.y = 38;

        }
    }

    /*分享游戏飞金币的动画 */
    private flayGlodFileShare() {
        console.log("flayGlodFileShare");
        let pPoint = new Laya.Point();
        pPoint.x = this.ttGoodsType.x;
        pPoint.y = this.ttGoodsType.y;
        let stParent = this.ttGoodsType.parent as Laya.Image;
        pPoint = stParent.localToGlobal(pPoint);
        AnimationManager.instance.flayGlod(pPoint.x, pPoint.y, 341, 105);
        console.log("pPoint.x = ", pPoint.x, "pPoint.y = ", pPoint.y);
    }

    /**看视频领奖非金币的动画 */
    private flayGlodRecv() {
        console.log("flayGlodRecv");
        let pPoint = new Laya.Point();
        pPoint.x = this.imageGoodsType.x;
        pPoint.y = this.imageGoodsType.y;
        let stParent = this.imageGoodsType.parent as Laya.Image;
        pPoint = stParent.localToGlobal(pPoint);
        AnimationManager.instance.flayGlod(pPoint.x, pPoint.y, 341, 105);
    }

    /**控制更多游戏的函数 */
    private proceMoreGame() {
        //微信平台
        if (DeviceUtil.isTTMiniGame()) {
            this.refreshTTMoreGame();
            this.imageWeCatMoreGame.visible = true;
            //2020.7.13-9
        } else if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.refreshWeCatMoreGameFail();
        }
    }


    /**微信运营需求初始化 */
    private refreshTTMoreGame() {
        //this.imageWeCatMoreGame.visible = true;
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
        aryInfo = this.getRandomIndex_6();

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
                this.scrollSizeMax = 120 * (nYAdd + 1);
                this.nTimePanel = 5000;
            }
        }

        if (BaseConst.infos.gameInfo.isDY && DeviceUtil.isWXMiniGame()) {
            //2020.6.2运营需求  每次使用后刷新下游戏列表
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

    /**运营要改成随机6个游戏 */
    private getRandomIndex_6(): number[] {
        if (GameData.getInstance().weCatMiniIconsInfo.length - 1 < 0) {
            return [];
        }
        let nRandom = Utils.random(0, GameData.getInstance().weCatMiniIconsInfo.length - 1);
        // let nCount = GameData.getInstance().weCatMiniIconsInfo.length % 3;
        // if (nCount > 0) {
        //     nCount = 3 - nCount;
        // }
        let nCount = 6;
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
        //     this.panelWeCatMoreGame.vScrollBar.mouseWheelEnable = false;
        Laya.Tween.to(this.panelWeCatMoreGame.vScrollBar, { value: this.scrollSizeMax }, this.nTimePanel, null, Laya.Handler.create(this, (args) => {
            Laya.Tween.to(this.panelWeCatMoreGame.vScrollBar, { value: 0 }, this.nTimePanel, null, Laya.Handler.create(this, (args) => {
                this.scrollSizeMax = this.panelWeCatMoreGame.vScrollBar.max;
                Laya.timer.once(0, this, this.panelScrollAni);
            }));
        }));
    }

    //2020.7.13-9
    private box_wecat: Laya.Box;
    private nBtNextLevel: number = 300;
    private nBtNextLevelSp: number = 100;
    private initViewForOperReq() {
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.imageBtShare.scaleX = 0.6;
            this.imageBtShare.scaleY = 0.6;
            this.imageBtShare.bottom = 470;
            this.imageBtShare.left = 100;
            this.imageRecv.scaleX = 0.6;
            this.imageRecv.scaleY = 0.6;
            this.imageRecv.right = 100;
            this.imageRecv.bottom = 470;
            this.imageBtRestart.width = 370;
            this.imageBtRestart.height = 125;
            this.box_wecat.visible = true;
            if (BaseConst.infos.gameInfo.openPsAward == 1) {
                this.imageBtRestart.bottom = this.nBtNextLevelSp;
                MiniManeger.instance.bFlagSpecialView = false;
                MiniManeger.instance.hideBanner();
                //一秒后显示binner
                Laya.timer.once(1000, this, () => {
                    MiniManeger.instance.bFlagSpecialView = true;
                    MiniManeger.instance.showBannerAd();
                    //按钮滑动动制定位置
                    Laya.Tween.to(this.imageBtRestart, { bottom: this.nBtNextLevel }, 500, null);
                })
                return;
            } else {
                this.imageBtRestart.bottom = this.nBtNextLevel;
            }
        } else {
            MiniManeger.instance.showBannerAd();
        }
    }

    //2020.7.13-9
    private image_hand: Laya.Image;
    private refreshWeCatMoreGameFail() {
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
                pWeCatMoreGameItemOne.setAni(false);
                pWeCatMoreGameItemOne.setData(aryInfo[i]);
            } else {
                pWeCatMoreGameItemOne = new WeCatOperReqItem713(aryInfo[i], 375, 430);
                pWeCatMoreGameItemOne.setAni(false);
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

    //2020.7.13-9
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