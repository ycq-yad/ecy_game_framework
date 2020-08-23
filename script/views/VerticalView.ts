import AnimationManager from "../manager/AnimationManager";

/**
 * 测试竖屏
 */
export default class VerticalView extends BaseSceneUISkin {
    public className_key = "VerticalView";
    private bg_img: Laya.Image;

    constructor() {
        super();
        this.skin = "skins/VerticalSkinView.json";
    }

    protected childrenCreated(): void {
        DeviceUtil.adaptationBgImg(this.bg_img);
     
    }
}