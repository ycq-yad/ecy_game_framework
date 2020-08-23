import { LevelBase } from "./LevelBase";
import ViewChangeManager from "../../../games/ViewChangeManager";

export default class LevelScene20 extends LevelBase {
    className_key = "LevelScene20";

    public box_enb2: Laya.Box;
    constructor(data_) {
        super(data_);
        this.skin = "game/level/LevelScene20.json";
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

   
    private skBg: Laya.Skeleton;
    private skBg2: Laya.Skeleton;

    public async initPlayer() {
        ViewChangeManager.getInstance().showBufferLoadingView();
        
        //
        this.skBg = await this.createSkeleton(this.mapData.bg.ani.url);
        this.skBg.x = this.mapData.bg.ani.x;
        this.skBg.y = this.mapData.bg.ani.y;
        this.box_enb.addChild(this.skBg);
        //
        this.skBg2 = await this.createSkeleton(this.mapData.bg.ani.url);
        this.skBg2.x = this.mapData.bg.ani.x;
        this.skBg2.y = this.mapData.bg.ani.y;
        //this.box_enb2.addChild(this.skBg2);
        //
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
        if(this.bAniDestory) return;
        super.onPlayLabel(evt);
        switch (evt.name) {
          case "smove":
            Laya.Tween.to(this.box_game, { x: -(2128)  }, 4170);
            Laya.Tween.to(this.box_player, { x: (2128 ) }, 4170);
            this.skBg.play("20-4",true);
            break;
          case "sevent_20-1_0":
            this.skBg.play("20-1",false);
            break;
          case "sevent_20-3_0":
            
            this.skBg2.play("20-3",false);
            break;
          case "smove1":
            Laya.Tween.to(this.box_game, { x: -(3442)  }, 3290);
            Laya.Tween.to(this.box_player, { x: (3442 ) }, 3290);
            if(this.box_enb2.numChildren <= 0){
                this.box_enb2.addChild(this.skBg2);
            }
            this.skBg2.play("20-3",false);
            break;
          case "sevent_20-2_0":
            this.skBg2.play("20-2",false);
            break;
          case "smove2":
            Laya.Tween.to(this.box_game, { x: -(4902)  }, 3360);
            Laya.Tween.to(this.box_player, { x: (4902 ) }, 3360);
            break;
          case "smove3":
            Laya.Tween.to(this.box_game, { x: -(5840)  }, 5539);
            //Laya.Tween.to(this.box_player, { x: (6400 ) }, 5539);
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
    public stopGame() {

    }

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
               
            } else if (this.index == 2) {
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