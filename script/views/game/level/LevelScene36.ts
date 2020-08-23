import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene36 extends LevelBase {
    className_key = "LevelScene36";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene36.json";
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

    zombie: Laya.Skeleton
    obs:   Laya.Skeleton
    public async initPlayer() {

        ViewChangeManager.getInstance().showBufferLoadingView();
        let skAnim: Array<string> = [];
        skAnim = ["obs", "zombie"];
        for (let k of skAnim){
            let obj = this.mapData[k];
            this[k] = await this.createSkeleton(obj.url);
            this.box_enb.addChild(this[k]);
            this[k].x = obj.x;
            this[k].y = obj.y;
            switch (k){
                case "obs": 
                    this[k].stop();
                    this[k].visible = false;
                    break
            }
        }
        
        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.box_player.addChild(this.ani_player);

        this.box_player.x = 0;
        this.box_game.x = 0;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        
        switch (evt.name) {
            case "smove":
                this.box_player.x = 600;
                Laya.Tween.to(this.box_game, { x: -1810 }, 4500);
                Laya.Tween.to(this.box_player, { x: 2000 }, 4500);
                break;
            case "smove1":
                Laya.Tween.to(this.box_game, { x: -2860 }, 3800);
                Laya.Tween.to(this.box_player, { x: 3060 }, 3800);
                break;
            case "smove2":
                Laya.Tween.to(this.zombie, { x: 4000 }, 6700);
                Laya.Tween.to(this.box_game, { x: -3860 }, 6700);
                Laya.Tween.to(this.box_player, { x: 4060 }, 6700);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -5000 }, 2400);
                Laya.Tween.to(this.box_player, { x: 5600 }, 2400);
                break;
            case "sevent_JS1_1":
                this.zombie.play("JS1", true);
                Laya.Tween.to(this.zombie, { x: 2000 }, 4300);
                break;
            case "sevent_JS2_1":
                this.zombie.play("JS2", true);
                break;
            case "sevent_JS3_1":
                this.zombie.play("JS3", false);
                break;
            case "sevent_JS4_1":
                this.zombie.play("JS4", false);
                break;
            case "sevent_JS5_1":
                this.zombie.x = 3040;
                this.zombie.play("JS5", true);
                break;
            case "sevent_JS6_1":
                this.zombie.play("JS6", false);
                break;
            case "sevent_JS7_1":
                this.zombie.play("JS7", false);
                break;
            case "sevent_JS8_1":
                this.zombie.play("JS8", false);
                break;
            case "sevent_JS9_1":
                this.zombie.play("JS9", false);
                break;
            case "sevent_JS10_1":
                this.zombie.play("JS10", false); 
                break;
            case "sevent_luzhang_1":
                this.obs.visible = true;
                this.obs.play("luzhang", false);
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
         
            switch (this.index){
                case 0: 
                    this.box_player.x = this.mapData.player.x;
                    this.box_game.x = 0;
                    this.zombie.x =  this.mapData.zombie.x;
                    this.obs.visible = false;
                    break;
            }
        
            this.onStart();
        }
    }

    /**停止动画 */
    private stopAni() {
        Laya.Tween.clearAll(this.box_player);
        Laya.Tween.clearAll(this.box_game);
    }
}