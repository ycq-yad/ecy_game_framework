import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene24 extends LevelBase {
    className_key = "LevelScene24";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene24.json";
    }

    public onAddStage() {
        super.onAddStage();
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public initView() {
        super.initView();
        this.stopAni();
    }

    /**
     * 当从父节点移除时候
     */
    public onRemoved() {
        super.onRemoved();
        this.stopAni();
    }

    //火把
    private skHuoBao: Laya.Skeleton;
    public box_huoba: Laya.Box;
    //老鼠
    private skLaoShu: Laya.Skeleton;
    public box_laoshu: Laya.Box;
    //雨
    private skYuDi: Laya.Skeleton;
    public box_yudi: Laya.Box;
    //雪人
    private skXueRen: Laya.Skeleton;
    public box_xueren: Laya.Box;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        //火把
        this.skHuoBao = await this.createSkeleton(this.mapData.huoba.ani.url);
        this.skHuoBao.x = this.mapData.huoba.ani.x;
        this.skHuoBao.y = this.mapData.huoba.ani.y;
        this.box_huoba.addChild(this.skHuoBao);
        this.box_huoba.visible = false;

        //老鼠
        this.skLaoShu = await this.createSkeleton(this.mapData.laoshu.url);
        this.skLaoShu.x = this.mapData.laoshu.x;
        this.skLaoShu.y = this.mapData.laoshu.y;
        this.box_laoshu.addChild(this.skLaoShu);
        this.box_laoshu.visible = false;

        //雨
        this.skYuDi = await this.createSkeleton(this.mapData.yudi.url);
        this.skYuDi.x = this.mapData.yudi.x;
        this.skYuDi.y = this.mapData.yudi.y;
        this.skYuDi.play("keng", true);
        this.box_yudi.addChild(this.skYuDi);

        //雪人
        this.skXueRen = await this.createSkeleton(this.mapData.xueren.url);
        this.skXueRen.x = this.mapData.xueren.x;
        this.skXueRen.y = this.mapData.xueren.y;
        this.skXueRen.play("daiji1", true);
        this.box_xueren.addChild(this.skXueRen);
        this.box_xueren.visible = true;
        //人物
        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;
        
        this.box_player.x = (this.index) * 1080;
        this.box_game.x = (this.index) * 1080;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }
    public callBack(right: boolean, aniName: string){
        if (aniName == "24-9") {
            this.box_xueren.visible = false;
        }
        super.callBack(right, aniName);
    }
 
    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        console.log("now event name is:  ", evt.name)
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -(1080) }, 3500);
                Laya.Tween.to(this.box_player, { x: (1080) }, 3500);
                break;
            case "sevent_laoshu_1":
                this.box_laoshu.visible = true;
                this.skLaoShu.play("laoshu", true);
                this.box_laoshu.x = this.box_player.x - Laya.stage.width/2 - 40;
                Laya.Tween.to(this.box_laoshu, { x: (1080 + this.box_player.x) }, 2000, null, Laya.Handler.create(null, ()=>{this.box_laoshu.visible = false}));
                break;
            case "smove1":
                Laya.Tween.to(this.box_game, { x: -2800 }, 4200);
                Laya.Tween.to(this.box_player, { x: 2800 }, 4200);
                break;
            case "sevent_yun_1":
                this.skYuDi.play("yun", false);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -4571 }, 5800);
                Laya.Tween.to(this.box_player, { x: 4571 }, 5800);
                break;
            case "sevent_huo_1":
                this.box_huoba.visible = true;
                this.skHuoBao.play("huo", true);
                break;
            case "smove3":
                Laya.Tween.to(this.box_player, { x: 4571 + 1080 }, 3000);
                break;
            case "sevent_bianxiao_1":   // 雪人融化
                this.skXueRen.play("bianxiao", false);
                break;
        }

    }

    /**游戏逻辑控制 */
    public startGame() {
        this.clearData();
        super.startGame();
        this.initPlayer();
    }

    /**停止游戏 */
    public stopGame() {}

    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        if (bReStartAll) {
            this.initView();
            super.startGame();
            this.initPlayer();
        } else {
            super.restartGame();
            if (this.index == 0) {
                this.box_player.x = (this.index) * 1080;
                this.box_game.x = (this.index) * 1080;
            } else if (this.index == 2) {
                this.box_xueren.visible = true;
                this.skXueRen.play("daiji1", true);
            }
            this.onStart();
        }
    }

    /**清理动画 */
    public clearData() {
        super.clearData();
        this.box_huoba.removeChildren();
        this.box_yudi.removeChildren();
        this.box_laoshu.removeChildren();
        this.box_xueren.removeChildren();
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
    }
}