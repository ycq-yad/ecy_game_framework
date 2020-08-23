import GameEvent from "../../games/GameEvent";
import { PlayerDataManager } from "../../common/GameDataManager";
import ConfigManager from "../../games/ConfigManager";
import AddPsView from "./AddPsView";
import SoundManager from "../../common/SoundManager";
import ViewChangeManager from "../../games/ViewChangeManager";

export default class CommonView extends BaseSceneUISkin {
    public className_key = "CommonView";

    public imageBtToHome: Laya.Image;
    public spNum: Laya.Sprite;
    public imageSpFull: Laya.Image;
    public imageBtAttSp: Laya.Image;
    public stLableTime: Laya.Label;
    public imageBtGoldAdd: Laya.Image;
    public glodNum: Laya.Sprite;
    public sp: Laya.Image;

    constructor() {
        super();
        this.skin = "game/uiView/CommonView.json";
        this.width = 600;
        this.height = 200;
    }

    onAddStage(): void {
        if (!this.isCreate) {
            return
        }
        this.refreshSPValue();
        this.refreshGoldValue();
        this.refreshTimeView();
        this.addEventUpdateView();
        this.refreshPsLimitLess();
    }

    public onRemoved() {
        this.removeEnentUpdateView();
    }

    /**界面数值的属性 */
    /**增加界面数值的刷新 */
    private addEventUpdateView() {
        this.sp.on(Laya.Event.CLICK, this, this.openAddSp);
        EventMgr.getInstance().addEvent(GameEvent.ON_PS_CHANGE, this, this.refreshSPValue);
        EventMgr.getInstance().addEvent(GameEvent.ON_GLOD_CHANGE, this, this.refreshGoldValue);
        EventMgr.getInstance().addEvent(GameEvent.ON_SP_UPDOWN_TIME, this, this.refreshTimeLableInfo);
        EventMgr.getInstance().addEvent(GameEvent.PS_LIMITLESS, this, this.refreshPsLimitLess);
    }

    public addBtEvent() {
        this.imageBtAttSp.visible = true;
        this.sp && this.sp.on(Laya.Event.CLICK, this, this.openAddSp);
    }

    public removeBtEvent() {
        this.imageBtAttSp.visible = false;
        this.sp && this.sp.off(Laya.Event.CLICK, this, this.openAddSp);
    }

    /**删除界面数值的刷新*/
    private removeEnentUpdateView() {
        this.sp.off(Laya.Event.CLICK, this, this.openAddSp);
        EventMgr.getInstance().removeEvent(GameEvent.ON_PS_CHANGE, this, this.refreshSPValue);
        EventMgr.getInstance().removeEvent(GameEvent.ON_GLOD_CHANGE, this, this.refreshGoldValue);
        EventMgr.getInstance().removeEvent(GameEvent.ON_SP_UPDOWN_TIME, this, this.refreshTimeLableInfo);
        EventMgr.getInstance().removeEvent(GameEvent.PS_LIMITLESS, this, this.refreshPsLimitLess)
    }

    /**打开体力不足界面 */
    private openAddSp() {
        SoundManager.getInstance().playEffect("button", 1);

        ViewChangeManager.getInstance().showBufferLoadingView();
        ResUtil.getIntance().loadGroups(["adsp"], async () => {
            ViewManager.getInstance().showView(AddPsView);
            ViewChangeManager.getInstance().hideBufferLoadingView();
        });
    }

    /**刷新体力 */
    private refreshSPValue() {
        if (!this.isCreate) {
            return
        }


        if (PlayerDataManager.getInstance().isPsLimitlessState()) {
            return;
        }

        BitmapLabelUtils.setLabel(this.spNum, PlayerDataManager.getInstance().stPlayerDataBase.nPS.toString(), "resource/assets/img/ui/gamehome/maininterface_number1/maininterface_number1_", 0, ".png", "center");
        this.refreshTimeView();
    }

    /**刷新金币 */
    private refreshGoldValue() {
        if (!this.isCreate) {
            return
        }
        BitmapLabelUtils.setLabel(this.glodNum, PlayerDataManager.getInstance().stPlayerDataBase.nGlodCount.toString(), "resource/assets/img/common/level_number1/level_number1_", 0, ".png", "left");
    }

    /**刷新时间 */
    private refreshTimeView() {
        if(PlayerDataManager.getInstance().isPsLimitlessState()){
            return;
        }
        let nSpTimeMax = 5;
        let stGameData = ConfigManager.getInstance().getGameConfigDataByID(1);
        if (stGameData) {
            nSpTimeMax = parseInt(stGameData.strValue);
        }
        if (nSpTimeMax <= PlayerDataManager.getInstance().stPlayerDataBase.nPS) {
            this.imageSpFull.visible = true;
            this.stLableTime.visible = false;
            this.stLableTime.text = "";
        } else {
            this.imageSpFull.visible = false;
            this.stLableTime.visible = true;
        }
    }

    /**时间的更新 */
    private refreshTimeLableInfo() {
        if(PlayerDataManager.getInstance().isPsLimitlessState()){
            return;
        }
        this.imageSpFull.visible = false;
        this.stLableTime.visible = true;
        this.stLableTime.text = PlayerDataManager.getInstance().getSpLastTime();
    }

    /**进入无限体力状态 */
    public refreshPsLimitLess() {
        if (!PlayerDataManager.getInstance().isPsLimitlessState()) {
            return;
        }
        this.stLableTime.visible = false;
        this.spNum.visible = false;
        this.imageSpFull.visible = true;
        this.imageSpFull.skin = "resource/assets/img/ui/gamehome/maininterface_word_3.png";
        this.sp.skin = "resource/assets/img/ui/gamehome/maininterface_baseboard_1_2.png";
    }

}