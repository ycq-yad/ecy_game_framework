import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene37 extends LevelBase {
    className_key = "LevelScene37";

    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene37.json";
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

    air: Laya.Skeleton
    fire: Laya.Skeleton
    zombie: Laya.Skeleton
    robot: Laya.Skeleton
    door: Laya.Skeleton
    adc: Laya.Skeleton

    public async initPlayer() {

        ViewChangeManager.getInstance().showBufferLoadingView();
        let skAnim: Array<string> = [];
        skAnim = ["air", "fire","robot","door","adc","zombie"];
        for (let k of skAnim){
            let obj = this.mapData[k];
            this[k] = await this.createSkeleton(obj.url);
            this.box_enb.addChild(this[k]);
            this[k].x = obj.x;
            this[k].y = obj.y;
            if (k == "door"){
                this[k].stop();
            } else if(k == "air"){
                this[k].scale(0.7, 0.7);
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
        // this.box_game.x= -5100;
        this.onStart();
        ViewChangeManager.getInstance().hideBufferLoadingView();
    }
    

    public onPlayLabel(evt: any) {
        if (this.bAniDestory) return;
        super.onPlayLabel(evt);
        console.log(evt.name)
        switch (evt.name) {
            case "smove":
                Laya.Tween.to(this.box_game, { x: -1560 }, 3100);
                Laya.Tween.to(this.box_player, { x: 1200 }, 3100);
                break;
            case "smove2":
                Laya.Tween.to(this.box_game, { x: -2630 }, 3200);
                Laya.Tween.to(this.box_player, { x: 2350 }, 3200);
                break;
            case "smove3":
                Laya.Tween.to(this.box_game, { x: -3700 }, 5400);
                Laya.Tween.to(this.box_player, { x: 3500 }, 5400);
                break;
            case "pmove":
                // Laya.Tween.to(this.box_game, { x: -3700 }, 1000);
                Laya.Tween.to(this.box_player, { x: 4500 }, 2400);
                break;
            case "sevent_wandou1_1":
                this.adc.play("wandou1", true);
                break;
            case "sevent_wandou2_1":
                this.adc.play("wandou2", false);
                break;
            case "sevent_wandou3_1":
                this.adc.play("wandou3", false);
                break;
            case "sevent_jiqiren1_1":
                this.robot.play("jiqiren1", true);
                break;
            case "sevent_jiqiren2_1":
                this.robot.play("jiqiren2", false);
                break;
            case "sevent_jiqiren3_1":
                this.robot.play("jiqiren3", false);
                break;
            case "sevent_jiangshi1_1":
                this.zombie.play("jiangshi1", true);
                let zindex = this.box_game.getChildIndex(this.box_enb);
                let pindex = this.box_game.getChildIndex(this.box_player);
                this.box_game.setChildIndex(this.box_enb, pindex); 
                this.box_game.setChildIndex(this.box_player, zindex); 
                break;
            case "sevent_jiangshi2_1":
                this.zombie.play("jiangshi2", false);
                break;
            case "sevent_jiangshi3_1":
                this.zombie.once(Laya.Event.STOPPED, this, ()=>{
                    this.zombie.visible = false;
                })
                this.zombie.play("jiangshi3", false);
                break;
            case "some4":
                this.box_player.visible = false;
                Laya.Tween.to(this.box_game, { x: -5100 }, 2400);
                break;
            case "sevent_men2_1":
                this.door.play("men2", false);
                break;
            case "feiji1move":
                Laya.Tween.to(this.air, { x: 6400 }, 1400);
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
                    this.box_player.x =  this.box_game.x = 0;
                    break;
                case 1:
                    this.robot.play("jiqiren1", true);
                    break;
                case 2:
                    this.zombie.play("jiangshi1", true);
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