import { GameData } from "../../../common/GameData";
import MoreGameItemView from "./MoreGameItemView";
import SuccessfulEntryThreeView from "../SuccessfulEntryThreeView";
import FailEntryTwoView from "../FailEntryTwoView";
import ViewChangeManager from "../../../games/ViewChangeManager";
import PlatformDY from "../../../../PlatformDY";
import { MiniManeger } from "../../../minigame/MiniManeger";

export default class MoreGameView extends BaseSceneUISkinPopView {
    public className_key = "MoreGameView";
    constructor() {
        super();
        this.skin = "game/uiView/MoreGameView.json";
    }

    public ITEM_H: number = 200;
    public panel: Laya.Panel;
    public tlabel: Laya.Label;
    public baokuanImg: Laya.Image;
    public image_back: Laya.Image;
    public static bSuccess: boolean = false;
    public static bSpeical: boolean = false;

    protected createChildren(): void {
        super.createChildren();
    }

    protected childrenCreated(): void {
        super.childrenCreated();
    }

    onAddStage(): void {
        this.initView();
        this.addEvent();
        ViewChangeManager.getInstance().hideCommonView();
        MiniManeger.instance.hideBanner();
        //2020-7-13
        MiniManeger.instance.bFlagSpecialView = false;
        ViewChangeManager.getInstance().hideImageExitTemp();
    }

    onRemoved() {
        this.removeEvent();
        this.panel.removeChildren();
        Laya.timer.clearAll(this);
        ViewChangeManager.getInstance().showImageExitTemp();
    }

    private addEvent() {
        //this.btnHome.on(Laya.Event.CLICK, this, this.levelViewReturnToHome);
        this.panel.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        this.panel.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.panel.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        this.image_back.on(Laya.Event.CLICK, this, this.onBack);
    }

    private removeEvent() {
        //this.btnHome.off(Laya.Event.CLICK, this, this.levelViewReturnToHome);
        this.panel.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        this.panel.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.panel.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        this.image_back.off(Laya.Event.CLICK, this, this.onBack);
    }

    private onBack() {
        //ViewChangeManager.getInstance().CommonView.visible = true;
        if(!MoreGameView.bSpeical){
            if (MoreGameView.bSuccess) {
                ViewManager.getInstance().showView(SuccessfulEntryThreeView);
            } else {
                ViewManager.getInstance().showView(FailEntryTwoView);
            }
        }
        this.removeSelf();
         //2020-7-13
         MiniManeger.instance.bFlagSpecialView = true;
         MoreGameView.bSpeical = false;
    }

    public isAuto: boolean = true;
    private stx: number;
    private sty: number;

    private mouseDown(e: Laya.Event): void {
        this.isAuto = false;
        //记录起始点
        this.stx = e.stageX;
        this.sty = e.stageY;
    }

    private mouseMove(e: Laya.Event): void {
        let dy: number = e.stageY - this.sty;
        for (let i: number = 0; i < this.panel.numChildren; i++) {
            let item: MoreGameItemView = this.panel.getChildAt(i) as MoreGameItemView;
            item.y += dy;
        }
        this.sty = e.stageY;
        this.dir = dy > 0 ? 1 : -1;
        this.refresh();
    }
    private mouseUp(e: Laya.Event): void {
        this.isAuto = true;
        this.dir = -1;
    }


    private initView() {
        //添加定时器
        Laya.timer.frameLoop(1, this, this.updata);
        let canuseHeight: number = Laya.stage.height - 280;
        this.maxCount = Math.ceil(canuseHeight / this.ITEM_H);
        //this.panel.bottom = canuseHeight - this.maxCount * this.ITEM_H;
        this.dataArr = GameData.getInstance().weCatMiniIconsInfo;
        console.log(GameData.getInstance().weCatMiniIconsInfo);
        //初始化条目
        let didnex: number = 0;
        for (let i: number = 0; i < this.maxCount + 1; i++) {
            let item: MoreGameItemView = new MoreGameItemView();
            item.index = didnex;
            item.setData(this.dataArr[item.index]);
            didnex++;
            if (didnex >= this.dataArr.length) {
                didnex = 0;
            }
            item.y = i * this.ITEM_H;
            this.panel.addChild(item);
        }
        //2020.6.2运营需求  每次使用后刷新下游戏列表
        if (BaseConst.infos.gameInfo.isDY) {
            PlatformDY.refreshGameList();
        }
    }

    public dataArr: Array<any> = [{ t: 0 }, { t: 1 }, { t: 2 }, { t: 3 }];
    public speed: number = 2;
    public dir: number = -1;

    public getUpIndexforCurIndex(index: number): number {
        if (index >= this.dataArr.length || index < 0) return 0;
        return index - 1 >= 0 ? index - 1 : this.dataArr.length - 1;
    }

    public getDownIndexforCurIndex(index: number): number {
        if (index >= this.dataArr.length || index < 0) return 0;
        return index + 1 < this.dataArr.length ? index + 1 : 0;
    }

    public updata(dt): void {
        if (!this.isAuto) return;
        for (let i: number = 0; i < this.panel.numChildren; i++) {
            let item: MoreGameItemView = this.panel.getChildAt(i) as MoreGameItemView;
            item.y += this.speed * this.dir;
        }
        this.refresh();

    }


    private refresh(): void {
        let startItem: MoreGameItemView;
        let lastItem: MoreGameItemView;
        startItem = this.panel.getChildAt(0) as MoreGameItemView;
        lastItem = this.panel.getChildAt(this.maxCount) as MoreGameItemView;
        if (this.dir == -1)//向上
        {
            if (startItem.y < -this.ITEM_H) {
                startItem.y = lastItem.y + lastItem.height;
                startItem.zOrder = lastItem.zOrder + 1;
                startItem.index = this.getDownIndexforCurIndex(lastItem.index);
                startItem.refreshData(this.dataArr[startItem.index]);

                console.log('idnex-=======>', startItem.index);
            }
        }
        else//向下
        {
            if (lastItem.y > this.maxCount * this.ITEM_H) {
                lastItem.y = startItem.y - startItem.height;
                lastItem.zOrder = startItem.zOrder - 1;
                lastItem.index = this.getUpIndexforCurIndex(startItem.index);
                lastItem.refreshData(this.dataArr[lastItem.index]);
            }
        }
    }

    public maxCount: number;


}