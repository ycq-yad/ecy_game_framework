import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene28 extends LevelBase {
    className_key = "LevelScene28";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene28.json";
    }

    public onAddStage() {
        super.onAddStage();
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public box_green: Laya.Box;
    public initView() {
        super.initView();
        this.stopAni();
        this.box_green.visible = false;
    }

    /**
     * 当从父节点移除时候
     */
    public onRemoved() {
        super.onRemoved();
        this.stopAni();
    }

    public dengshen: Laya.Skeleton;
    public qiangdao: Laya.Skeleton;
    public xiayu: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();

        this.dengshen = await this.createSkeleton(this.mapData.dengshen.url);
        this.dengshen.x = this.mapData.dengshen.x;
        this.dengshen.y = this.mapData.dengshen.y;
        this.box_enb.addChild(this.dengshen);
        this.dengshen.visible = false;

        this.xiayu = await this.createSkeleton(this.mapData.xiayu.url);
        this.xiayu.x = this.mapData.xiayu.x;
        this.xiayu.y = this.mapData.xiayu.y;
        this.box_enb.addChild(this.xiayu);
        this.xiayu.visible = false;

        this.qiangdao = await this.createSkeleton(this.mapData.qiangdao.url);
        this.qiangdao.x = this.mapData.qiangdao.x;
        this.qiangdao.y = this.mapData.qiangdao.y;
        this.box_enb.addChild(this.qiangdao);
        this.qiangdao.visible = false;

        //this.ani_player = await this.createSkeleton(this.mapData.player.url);

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

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -(1000) }, 2080);
                Laya.Tween.to(this.box_player, { x: (1000) }, 2080);
                break;
            case "smove1":
                Laya.Tween.to(this.box_game, { x: -(1500) }, 2920);
                Laya.Tween.to(this.box_player, { x: (1500) }, 2920);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(1800) }, 2670);
                Laya.Tween.to(this.box_player, { x: (3000) }, 4000);
                this.qiangdao.visible = false;
                break;
            case "tmove":
                this.box_green.visible = true;
                this.box_green.alpha = 0;
                Laya.Tween.to(this.box_green, { alpha: 1 }, 500);
                break;


            case "sevent_chuxian_1":
                this.dengshen.visible = true;
                this.dengshen.play("chuxian", false);
                break;
            case "sevent_shifa_1":
                this.dengshen.visible = true;
                this.dengshen.play("shifa", false);
                break;
            case "sevent_daiji_1":
                this.dengshen.visible = true;
                this.dengshen.play("daiji", true);
                break;

            case "sevent_xiayu_1":
                this.xiayu.visible = true;
                // this.xiayu.player.once(Laya.Event.STOPPED, this, () => {
                // })
                this.xiayu.play("xiayu", false);
                break;
            case "sevent_shifaxiaoshi_1":
                this.dengshen.visible = true;
                this.dengshen.play("shifaxiaoshi", false);
                break;
            case "sevent_zoulu_1":
                this.qiangdao.visible = true;
                Laya.Tween.to(this.qiangdao, { x: 1850 }, 1000);
                this.qiangdao.play("zoulux", false);
                break;
            case "sevent_daijix_1":
                this.qiangdao.visible = true;
                this.qiangdao.play("daijix", true);
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
    public stopGame() { }

    /**重新开始游戏 */
    public restartGame(bReStartAll: boolean = true) {
        if (bReStartAll) {
            this.initView();
            super.startGame();
            this.initPlayer();
        } else {
            super.restartGame();
            if (this.index == 0) {
                this.box_player.x = this.box_game.x = 0;
            } else if (this.index == 1) {
                this.box_green.visible = false;

                this.box_game.x = -1000;
                this.box_player.x = 1000;
                // this.tianpin.visible = true;
                // this.men.visible = true;
                this.dengshen.play("daiji", true);
            } else if (this.index == 2) {
                this.box_game.x = -1000;
                this.box_player.x = 1000;
                this.dengshen.play("daiji", true);
                this.qiangdao.x = this.mapData.qiangdao.x;
                // Laya.timer.once(100, this, () => {
                //     Laya.Tween.to(this.box_game, { x: -(4000) }, 4170);
                //     Laya.Tween.to(this.box_player, { x: (4000) }, 4170);
                //     this.playAni("23-11", () => {
                //         this.onPlayOnce();
                //     });
                // })
            }
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
        //Laya.Tween.clearAll(this.box_game_up);
    }

}