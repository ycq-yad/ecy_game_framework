import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene25 extends LevelBase {
    className_key = "LevelScene25";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene25.json";
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

    private ani_ljuanfen: Laya.Skeleton;
    private ani_snake: Laya.Skeleton;

    private ani_water: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        this.ani_snake = await this.createSkeleton(this.mapData.snake.url);
        this.ani_snake.x = this.mapData.snake.x;
        this.ani_snake.y = this.mapData.snake.y;
        this.box_enb.addChild(this.ani_snake);
        this.ani_snake.visible = false;

        this.ani_ljuanfen = await this.createSkeleton(this.mapData.ljuanfen.url);
        this.ani_ljuanfen.x = this.mapData.ljuanfen.x;
        this.ani_ljuanfen.y = this.mapData.ljuanfen.y;
        this.box_enb.addChild(this.ani_ljuanfen);
        // this.ani_ljuanfen.visible = false;

        this.ani_water = await this.createSkeleton(this.mapData.water.url);
        this.ani_water.x = this.mapData.water.x;
        this.ani_water.y = this.mapData.water.y;
        this.box_enb.addChild(this.ani_water);
        this.ani_water.visible = false;

        // this.ani_water.visible = true;
        // this.ani_water.play(0,true);
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
                Laya.Tween.to(this.box_game, { x: -(1080) }, 3880);
                Laya.Tween.to(this.box_player, { x: (1080) }, 3880);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -(3000) }, 3300);
                Laya.Tween.to(this.box_player, { x: (3000) }, 3300);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -(5800) }, 4290);
                Laya.Tween.to(this.box_player, { x: (5800) }, 4290);
                break;
            case "smove4":
                Laya.Tween.to(this.box_game, { x: -(8000) }, 2630);
                break;
            case "sevent_25-5-1_1":
                this.ani_water.visible = true;
                this.ani_water.player.once(Laya.Event.STOPPED, this, () => {
                    this.ani_water.visible = false;
                });
                this.ani_water.play("25-5-1", false);
                break;
            case "sevent_25-9-1she_1":
                this.ani_snake.visible = true;
                this.ani_snake.play("25-9-1she", false);
                break;
            case "sevent_25-9-2she3_1":
                this.ani_snake.visible = true;
                this.ani_snake.play("25-9-2she", false);
                break;
            case "sevent_25-9-2she2_1"://
                this.ani_snake.visible = true;
                this.ani_snake.play("25-9-2she2", false);
                break;
        }
    }

    public onPlayOnce() {
        super.onPlayOnce();
        if (this.localData.next == "25-16") {
            // Laya.Tween.to(this.box_player, { x: (8000) }, 2630);
            this.box_player.x = 8000;
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
                this.box_game.x = -3000;
                this.box_player.x = 3000;
                this.ani_snake.visible = true;
                this.ani_snake.play("25-9-1she", false);

            } else if (this.index == 2) {
                this.box_game.x = -5800;
                this.box_player.x = 5800;
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