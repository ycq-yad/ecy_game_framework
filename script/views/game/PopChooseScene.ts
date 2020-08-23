import { BasePopScene } from "../base/BasePopScene";

export class PopChooseScene extends BasePopScene {
    className_key = "PopChooseScene";

    public viewData_: { data: { chooseLeftName: string, icon_chooseLeft: string, icon_chooseRight: string, chooseRightName: string, rightName: string }, callBack: Function }
    public bg_img_res = null
    public constructor() {
        super(null);

        this.skin = 'game/PopChooseScene.json';
    }
    public icon_chooseLeft: Laya.Image;
    public icon_right: Laya.Image;
    public icon_left: Laya.Image;

    public icon_chooseRight: Laya.Image;
    /**
     * 选择
     */
    public box_choose: Laya.Box;

    public initView() {
        this.mouseEnabled = true;
        this.box_choose.scale(0.2, 0.2);
        Laya.Tween.to(this.box_choose, { scaleX: 1, scaleY: 1 }, 500, Laya.Ease.backIn);
        this.icon_chooseRight.skin = 'resource/assets/img/level/baseboard2.png';
        this.icon_left.removeChildren();
        this.icon_chooseRight.removeChildren();
        this.icon_right.removeChildren();
        this.icon_chooseLeft.skin = 'resource/assets/img/level/baseboard2.png';
        this.icon_chooseLeft.removeChildren();
        this.icon_left.skin = 'resource/assets/img/choose/' + this.viewData_.data.icon_chooseLeft + '.png'
        this.icon_right.skin = 'resource/assets/img/choose/' + this.viewData_.data.icon_chooseRight + '.png';
    }
    public addEvent() {
        this.icon_chooseLeft.on(Laya.Event.MOUSE_DOWN, this, this.onClick);
        this.icon_chooseRight.on(Laya.Event.MOUSE_DOWN, this, this.onClick);
    }

    public onClick(evt: Laya.Event) {
        let tar = (evt.currentTarget as Laya.Image)
        let data = this.viewData_.data;
        let icon_name = ''
        switch (evt.currentTarget) {
            case this.icon_chooseLeft:
                icon_name = data.chooseLeftName;
                this.chooseLeft = 'left';
                break;
            case this.icon_chooseRight:
                icon_name = data.chooseRightName;
                this.chooseLeft = 'right';
                break;
        }
        this.viewData_.callBack(icon_name == data.rightName, icon_name);
        tar.skin = 'resource/assets/img/level/baseboard1.png';
        this.mouseEnabled = false;

    }

    public chooseLeft: 'left' | "right" = null


    /**
     * 显示正确或者错误
     */
    public showResultIcon(isRight: boolean) {
        this.createChooseAnswer(isRight)
        if (isRight) {
            Laya.timer.once(1000, this, () => {

                this.hideView()
            })
        }
    }

    public createChooseAnswer(isRight: boolean) {
        let tar: Laya.Image;
        let skin = 'resource/assets/img/choose/gameinterface_icon_4.png';
        if (!isRight) {
            skin = 'resource/assets/img/choose/gameinterface_icon_5.png';
        }
        if (this.chooseLeft == 'left') {
            tar = this.icon_left;
        } else {
            tar = this.icon_right;

        }
        let img = new Laya.Image();
        img.skin = skin;
        img.centerX = img.centerY = 0;
        tar.addChild(img);


    }
    public hideView() {
        Laya.Tween.to(this.box_choose, { scaleX: 0, scaleY: 0 }, 500, Laya.Ease.backIn);
    }

    public removeEvent() {
        this.icon_chooseLeft.off(Laya.Event.MOUSE_DOWN, this, this.onClick);
        this.icon_chooseRight.off(Laya.Event.MOUSE_DOWN, this, this.onClick);
    }

    public removeSelf() {
        // GameManager.instance.showTopBar(ShowType.showAll)
        return super.removeSelf();
    }

}