import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene35 extends LevelBase {
    className_key = "LevelScene35";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene35.json";
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

    door_1: Laya.Skeleton
    door_2: Laya.Skeleton
    image_mask: Laya.Image
    public async initPlayer() {

        ViewChangeManager.getInstance().showBufferLoadingView();
        let skAnim: Array<string> = [];
        skAnim = ["door_1", "door_2"];
        for (let k of skAnim){
            let obj = this.mapData[k];
            this[k] = await this.createSkeleton(obj.url);
            this.box_enb.addChild(this[k]);
            this[k].x = obj.x;
            this[k].y = obj.y;
            if (k == "door_1"){
                this[k].play("men1", false)
            } else {
                this[k].play("men2", false)
            }
            this[k].stop();
        }
        
        !this.ani_player && (this.ani_player = await this.createSkeleton(this.mapData.player.url));
        this.box_player.getChildIndex(this.ani_player) == -1 && (this.box_player.addChild(this.ani_player));
        this.ani_player.x = this.mapData.player.x;
        this.ani_player.y = this.mapData.player.y;
        this.ani_player.on(Laya.Event.LABEL, this, this.onPlayLabel);
        this.box_player.addChild(this.ani_player);

        this.box_player.x = 0;
        this.box_game.x = 0;
        this.image_mask.alpha = 1;
        this.image_mask.visible = true;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -1800 }, 3000);
                Laya.Tween.to(this.box_player, { x: 1800 }, 3000);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -2680 }, 3000);
                Laya.Tween.to(this.box_player, { x: 2300 }, 3000);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -2850 }, 2040);
                Laya.Tween.to(this.box_player, { x: 2850 }, 2040);
                break;
            case "smove4":
                Laya.Tween.to(this.box_game, { x: -2850 }, 2100);
                Laya.Tween.to(this.box_player, { x: 2850 }, 2100);
                break;
            case "smove5":
                Laya.Tween.to(this.box_game, { x: -2850 }, 2100);
                Laya.Tween.to(this.box_player, { x: 2850 }, 2100);
                break;
            case "smove6":
                Laya.Tween.to(this.box_game, { x: -2940 }, 1600);
                Laya.Tween.to(this.box_player, { x: 3800 }, 2100);
                break;
            case "sevent_men1_1":
                this.door_1.play("men1", false) 
                break;
            case "sevent_men2_1":
                this.door_2.play("men2", false) 
                break;
            case "xs":
                Laya.Tween.to(this.image_mask, {alpha: 0}, 1000);
                break;
            // case "sevent_zhizhu1_1":
            //     this.spider.play("zhizhu1", true) 
            //     break;
            // case "sevent_zhizhu3_1":
            //     this.spider.play("zhizhu3", false) 
            //     break;
            // case "sevent_zhizhu2_1":
            //     this.spider.play("zhizhu2", false) 
            //     break;
            // case "sevent_jiangshi2_1":
            //     this.zombie.play("jiangshi2", true);
            //     let zindex = this.box_game.getChildIndex(this.box_enb);
            //     let pindex = this.box_game.getChildIndex(this.box_player);
            //     this.box_game.setChildIndex(this.box_enb, pindex); 
            //     this.box_game.setChildIndex(this.box_player, zindex); 
            //     Laya.Tween.to(this.zombie, {x: this.zombie.x - 1000}, 3000)
            //     break;
        }
    }

    // public playAni(aniName: any, callBack: Function, isLoop = false){
    //     if (aniName == "35-9"){this.zombie.visible = false;}

    //     super.playAni(aniName, callBack, isLoop)
    // }
    
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
                    this.box_player.x = this.box_game.x = 0;
                    break;
                case 2:
                case 1:
                    this.box_game.x = -2680;
                    this.box_player.x = 2300;
                    break;
                // case 2:
                //     this.zombie.visible = true;
                // break;
                // default:
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