import { GameData } from "../common/GameData";
import GuessLike from "../oppo/GuessLike";
import GuessItemData from "../oppo/GuessItemData";

export class MiniOppoManager {

    private static ins: MiniOppoManager;
    public static get instance(): MiniOppoManager {
        if (this.ins == null) {
            this.ins = new MiniOppoManager();
        }
        return this.ins;
    }

    /********************************************************** */
    /**
     * 初始化小游戏
     */
    public initMiniGame() { }

    /**
     * 获取游戏数据
     */
    public getUserInfo() {
        platform.createUserInfoButton((res) => { });
    }

    /**
     * 进入后台的时间戳
     */
    public hideTime = 0;
    /**
     * 进入前天的时间戳
     */
    public showTime = 0;
    public shareSucful: Function;
    public shareFailful: Function;
    public thisObj: any;
    /**
     * 分享成功回调的等待时间
     */
    public sucTime: number = 0;
    public onShow(callBack: Function) {
        platform.onShow(() => {
            callBack && callBack();
            this.showTime = new Date().getTime();
            if (this.showTime - this.hideTime >= this.sucTime) {
                this.shareSucful && this.shareSucful.call(this.thisObj);
            } else {
                this.shareFailful && this.shareFailful.call(this.thisObj);
            }
            this.shareFailful = null;
            this.shareFailful = null;
            this.thisObj = null;
        })
    }

    public onHide(callBack: Function) {
        platform.onHide(() => {
            callBack && callBack();
            this.hideTime = new Date().getTime();
        });
    }

    /**
     * 登录
     */
    public async login(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!DeviceUtil.isOPPOMiniGame()) {
                reject(null);
                return
            }
            qg.login({
                pkgName: '',
                success: function (res) {
                    var data = JSON.stringify(res.data);
                    console.log("login success -> ", data);
                    resolve(res.data);
                },
                fail: function (res) {
                    // errCode、errMsg
                    console.log("login fail -> ", JSON.stringify(res));
                    reject(null);
                },
                complete: () => {

                }
            })
        });
    }

    /**
    * 创建快捷方式
    */
    public createShortCut(succCall?: Function): void {
        this.hasShortcutInstalled().then((res) => {
            if (res == false) {
                platform.installShortcut({
                    success: function () {
                        // 执行用户创建图标奖励
                        succCall && succCall();
                    },
                    fail: function (err) { },
                    complete: function () { }
                })
            }
        });
    }

    /**
     * 是否已经添加了快捷方式
     */
    public hasShortcutInstalled(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            platform.hasShortcutInstalled({
                success: function (res) {
                    resolve(res);
                },
                fail: function () {
                    resolve(false);
                }
            });
        });
    }

    /**
     * 数据上报
     * @param name 
     * @param value 
     */
    public reportMonitor(name: string, value: number): void {
        if (DeviceUtil.isOPPOMiniGame()) {
            platform.reportMonitor(name, value);
        }
    }

    public updateWordByDate(): string {
        let startH = 7;
        let endH = 21;
        let date = new Date();
        let week = date.getDay();
        let str: string;
        if (week == 0 || week == 6) {//周末
            str = "resource/assets/img/common/failure_word_9.png";
        } else {
            let hour = date.getHours();
            if (hour > startH - 1 && hour < endH - 1) {
                str = "resource/assets/img/common/failure_word_10.png"
            } else {
                str = "resource/assets/img/common/failure_word_9.png";
            }
        }
        return str;
    }

    /**原生广告对象 */
    public imgNativeAd: Laya.Image;

    /** 当前原生广告  */
    public nativeBanner: any;

    /**  当前原生广告的参数  */
    public curentNativeAdInfo: any;

    /**
     * 加载原生广告
     */
    public loadNativeBanner(loadSucc: Function, index: number = 0): void {
        if (!GameData.getInstance().nativeBannerOpen) {
            loadSucc(null)
            return;
        }

        let self = this;
        if (!self.imgNativeAd) {
            self.imgNativeAd = new Laya.Image();
        }
        if (index > GameData.getInstance().nativeBannerId.length) {
            loadSucc(null)
            return;
        }
        index = index % (GameData.getInstance().nativeBannerId.length);

        let bannerId = GameData.getInstance().nativeBannerId[index];
        self.nativeBanner = platform.createNativeAd(bannerId);
        let nativeLoadCall = function (res) {
            console.log("原生广告 id->" + bannerId + " succ  ", res);
            self.curentNativeAdInfo = res;
            self.nativeBanner.offLoad(nativeLoadCall);
            self.nativeBanner.offError(nativeErrorCall);
            loadSucc && loadSucc(res.adList);
        }

        let nativeErrorCall = function (err) {
            console.log("原生广告 id->" + bannerId + " err");
            self.loadNativeBanner(loadSucc, index++);//失败循环调用
            self.nativeBanner.offLoad(nativeLoadCall);
            self.nativeBanner.offError(nativeErrorCall);
        }

        // self.nativeBanner.reportAdClick({
        //     adId: ''
        // })
        self.nativeBanner.onError(nativeErrorCall);
        self.nativeBanner.onLoad(nativeLoadCall);
        self.nativeBanner.load();
    }

    /**
     * 创建猜你喜欢 oppo
     */
    // public async createGuessLike(parent: Laya.Sprite): Promise<GuessLike> {
    //     return new Promise<GuessLike>(async (resolve) => {
    //         let data: Array<GuessItemData> = GameData.getInstance().oppoMiniIconsInfo;
    //         if (data == null) {
    //             resolve(null)
    //             return;
    //         }
    //         console.log("data(GuessLike) ->", data);
    //         let guessLike = parent.getChildByName('GuessLike') as GuessLike;
    //         if (guessLike == null) {
    //             guessLike = new GuessLike("skins/oppo/GuessLikeOppo.json", "skins/oppo/GuessLikeItemOppo.json", data, 160);
    //             parent.addChild(guessLike);
    //         }
    //         guessLike.name = 'GuessLike';
    //         guessLike.mouseThrough = true;
    //         guessLike.x = (Laya.stage.width - guessLike.width) / 2;
    //         guessLike.y = Laya.stage.height - guessLike.height;
    //         resolve(guessLike);
    //     });
    // }
    /**
     * oppo跳转
     * @param pkname 
     */
    public oppoNavigateToMiniProgram(pkname: string): void {
        console.log("oppoNavigateToMiniProgram  ->  ", pkname);
        platform.navigateToMiniProgram(pkname);
    }
    /**当前插屏广告 */
    public curentInterSAd: any;
    /**
     * 创建插屏广告
     */
    public createInterstitialAd1(): void {
        if (!GameData.getInstance().forAanOpen) return;
        if (GameData.getInstance().InterstitialAdInfo.count > GameData.getInstance().createInterstitialAdCount) {
            return;
        }
        let times = 60000;
        if (GameData.getInstance().InterstitialAdInfo.count <= 6) {

            times = 60000;

        } else {
            times = 30000;
        }
        if (new Date().getTime() - GameData.getInstance().InterstitialAdInfo.time < times) {
            return;
        }

        let index = 0;

        this.curentInterSAd = platform.createInterstitialAd(GameData.getInstance().forAanId[index]);

        let self = this;

        function onLoad(res) {
            console.log("插屏广告-- succ");
            GameData.getInstance().InterstitialAdInfo.count++;
            GameData.getInstance().InterstitialAdInfo.time = new Date().getTime();;
            GameData.getInstance().saveInterstitialAdInfo();
            self.curentInterSAd.show();
            self.curentInterSAd.offLoad(onLoad);
            self.curentInterSAd.offError(onError);
        }
        function reload() {
            if (index > GameData.getInstance().forAanId.length) {
                return;
            }
            index++;
            self.curentInterSAd = platform.createInterstitialAd(GameData.getInstance().forAanId[index]);
            self.curentInterSAd.onLoad(onLoad);
            self.curentInterSAd.onError(onError);
            self.curentInterSAd.load();
        }
        function onError(err) {
            console.log("插屏广告-- fail  ", err);
            self.curentInterSAd.offLoad(onLoad);
            self.curentInterSAd.offError(onError);
            reload()
        }

        if (self.curentInterSAd) {
            self.curentInterSAd.offLoad(onLoad);
            self.curentInterSAd.offError(onError);
            self.curentInterSAd.onLoad(onLoad);
            self.curentInterSAd.onError(onError);
            self.curentInterSAd.load();
        }
    }

    /**
     * 创建插屏广告
     */
    public createInterstitialVideoAd(): void {
        this.curentInterSAd = platform.createInterstitialVideoAd(GameData.getInstance().forAanId[0]);
        let self = this;
        function onLoad(res) {
            console.log("插屏广告-- succ");
            self.curentInterSAd.show();
            self.curentInterSAd.offLoad(onLoad);
            self.curentInterSAd.offError(onError);
        }
        function onError(err) {
            console.log("插屏广告-- fail  ", err);
            self.curentInterSAd.offLoad(onLoad);
            self.curentInterSAd.offError(onError);
        }
        if (self.curentInterSAd) {
            self.curentInterSAd.offLoad(onLoad);
            self.curentInterSAd.offError(onError);
            self.curentInterSAd.onLoad(onLoad);
            self.curentInterSAd.onError(onError);
            self.curentInterSAd.load();
        }
    }

    public setLoadingProgress(progress) {
        qg.setLoadingProgress({
            progress: progress
        });
    }
    public loadingComplete(object) {
        qg.loadingComplete(object)

    }

    /**
     * 顺序创建oppo的广告id
     * @param index 
     */
    public createOppoAd(index: number = 0): any {
        if (!GameData.getInstance().bannerOpen) {
            return;
        }
        let self = this;
        let id = GameData.getInstance().bannerId[index];
        let bannerAd = platform.createBannerAd(id);
        let onLoadCall = function (res) {
            bannerAd.offLoad(onLoadCall);
        };

        let onEorrCall = function (res) {
            bannerAd.offError(onEorrCall);
            if (index >= GameData.getInstance().bannerId.length - 1) {
                console.log("广告id 拉取完毕都失败!  创建原生广告");
                bannerAd.destroy();
                self.loadNativeBanner(() => {
                    console.log("原生广告创建成功--");
                    Laya.stage.addChild(this.imgNativeAd);
                    this.imgNativeAd.centerX = 0;
                    this.imgNativeAd.bottom = 10;
                }, 0);
            }
        };

        bannerAd.onLoad(onLoadCall);
        bannerAd.onError(onEorrCall);
        return bannerAd;
    }

    public videoAd: any;
    public adUnitId: string;

    /**
     * 创建视频播放
     */
    public createRewardedVideoAd(onClose, onError) {
        if (!DeviceUtil.isOPPOMiniGame()) return;
        if (!GameData.getInstance().bannerOpen) {
            // onClose()
            return;
        }
        let videoAd = this.videoAd;
        let adUnitId = this.adUnitId;
        let phone: any = qg.getSystemInfoSync();
        if (phone.platformVersionCode < 1051) {
            console.warn("当前版本过低，不支持创建视频播放");
            onError();
            return;
        }
        console.log("创建视频播放  - > " + adUnitId);
        if (!videoAd) {
            videoAd = qg.createRewardedVideoAd({
                adUnitId: adUnitId
            });

            videoAd.onLoad(function (res) {
                console.log('videoAd onLoad', res);
            });
        }
        let onCloseCall = (res) => {
            console.log('videoAd onClose', res);
            if (onClose) {
                res.
                onClose(res);
            }
            videoAd.offClose(onCloseCall);
        };
        videoAd.onClose(onCloseCall);

        let onErrorCall = (res) => {
            console.log('videoAd onError', res);
            if (onError) {
                onError(res);
            }
            videoAd.offError(onErrorCall);
        };
        videoAd.onError(onErrorCall);

        videoAd.load().then(() => {
            console.log('激励视频加载成功');
            qg.hideLoading()
            videoAd.show().then(() => {
                console.log('激励视频 广告显示成功');
            }).catch(err => {
                console.log('激励视频 广告显示失败');
                if (onError) {
                    onError(err);
                }
            })
        }).catch(err => {
            console.log('激励视频加载失败');
            if (onError) {
                onError(err);
            }
        })
    }

    /****************************************分享************************************/

    public defaultMssage = {
        title: '吃鸡战场各类枪械排行榜',
        imageUrl: 'https://package.32yx.com/ecy_game_small/laya/girl/Share/share.png',
        query: ""
    }

    public shareInfo = [
        {
            title: '吃鸡战场各类枪械排行榜',
            imageUrl: 'https://package.32yx.com/ecy_game_small/laya/girl/Share/share.png',
            query: ""
        },
        {
            title: '吃鸡战场各类枪械排行榜',
            imageUrl: 'https://package.32yx.com/ecy_game_small/laya/girl/Share/share.png',
            query: ""
        }
    ]

    /**********************************************广告*****************************************/

    /**
     * 播放视频广告
     * 
     */

    public vibrateShort(data: { complete?: Function }) { }

    /**互推的游戏资源*/
    public gameInfoAry = [
        { "appid": "tt5c622adfc34851be", "title": "杠精大乱斗", "icon": "https://hs.yz061.com/res/down/public/icon/cd/pole_jump.png" },
        { "appid": "tt4e7138ccd15b7caa", "title": "巴掌王3D", "icon": "https://hs.yz061.com/res/down/public/icon/cd/slap_king.png" },
        { "appid": "tt7e0808b5e1224cd6", "title": "穿越空间", "icon": "https://hs.yz061.com/res/down/public/icon/cd/cykj.png" },
        { "appid": "tt9c09eab4032391c1", "title": "消消来了", "icon": "https://hs.yz061.com/res/down/public/icon/cd/xxll.jpg" },
        { "appid": "tt18956e2887bf2f24", "title": "篮球大作战", "icon": "https://hs.yz061.com/res/down/public/icon/cd/kltl.jpg" },
        { "appid": "ttfdfc8b4162d6c8ab", "title": "萌兵战争", "icon": "https://hs.yz061.com/res/down/public/icon/cd/mbzz.jpg" },
        { "appid": "tte3a3951e7c899dfd", "title": "疯狂跳床", "icon": "https://hs.yz061.com/res/down/public/icon/cd/jump.png" },
        { "appid": "tt546f22d2cb457cd0", "title": "超级购物狂", "icon": "https://hs.yz061.com/res/down/public/icon/cd/crazy_shopping.jpg" },
        { "appid": "tt8c7bfac613516af9", "title": "快来划水", "icon": "https://hs.yz061.com/res/down/public/icon/cd/klhs.jpg" },
        { "appid": "ttce8db83051a7f459", "title": "春节小火车", "icon": "https://hs.yz061.com/res/down/public/icon/cd/train.jpg" },
    ];
}