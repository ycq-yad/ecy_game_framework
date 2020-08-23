import { LevelManager } from "../../manager/LevelManager";
import { PlayerDataManager } from "../../common/GameDataManager";
import GameStateManager from "../../games/GameStateManager";
import { EnterGameType, GoodsType, MoreGameIndex } from "../../games/CommonDefine";
import ViewChangeManager from "../../games/ViewChangeManager";
import ConfigManager from "../../games/ConfigManager";
import AnimationManager from "../../manager/AnimationManager";
import SoundManager from "../../common/SoundManager";
import AddPsView from "./AddPsView";
import { MiniManeger } from "../../minigame/MiniManeger";
import { GameData } from "../../common/GameData";
import WeCatMoreGameItemOne from "./WeCatMoreGameItemOne";
import MoreGameOperReqIndex from "./MoreGameOperReqIndex";
import MoreGameOperRequest from "./MoreGameOperRequest";
import PlatformDY from "../../../PlatformDY";
import WeCatOperReqItem713 from "./WeCatOperReqItem713";
import { LotterySelScene } from "./lottery/LotterySelScene";

export default class SuccessfulEntryThreeView extends BaseSceneUISkinPopView {
    public className_key = "SuccessfulEntryThreeView";
    protected grp_center: Laya.Box;
    protected showEnterType: BasePopAnimationEnterType = BasePopAnimationEnterType.SCALE_MODE_BACK;

    public btNextLevel: Laya.Image;
    public spGlodAdd: Laya.Sprite;
    public btLable: Laya.Sprite;
    public imageRecv: Laya.Box;
    public imageGoodsType: Laya.Image;
    public spCountAddMore: Laya.Sprite;
    public spCost: Laya.Sprite;
    public imageBtShare: Laya.Box;
    public imageBtRestart: Laya.Box;
    public btDouble: Laya.Sprite;
    public spDouble: Laya.Sprite;
    public lableDesc: Laya.Label;
    public imageBtToHome: Laya.Image;
    public imageGoodsTypeUp: Laya.Image;
    public spCostPs: Laya.Sprite;
    public imageShareGameName: Laya.Image;
    private nGlodAddByWathcVideo: number;


    private shareGlodCount: Laya.Sprite;
    private imageShareIcon: Laya.Image;

    private ttGoodsType: Laya.Image;
    private ttSpecial: Laya.Sprite;
    private box_lable: Laya.Box;
    //2020.7.13-4
    private box_nextLevel: Laya.Box;
    private box_wecat: Laya.Box;
    private image_hand: Laya.Image;
    private nBtNextLevel: number = 320;
    private nBtNextLevelSp: number = 100;

    public aniReal: Laya.Skeleton;

    public imageWeCatMoreGame: Laya.Image;
    public panelWeCatMoreGame: Laya.Panel;

    /**一些数据 */
    private nGlodAdd: number;    //通关后增加的金币
    private nGlodRadio: number;  //看视频后增加的倍数

    private bIsRunning: boolean;
    private bRecvAward: boolean;

    private bOpneBox2: boolean;

    constructor() {
        super();
        this.nGlodAdd = 50;
        this.nGlodRadio = 4;
        this.bIsRunning = false;
        this.bRecvAward = false;
        this.bOpneBox2 = false;
        //2020.7.13-4
        this.image_hand = null;
        this.skin = 'game/uiView/SuccessfulEntryThreeView.json';
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        //处理适配推荐高度
        this.grp_center.width = this.width;
        this.grp_center.height = this.height;
        // this.imageWeCatMoreGame.height = (this.height - this.imageWeCatMoreGame.y - (1920 - this.imageWeCatMoreGame.y - this.imageWeCatMoreGame.height));
        // this.panelWeCatMoreGame.height = this.imageWeCatMoreGame.height - 110;
        //
        this.initView();
        this.addEvent();
    }

    onAddStage(): void {
        ViewChangeManager.getInstance().CommonView.addBtEvent();
        this.initView();
        this.addEvent();
        this.isShowBox = false;
        MiniManeger.instance.showInterstitialAd();
        this.operResGotoNextLevelAni();
    }

    public onRemoved() {
        super.onRemoved();
        this.removeEvent();
        this.bIsRunning = false;
        Laya.Tween.clearAll(this.imageBtShare);
        Laya.timer.clearAll(this);
        if (this.aniReal) {
            this.aniReal.stop();
            this.aniReal.removeSelf();
        }
        //2020.7.13-4
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
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

    /**初始化一些信息 */
    private initView() {
        //2020.7.13-5
        this.nCountGoToLevel = 0;
        this.bOpneBox2 = false;
        this.initPanel();
        this.proceMoreGame();
        MiniManeger.instance.onShareVideoSuccess = false;
        MiniManeger.instance.StopVideo();
        this.initPlView();
        SoundManager.getInstance().playEffect("win", 1);
        this.bRecvAward = false;
        if (!this.aniReal) {
            this.createSkeleton("resource/assets/img/ani/celebrate/celebrate.sk");
        } else {
            this.aniReal.play(0, false);
            this.grp_center.addChild(this.aniReal);
        }

        //初始化双倍领奖的按钮
        if (BaseConst.infos.gameInfo.openPsAward && BaseConst.infos.gameInfo.openPsAward == 1) {
            this.spDouble.visible = false;
        } else {
            this.spDouble.visible = true;
        }

        //2020.7.13-4
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.spDouble.visible = true;
        }

        if (DeviceUtil.isQQMiniGame()) {
            if (Math.random() < BaseConst.infos.gameInfo.siginC) {//qq的平台单独使用概率配置
                this.spDouble.visible = false;
            } else {
                this.spDouble.visible = true;
            }
        }

        this.bIsRunning = true;
        //初始化通关加的金币
        let pGameConfig = ConfigManager.getInstance().getGameConfigDataByID(12);
        if (pGameConfig) {
            this.nGlodAdd = parseInt(pGameConfig.strValue);
        }
        //BitmapLabelUtils.setLabel(this.spGlodAdd, this.nGlodAdd.toString(), "resource/assets/img/ui/success/succeed_number1/succeed_number1_", 0, ".png", "left");
        //初始化看视频增加的倍数
        pGameConfig = ConfigManager.getInstance().getGameConfigDataByID(13);
        if (pGameConfig) {
            this.nGlodRadio = parseInt(pGameConfig.strValue);
            //更新描述
            this.lableDesc.text = pGameConfig.strDesc;
        }
        BitmapLabelUtils.setLabel(this.spCost, this.nGlodRadio.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");

        //扣除的体力数值
        let nCost = 1;
        pGameConfig = ConfigManager.getInstance().getGameConfigDataByID(8);
        if (pGameConfig) {
            nCost = parseInt(pGameConfig.strValue);
        }
        BitmapLabelUtils.setLabel(this.spCostPs, nCost.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");

        //总数
        let bAddMore = this.nGlodAdd * this.nGlodRadio;
        BitmapLabelUtils.setLabel(this.spCountAddMore, bAddMore.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");
        if (!this.spDouble.visible) {
            let nReal = this.nGlodAdd * this.nGlodRadio;
            BitmapLabelUtils.setLabel(this.spGlodAdd, nReal.toString(), "resource/assets/img/ui/success/succeed_number1/succeed_number1_", 0, ".png", "left");
        } else {
            BitmapLabelUtils.setLabel(this.spGlodAdd, this.nGlodAdd.toString(), "resource/assets/img/ui/success/succeed_number1/succeed_number1_", 0, ".png", "left");
        }




        /**刷新分享的金币 */
        // let nGlodCount = 50;
        // stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(18);
        // if(stGameConfig){
        //     nGlodCount = parseInt(stGameConfig.strValue)
        // }
        // BitmapLabelUtils.setLabel(this.shareGlodCount, nGlodCount.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");

        //开启缩放动画
        this.startSuccessImageBtShareAni();
        if (DeviceUtil.isQQMiniGame() && BaseConst.infos.gameInfo.openPsAward == 1) {
            MiniManeger.instance.showBoxAd()

            if (this.selLotteryScene == null) {
                this.selLotteryScene = new LotterySelScene(null);

            }
            this.box_content.visible = true;
            this.box_content.addChild(this.selLotteryScene);
        }


    }
    private box_content: Laya.Box;

    private selLotteryScene: LotterySelScene;

    private addEvent() {
        this.btLable.on(Laya.Event.CLICK, this, this.successfulEntryThreeNextLevel);
        this.imageBtToHome.on(Laya.Event.CLICK, this, this.returnToGameHome);
        this.imageBtShare.on(Laya.Event.CLICK, this, this.successShareGame);
        this.imageBtRestart.on(Laya.Event.CLICK, this, this.successReStart);
        this.imageRecv.on(Laya.Event.CLICK, this, this.successRecvAward);
        this.btDouble.on(Laya.Event.CLICK, this, this.onDoubleGlod);
        if (DeviceUtil.isTTMiniGame()) {
            this.panelWeCatMoreGame.on(Laya.Event.CLICK, this, this.onShowMoreGame);
        }
        //2020.7.13-4
        this.box_nextLevel.on(Laya.Event.CLICK, this, this.sendAwardAfterWatchVideo);
    }

    private removeEvent() {
        this.btLable.off(Laya.Event.CLICK, this, this.successfulEntryThreeNextLevel);
        this.imageBtToHome.off(Laya.Event.CLICK, this, this.returnToGameHome);
        this.imageBtShare.off(Laya.Event.CLICK, this, this.successShareGame);
        this.imageBtRestart.off(Laya.Event.CLICK, this, this.successReStart);
        this.imageRecv.off(Laya.Event.CLICK, this, this.successRecvAward);
        this.btDouble.off(Laya.Event.CLICK, this, this.onDoubleGlod);
        if (DeviceUtil.isTTMiniGame()) {
            this.panelWeCatMoreGame.off(Laya.Event.CLICK, this, this.onShowMoreGame);
        }
        //2020.7.13-4
        this.box_nextLevel.off(Laya.Event.CLICK, this, this.sendAwardAfterWatchVideo);
    }

    //2020.7.13-4
    private weCatGotToNextLevel() {
        this.successfulEntryThreeNextLevel();
    }

    //2020.7.13-4
    private operResGotoNextLevelAni() {
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            if (BaseConst.infos.gameInfo.openPsAward == 1) {
                this.box_nextLevel.bottom = this.nBtNextLevelSp;
                MiniManeger.instance.bFlagSpecialView = false;
                MiniManeger.instance.hideBanner();
                //一秒后显示binner
                Laya.timer.once(1000, this, () => {
                    MiniManeger.instance.bFlagSpecialView = true;
                    MiniManeger.instance.showBannerAd();
                    //按钮滑动动制定位置
                    Laya.Tween.to(this.box_nextLevel, { bottom: this.nBtNextLevel }, 500, null);
                })
                return;
            } else {
                this.box_nextLevel.bottom = this.nBtNextLevel;
            }
        }
        MiniManeger.instance.showBannerAd();
    }

    private onDoubleGlod() {
        SoundManager.getInstance().playEffect("button", 1);
        this.spDouble.visible = !this.spDouble.visible;
        if (!this.spDouble.visible) {
            let nReal = this.nGlodAdd * this.nGlodRadio;
            BitmapLabelUtils.setLabel(this.spGlodAdd, nReal.toString(), "resource/assets/img/ui/success/succeed_number1/succeed_number1_", 0, ".png", "left");
        } else {
            BitmapLabelUtils.setLabel(this.spGlodAdd, this.nGlodAdd.toString(), "resource/assets/img/ui/success/succeed_number1/succeed_number1_", 0, ".png", "left");
        }
    }

    /**分享 */
    private successShareGame() {
        SoundManager.getInstance().playEffect("button", 1);
        let self = this;
        // if (DeviceUtil.isTTMiniGame()) {
        //     let info = platform.getSystemInfoSync() as any;
        //     if (info.appName.toUpperCase() == 'DOUYIN') {
        //         MiniManeger.instance.bFlagDouYin = true;
        //         MiniManeger.instance.shareAppMessage({
        //             sucFun: () => {
        //                 console.log("发布录制视频成功");
        //                 TipsManager.getInstance().showDefaultTips('分享成功');
        //                 if (MiniManeger.instance.onShareVideoSuccess) {
        //                     return;
        //                 }
        //                 let nGlodCount = 50;
        //                 let stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(18);
        //                 if (stGameConfig) {
        //                     nGlodCount = parseInt(stGameConfig.strValue);
        //                 }
        //                 PlayerDataManager.getInstance().AddGoods(GoodsType.enum_GoodsType_Glod, nGlodCount);
        //                 MiniManeger.instance.onShareVideoSuccess = true;
        //                 Laya.timer.once(1000, self, () => {
        //                     self.flayGlodRecv();
        //                 })
        //             },
        //             failFun: () => {
        //                 console.log("发布录制视频失败");
        //                 TipsManager.getInstance().showDefaultTips('分享失败');
        //             }
        //         });
        //     } else {
        //         MiniManeger.instance.onShareVideo({
        //             successFun: () => {
        //                 console.log("发布录制视频成功");
        //                 if (MiniManeger.instance.onShareVideoSuccess) {
        //                     return;
        //                 }
        //                 let nGlodCount = 50;
        //                 let stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(18);
        //                 if (stGameConfig) {
        //                     nGlodCount = parseInt(stGameConfig.strValue);
        //                 }
        //                 PlayerDataManager.getInstance().AddGoods(GoodsType.enum_GoodsType_Glod, nGlodCount);
        //                 MiniManeger.instance.onShareVideoSuccess = true;
        //                 this.flayGlodRecv();
        //             },
        //             failFun: () => {
        //                 console.log("发布录制视频失败");
        //             }
        //         });
        //     }
        // } else {
        //     MiniManeger.instance.shareAppMessage();
        // }
        MiniManeger.instance.bFlagDouYin = false;
        if (DeviceUtil.isWXMiniGame() && BaseConst.infos.gameInfo.isDY) {
            MiniManeger.instance.shareAppMessage({
                sucFun: () => {
                    ViewManager.getInstance().showView(MoreGameOperRequest);
                },
                failFun: () => {
                    ViewManager.getInstance().showView(MoreGameOperRequest);
                }
            });
        } else {
            MiniManeger.instance.shareAppMessage();
        }
    }

    /**重新开始 */
    private successReStart() {
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
        //扣除体力
        PlayerDataManager.getInstance().subGoods(GoodsType.enum_GoodsType_Sp, nSpCost);
        //重新开始游戏
        ViewChangeManager.getInstance().restartGame(true);
        //2020.7.13-4
        MiniManeger.instance.bFlagSpecialView = true;
        this.removeSelf();
    }

    private isShowBox: boolean = false;
    /**接受奖励 */
    private successRecvAward() {
        let self = this
        SoundManager.getInstance().playEffect("button", 1);
        if (DeviceUtil.isQQMiniGame() && !self.isShowBox && Math.random() < BaseConst.infos.gameInfo.succShowBox) {//qq 开关有开启结算弹起盒子广告
            MiniManeger.instance.showBoxAd(() => {
                self.isShowBox = true;
            });
            return;
        }

        if (this.bRecvAward) {  //体力不足的情况才会领取了奖励还在当前界面
            //领完奖励执行切换到下一关的逻辑
            this.successfulEntryThreeNextLevel();
            return;
        }

        if (!this.spDouble.visible) {
            this.imageRecv.off(Laya.Event.CLICK, this, this.successRecvAward);
            MiniManeger.instance.playViderAd({
                successFun: () => {
                    this.sendAwardAfterWatchVideo();
                    this.imageRecv.on(Laya.Event.CLICK, this, this.successRecvAward);
                },
                failFun: () => {
                    this.imageRecv.on(Laya.Event.CLICK, this, this.successRecvAward);
                },
                errorFun: () => {
                    this.imageRecv.on(Laya.Event.CLICK, this, this.successRecvAward);
                }
            });
        } else {
            this.nGlodRadio = 1;
            this.sendAwardAfterWatchVideo();
        }
    }

    /**看视频成功后获得奖励 */
    private sendAwardAfterWatchVideo() {
        this.bRecvAward = true;
        this.flayGlodSuccess();
        //2020.7.13
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.nGlodRadio = 1;
        }
        let nGlodAddTemp = this.nGlodAdd * this.nGlodRadio;
        PlayerDataManager.getInstance().AddGoods(GoodsType.enum_GoodsType_Glod, nGlodAddTemp);
        //领完奖励执行切换到下一关的逻辑
        this.successfulEntryThreeNextLevel();
    }

    /**下一关 */
    //2020.7.13-5
    private nCountGoToLevel: number = 0;
    private successfulEntryThreeNextLevel() {
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
                AddPsView.bShowMoreGame = true;
                ViewManager.getInstance().showView(AddPsView);
                ViewChangeManager.getInstance().hideBufferLoadingView();
            });
            return;
        } else {
            this.removeEvent();
            //2020.7.13-1-1
            if (MiniManeger.instance.isWxMiniGameForOperReq()) {
                //2020.7.13-5
                //5、新玩家通关第1关过关，过关页—随机盒子继续游戏—进入下一关。
                if (LevelManager.getInstance().nCurLevel == 1) {
                    if (!this.bRecvAward) {
                        Laya.timer.once(1000, this, () => {
                            MoreGameOperRequest.bGotoNextGame = true;
                            ViewManager.getInstance().showView(MoreGameOperRequest);
                            //2020.7.13-4
                            MiniManeger.instance.bFlagSpecialView = true;
                            this.removeSelf();
                        });
                    } else {
                        MoreGameOperRequest.bGotoNextGame = true;
                        ViewManager.getInstance().showView(MoreGameOperRequest);
                        //2020.7.13-4
                        MiniManeger.instance.bFlagSpecialView = true;
                        this.removeSelf();
                    }
                } else if (LevelManager.getInstance().nCurLevel >= 2) { //6、玩家进入第2关过关后， 过关页—随机盒子—热门推荐盒子页—进入下一关。
                    MoreGameOperRequest.bGotoNextGame = true;
                    MoreGameOperRequest.bEnterHotBox = true;
                    ViewManager.getInstance().showView(MoreGameOperRequest);
                    //2020.7.13-4
                    MiniManeger.instance.bFlagSpecialView = true;
                    this.removeSelf();
                }

            } else {
                //扣除体力
                PlayerDataManager.getInstance().subGoods(GoodsType.enum_GoodsType_Sp, nSpCost);
                ViewChangeManager.getInstance().goToNextLevel();
                //2020.7.13-4
                MiniManeger.instance.bFlagSpecialView = true;
                this.removeSelf();
            }
        }
    }

    /**返回主页 */
    private returnToGameHome() {
        SoundManager.getInstance().playEffect("button", 1);
        //
        // if (DeviceUtil.isWXMiniGame()) {
        //     MoreGameOperRequest.toHome = true;
        //     ViewManager.getInstance().showView(MoreGameOperRequest);
        //     this.removeSelf();
        //     return
        // }

        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            if (PlayerDataManager.getInstance().bIsNewPlayer || BaseConst.infos.gameInfo.openPsAward == 0 ||
                BaseConst.infos.gameInfo.glodegg == 0) {
                MoreGameOperRequest.toHome = true;
                ViewManager.getInstance().showView(MoreGameOperRequest);
                //2020.7.13-4
                MiniManeger.instance.bFlagSpecialView = true;
                this.removeSelf();

            }else{
                 //进入主页
                 ViewChangeManager.getInstance().CurLevelBase.closeGameView();
                 PlayerDataManager.getInstance().setCurLevel(PlayerDataManager.getInstance().getCurLevelMax());
                 GameStateManager.getInstance().levelState = EnterGameType.enum_EnterGameType_GameHome;
                 LevelManager.getInstance().createLevelScene(PlayerDataManager.getInstance().getCurLevelToChallenge());
                 //2020.7.13-4
                 MiniManeger.instance.bFlagSpecialView = true;
                 this.removeSelf();
                 //ViewChangeManager.getInstance().restartEnterGameHome();
            }
            return;
        }

        ViewChangeManager.getInstance().CurLevelBase.closeGameView();
        PlayerDataManager.getInstance().setCurLevel(PlayerDataManager.getInstance().getCurLevelMax());
        GameStateManager.getInstance().levelState = EnterGameType.enum_EnterGameType_GameHome;
        LevelManager.getInstance().createLevelScene(PlayerDataManager.getInstance().getCurLevelToChallenge());
        //2020.7.13-4
        MiniManeger.instance.bFlagSpecialView = true;
        this.removeSelf();
    }

    private startSuccessImageBtShareAni() {
        if (!this.bIsRunning) {
            return;
        }
        Laya.Tween.clearAll(this.imageRecv);
        Laya.Tween.to(this.imageRecv, { scaleX: 1.1, scaleY: 1.1 }, 300, Laya.Ease.sineOut, Laya.Handler.create(this, (args) => {
            Laya.Tween.to(this.imageRecv, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.sineOut, Laya.Handler.create(this, (args) => {
                Laya.timer.once(0, this, this.startSuccessImageBtShareAni);
            }));
        }));
    }

    /**飞金币 */
    private flayGlodSuccess() {
        let stPoint = new Laya.Point();
        stPoint.x = this.imageGoodsTypeUp.x;
        stPoint.y = this.imageGoodsTypeUp.y;
        let stBoxParent = this.imageGoodsTypeUp.parent as Laya.Box;
        stPoint = stBoxParent.localToGlobal(stPoint);
        AnimationManager.instance.flayGlod(stPoint.x, stPoint.y, 341, 105);
    }

    public async  createSkeleton(url: string): Promise<Laya.Skeleton> {
        return new Promise<Laya.Skeleton>((resolve) => {
            AnimationManager.instance.showSkeletonAnimation(url, (boomAnimation: Laya.Skeleton) => {
                this.aniReal = boomAnimation;
                this.aniReal.player.playbackRate = 1;
                this.aniReal.autoSize = true;
                this.aniReal.scale(1, 1);
                this.aniReal.play(0, false);
                this.aniReal.x = this.grp_center.width / 2;
                this.aniReal.y = this.grp_center.height / 2;
                this.grp_center.addChild(this.aniReal);
                resolve(boomAnimation)
            }, 1);
        });
    }

    /**头条的特殊界面初始化 */
    private initPlView() {
        if (DeviceUtil.isTTMiniGame()) {
            // this.imageShareGameName.skin = "resource/assets/img/ui/success/failure_word_8.png";
            // this.imageShareIcon.skin = "resource/assets/img/common/succeed_icon_3.png";
            // this.imageShareGameName.y = 15;
            // this.shareGlodCount.visible = true;
            // this.ttGoodsType.visible = true;
            // this.ttSpecial.visible = true;
            /**刷新分享的金币 */
            // let nGlodCount = 50;
            // let stGameConfig = ConfigManager.getInstance().getGameConfigDataByID(18);
            // if(stGameConfig){
            //     nGlodCount = parseInt(stGameConfig.strValue)
            // }
            // BitmapLabelUtils.setLabel(this.shareGlodCount, nGlodCount.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");
            this.imageShareGameName.skin = "resource/assets/img/ui/success/failure_word_2.png";
            this.imageShareIcon.skin = "resource/assets/img/common/common_icon_3.png";
            this.shareGlodCount.visible = false;
            this.ttGoodsType.visible = false;
            this.ttSpecial.visible = false;
            this.imageShareGameName.y = 38;
        } else {
            this.imageShareGameName.skin = "resource/assets/img/ui/success/failure_word_2.png";
            this.imageShareIcon.skin = "resource/assets/img/common/common_icon_3.png";
            this.shareGlodCount.visible = false;
            this.ttGoodsType.visible = false;
            this.ttSpecial.visible = false;
            this.imageShareGameName.y = 38;
        }
        //2020.7.13-4
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.imageWeCatMoreGame.visible = false;
            this.btNextLevel.visible = false;
            this.imageRecv.visible = false;
            this.imageBtShare.visible = false;
            this.box_nextLevel.visible = true;
            this.spDouble.visible = true;
            this.box_wecat.visible = true;
            this.box_lable.visible = false;
        }
    }

    /**看视频领奖非金币的动画 */
    private flayGlodRecv() {
        console.log("flayGlodRecv");
        let pPoint = new Laya.Point();
        pPoint.x = this.ttGoodsType.x;
        pPoint.y = this.ttGoodsType.y;
        let stParent = this.ttGoodsType.parent as Laya.Image;
        pPoint = stParent.localToGlobal(pPoint);
        AnimationManager.instance.flayGlod(pPoint.x, pPoint.y, 341, 105);
    }

    /**控制更多游戏的函数 */
    private proceMoreGame() {
        //微信平台
        if (DeviceUtil.isTTMiniGame()) {
            this.refreshTTMoreGame();
            this.imageWeCatMoreGame.visible = true;
            //2020.7.13-4
        } else if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.refreshWeCatMoreGame();
        }

        //TO DO  其他平台
        //……
    }
    ////2020.7.13-4
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

    /**头条运营需求初始化 */
    private refreshTTMoreGame() {
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
        aryInfo = this.getRandomIndex_num(6);

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

    /**运营要改成随机6个游戏 */
    //2020.7.13-4
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
}