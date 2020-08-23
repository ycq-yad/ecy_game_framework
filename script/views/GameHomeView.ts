import ViewChangeManager from "../games/ViewChangeManager";
import { PlayerDataManager } from "../common/GameDataManager";
import LevelView from "./game/LevelView";
import SignView from "./game/SignView";
import ConfigManager from "../games/ConfigManager";
import GameEvent from "../games/GameEvent";
import AddPsView from "./game/AddPsView";
import { GoodsType } from "../games/CommonDefine";
import SoundManager from "../common/SoundManager";
import InviteView from "./game/invite/InviteView";
import { MiniManeger } from "../minigame/MiniManeger";
import SkinView from "./game/SkinView";
import FailEntryTwoView from "./game/FailEntryTwoView";
import SuccessfulEntryThreeView from "./game/SuccessfulEntryThreeView";
import { GameData } from "../common/GameData";
import WeCatMoreGameItemTwo from "./game/WeCatMoreGameItemTwo";
import WeCatMoreGameView from "./game/WeCatMoreGameView";
import MoreGameOperRequest from "./game/MoreGameOperRequest";
import MiniEventConst from "../minigame/MiniEventConst";
import MoreGameOperRequestTwo from "./game/MoreGameOperRequestTwo";
import VentonesangerView from "./game/VentonesangerView";
import SuccessfulEntryOneViewTwo from "./game/SuccessfulEntryOneViewTwo";
import SuccessfulEntryOneView from "./game/SuccessfulEntryOneView";
import MoreGameView from "./game/moregame/MoreGameView";
import FailEntryOneView from "./game/FailEntryOneView";
import { LotteryScene } from "./game/lottery/LotteryScene";
import GuessLike from "./game/GuessLike";

export default class GameHomeView extends BaseSceneUISkin {
    className_key = "GameHomeView";

    public spNum: Laya.Sprite;
    public imageSpFull: Laya.Image;
    public imageBtAttSp: Laya.Image;
    public glodNum: Laya.Sprite;
    public imageBtGoldAdd: Laya.Image;
    public imageBtStartGame: Laya.Image;
    public imageBtFreeSkin: Laya.Image;
    public imageFreeSkin: Laya.Image;
    public imageBtShare: Laya.Image;
    public imageBtChoseLevel: Laya.Image;
    public imageBtSign: Laya.Image;
    public imageBtInvital: Laya.Image;
    public boxLevel: Laya.Box;
    public spLevelNum: Laya.Sprite;
    public stLableTime: Laya.Label;
    public boxFun: Laya.Box;
    public btn_more: Laya.Sprite;
    public imageWeCatMoreGame: Laya.Image;
    public more_games: Laya.Sprite;
    public back_btn: Laya.Sprite;

    //2020.7.13-2
    public imageRed: Laya.Image;

    /**数据控制 */
    private bIsRunning: boolean;
    private bWeCatShow: boolean;


    private btn_lottery: Laya.Button;

    private btn_colorSign: Laya.Button;

    private guessLike: GuessLike;//推广位

    constructor() {
        super();
        this.skin = "game/GameHomeView.json";
        this.bIsRunning = false;
        this.bWeCatShow = false;
    }
    protected childrenCreated(): void {
        super.childrenCreated();
        this.btn_more.visible = false;
        if (DeviceUtil.isQQMiniGame() || DeviceUtil.isTTMiniGame()) {
            this.btn_more.visible = true;
            this.more_games.visible = this.back_btn.visible = false;
        }
        if (MiniManeger.instance.isWxMiniGameForOperReq()) {
            this.imageWeCatMoreGame.visible = true;
            this.more_games.visible = true;
            //this.back_btn.visible = true;
            //(this.getChildByName("imageHead") as Laya.Image).skin = "resource/assets/preloading/loading_logo_wx.png";
            (this.getChildByName("imageHead") as Laya.Image).visible = false;
        }

        let self = this;
        if (!self.guessLike && MiniManeger.instance.isWxMiniGameForOperReq() && BaseConst.infos.gameInfo.openPsAward == 1) {//微信需要增加滑动推荐
            MiniManeger.instance.createGuessLike(self).then((guessLike) => {
                if (!guessLike) {
                    return;
                }
                self.guessLike = guessLike;
                self.guessLike.x = (Laya.stage.width - self.guessLike.width) / 2;
                self.guessLike.y = 300;
            });
        }
    }

    private bEnterGameHomeNotNewPlayer: boolean = false;
    onAddStage(): void {
        MiniManeger.instance.showBannerAd();
        this.bIsRunning = true;
        this.startGameAni();
        this.initView();
        //this.addEvent();
        //MiniManeger.instance.showInterstitialAd();
        //this.imageWeCatMoreGame.visible = true;
        //if(!this.bEnterGameHomeNotNewPlayer){
        ViewChangeManager.getInstance().restartEnterGameHome();
        //this.bEnterGameHomeNotNewPlayer = true;
        //}
    }

    public onRemoved() {
        this.bIsRunning = false;
        super.onRemoved();
        this.removeEvent();
        Laya.Tween.clearAll(this.imageBtStartGame);

    }
    private onColorSign() {
        MiniManeger.instance.addColorSign({
            success: (res) => {
                console.log(res);
                this.btn_colorSign.visible = false;

            }
        })
    }

    private onLottery() {
        SoundManager.getInstance().playEffect("button", 1);
        ViewChangeManager.getInstance().showBufferLoadingView();
        ResUtil.getIntance().loadGroups(["lottery"], async () => {
            if (DeviceUtil.isQQMiniGame()) {
                if (GameData.getInstance().isNewPlayer && GameData.getInstance().gameQQInfo.lotterHomeOpenVideo) {
                    MiniManeger.instance.playViderAd({
                        successFun: () => {
                            GameData.getInstance().gameQQInfo.lotterHomeOpenVideo = false
                        }
                    })
                }
            }
            ViewManager.getInstance().showView(LotteryScene);
            ViewChangeManager.getInstance().hideBufferLoadingView();
        });
    }
    private addEvent() {
        this.btn_lottery.on(Laya.Event.CLICK, this, this.onLottery);
        this.btn_colorSign.on(Laya.Event.CLICK, this, this.onColorSign);
        this.imageBtStartGame.on(Laya.Event.CLICK, this, this.gameHomeStartGame);
        this.btn_more.on(Laya.Event.CLICK, this, this.onMoreGame);
        this.imageBtChoseLevel.on(Laya.Event.CLICK, this, this.openLevelView);
        this.imageBtSign.on(Laya.Event.CLICK, this, this.openSignView);
        this.imageBtShare.on(Laya.Event.CLICK, this, this.onGameHomeShare);
        this.imageBtInvital.on(Laya.Event.CLICK, this, this.onInvite);
        //this.imageBtAttSp.on(Laya.Event.CLICK,this,this.openAddSpAddSp);
        this.imageBtFreeSkin.on(Laya.Event.CLICK, this, this.onGetFreeSkin);
        this.imageWeCatMoreGame.on(Laya.Event.CLICK, this, this.weCatViewOper);
        this.more_games.on(Laya.Event.CLICK, this, this.wxShowMoreGame);
        this.back_btn.on(Laya.Event.CLICK, this, this.wxShowMoreGame);
    }

    private onMoreGame(): void {
        if (DeviceUtil.isQQMiniGame()) {
            MiniManeger.instance.showBoxAd();
        } else if (DeviceUtil.isTTMiniGame()) {
            MiniManeger.instance.showMoreGamesModal();
        }
    }

    /**
     * 显示更多游戏
     */
    private wxShowMoreGame(): void {
        ViewManager.getInstance().showView(MoreGameOperRequestTwo);
    }

    private removeEvent() {
        this.btn_lottery.off(Laya.Event.CLICK, this, this.onLottery);
        this.btn_colorSign.off(Laya.Event.CLICK, this, this.onColorSign);
        this.imageBtStartGame.off(Laya.Event.CLICK, this, this.gameHomeStartGame);
        this.btn_more.off(Laya.Event.CLICK, this, this.onMoreGame);
        this.imageBtChoseLevel.off(Laya.Event.CLICK, this, this.openLevelView);
        this.imageBtSign.off(Laya.Event.CLICK, this, this.openSignView);
        this.imageBtShare.off(Laya.Event.CLICK, this, this.onGameHomeShare);
        this.imageBtInvital.off(Laya.Event.CLICK, this, this.onInvite);
        //this.imageBtAttSp.off(Laya.Event.CLICK,this,this.openAddSp);
        this.imageBtFreeSkin.off(Laya.Event.CLICK, this, this.onGetFreeSkin);
        this.imageWeCatMoreGame.off(Laya.Event.CLICK, this, this.weCatViewOper);
        this.more_games.off(Laya.Event.CLICK, this, this.wxShowMoreGame);
        this.back_btn.off(Laya.Event.CLICK, this, this.wxShowMoreGame);
    }

    /**开始游戏 */
    private gameHomeStartGame() {
        SoundManager.getInstance().playEffect("button", 1);
        //ViewChangeManager.getInstance().getCommonView().removeSelf();
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

        //为了头条的提审 隐藏binner可能会有延迟 
        if (DeviceUtil.isTTMiniGame()) {
            MiniManeger.instance.hideBanner();
        }
        //开始游戏
        //2020.7.13-2-4
        // if (MiniManeger.instance.isWxMiniGameForOperReq()
        //     && PlayerDataManager.getInstance().isSecondEnterGame()
        //     && BaseConst.infos.gameInfo.openPsAward == 1) {
        //     this.wxOper71324();
        // } else {
        //2020.7.13-1-1
        this.enterOper();
        //}
        this.removeSelf();
    }

    //2020.7.13-1-1
    private enterOper() {
        //2020.7.13-1-1  1.从第4关后，每关开始游戏都会弹砸金蛋误点。
        if (MiniManeger.instance.isWxMiniGameForOperReq()
            && PlayerDataManager.getInstance().getCurLevel() >= BaseConst.infos.gameInfo.splevel
            && BaseConst.infos.gameInfo.openPsAward == 1) {
            // PlayerDataManager.getInstance().bEnterGameFromGameHome = true;
            // ViewManager.getInstance().showView(SuccessfulEntryOneView);
            ViewChangeManager.getInstance().CurLevelBase.startGame();
        } else {
            ViewChangeManager.getInstance().CurLevelBase.startGame();
        }
    }

    //2020.7.13-2-4
    private wxOper71324() {
        if (!MiniManeger.instance.isWxMiniGameForOperReq()) {
            return;
        }
        if (!PlayerDataManager.getInstance().isSecondEnterGame()) {
            return;
        }
        //删除事件
        this.removeEvent();
        MiniManeger.instance.playViderAd({
            successFun: () => {
                this.enterOper();
            },
            failFun: () => {
                this.enterOper();
            },
            errorFun: () => {
                this.enterOper();
            }
        });
    }


    /**初始化界面 */
    private initView() {
        this.PlInitView();
        this.showSignView();
        BitmapLabelUtils.setLabel(this.spLevelNum, PlayerDataManager.getInstance().getLevelToChangeMaxLevel().toString(), "resource/assets/img/ui/gamehome/maininterface_number1/maininterface_number1_", 0, ".png", "center");
        // this.addChild(ViewChangeManager.getInstance().getCommonView());

        if (DeviceUtil.isQQMiniGame()) {
            this.btn_lottery.visible = true;
            let flag = MiniManeger.instance.isColorSignExistSync();
            if (!flag) {//可以显示
                this.btn_colorSign.visible = true;
            } else {//不可以显示
                this.btn_colorSign.visible = false;

            }
        }
        if (BaseConst.infos.gameInfo.openPsAward == 0) {
            this.btn_lottery.visible = false;
        }
    }

    /**打开选关界面 */
    private openLevelView() {
        // //测试---------------
        // ViewChangeManager.getInstance().showBufferLoadingView();
        // ViewChangeManager.getInstance().hideCommonView();
        // ResUtil.getIntance().loadGroups(["moregame"], async () => {
        //     ViewManager.getInstance().showView(MoreGameView);
        //     ViewChangeManager.getInstance().hideBufferLoadingView();
        // });  
        // return;
        // //测试---------------


        MiniManeger.instance.reportMonitorSome(MiniEventConst.HOME_LEVEL, 1);
        SoundManager.getInstance().playEffect("button", 1);
        ViewChangeManager.getInstance().showBufferLoadingView();
        ResUtil.getIntance().loadGroups(["levelview"], async () => {
            LevelView.pHomeView = this;
            ViewManager.getInstance().showView(LevelView);
            ViewChangeManager.getInstance().hideBufferLoadingView();
        });

        // ViewManager.getInstance().showView(SuccessfulEntryThreeView);
    }

    /**打开签到界面 */
    private openSignView() {
        MiniManeger.instance.reportMonitorSome(MiniEventConst.HOME_SIGIN, 1);
        SoundManager.getInstance().playEffect("button", 1);
        ViewChangeManager.getInstance().showBufferLoadingView();
        ResUtil.getIntance().loadGroups(["sign"], async () => {
            ViewManager.getInstance().showView(SignView);
            ViewChangeManager.getInstance().hideBufferLoadingView();
        });


        // ViewManager.getInstance().showView(MoreGameOperRequest);
    }

    /**分享 */
    private onGameHomeShare() {
        MiniManeger.instance.reportMonitorSome(MiniEventConst.HOME_SHARE, 1);
        SoundManager.getInstance().playEffect("button", 1);
        MiniManeger.instance.bFlagDouYin = false;
        MiniManeger.instance.shareAppMessage();
        // if (DeviceUtil.isWXMiniGame()) {
        //     ViewManager.getInstance().showView(MoreGameOperRequest);
        // }

        // MiniManeger.instance.shareAppMessage({
        //     sucFun: () => {
        //         console.log("分享成功");
        //         TipsManager.getInstance().showDefaultTips('分享成功');
        //     },
        //     failFun: () => {
        //         console.log("分享失败");
        //         TipsManager.getInstance().showDefaultTips('分享失败');
        //     }
        // });
        //ViewManager.getInstance().showView(SuccessfulEntryOneView);
    }

    private onInvite() {
        MiniManeger.instance.reportMonitorSome(MiniEventConst.HOME_INVATE, 1);
        SoundManager.getInstance().playEffect("button", 1);
        ViewChangeManager.getInstance().showBufferLoadingView();
        ResUtil.getIntance().loadGroups(["invite"], async () => {
            ViewManager.getInstance().showView(InviteView);
            ViewChangeManager.getInstance().hideBufferLoadingView();
        });
    }

    private startGameAni() {
        if (!this.bIsRunning) {
            return;
        }
        Laya.Tween.clearAll(this.imageBtStartGame);
        Laya.Tween.to(this.imageBtStartGame, { scaleX: 1.1, scaleY: 1.1 }, 300, Laya.Ease.sineOut, Laya.Handler.create(this, (args) => {
            Laya.Tween.to(this.imageBtStartGame, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.sineOut, Laya.Handler.create(this, (args) => {
                Laya.timer.once(0, this, this.startGameAni);
            }));
        }));
    }

    /**平台界面的刷新 */
    private PlInitView() {
        if (DeviceUtil.isTTMiniGame()) {
            this.imageBtInvital.visible = false;
            this.boxFun.width = 650;
        }
    }

    /**判断下是否弹出签到 */
    private showSignView() {
        //如果是新玩家 不打开签到界面
        // if (PlayerDataManager.getInstance().isSign()) {
        //     ViewChangeManager.getInstance().showBufferLoadingView();
        //     ResUtil.getIntance().loadGroups(["sign"], async () => {
        //         ViewManager.getInstance().showView(SignView);
        //         ViewChangeManager.getInstance().hideBufferLoadingView();
        //         this.addEvent();
        //     });
        // } else {
        this.addEvent();
        //}
    }

    private onGetFreeSkin() {
        // ViewChangeManager.getInstance().showBufferLoadingView();
        //     ResUtil.getIntance().loadGroups(["skin"], async () => {
        //         ViewManager.getInstance().showView(Sin);
        //         ViewChangeManager.getInstance().hideBufferLoadingView();
        //         this.addEvent();
        //     });
        ViewManager.getInstance().showView(SkinView);
    }

    private weCatViewOper() {
        //2020.6.2 打开盒子2
        //ViewManager.getInstance().showView(MoreGameOperRequestTwo);
        //this.wxShowMoreGame();

        ViewManager.getInstance().showView(WeCatMoreGameView);
    }
}