import GameConfig from "./GameConfig";
import VerticalView from "./script/views/VerticalView";
import { GameData } from "./script/common/GameData";
import GamePreLoadingView from "./script/loading/GamePreLoadingView";
import SoundManager from "./script/common/SoundManager";

import { LevelManager } from "./script/manager/LevelManager";
import GameStateManager from "./script/games/GameStateManager";
import { EnterGameType, MoreGameIndex } from "./script/games/CommonDefine";
import { PlayerDataManager } from "./script/common/GameDataManager";
import ConfigManager from "./script/games/ConfigManager";
import ViewChangeManager from "./script/games/ViewChangeManager";
import { MiniManeger } from "./script/minigame/MiniManeger";
import InviteManager from "./script/manager/InviteManager";
import PlatformDY from "./PlatformDY";

declare var VConsole;
declare var loadLib;

class Main extends BaseContent {

	private loadingView: GamePreLoadingView;
	constructor() {
		super({ width: 1080, height: 1920, exportSceneToJson: true });
		//
		GameConfig.init();

		// let s = Utils

		let onShow = function (obj) {
			console.log("onShow...", obj);
			SoundManager.getInstance().playBgMusic();
			if (ViewChangeManager.bGameOpen) {
				if (ViewChangeManager.getInstance().CurLevelBase) {
					ViewChangeManager.getInstance().CurLevelBase.levelOnShow();
				}
			}
		}

		let onHide = function () {
			console.log("onHide...");
			SoundManager.getInstance().pauseBgm();
			if (ViewChangeManager.getInstance().CurLevelBase) {
				ViewChangeManager.getInstance().CurLevelBase.levelOnHide();
			}
		}

		let onAudioInterruptionBegin = (res) => {
			console.log("onAudioInterruptionBegin");
			// SoundManager.getInstance().stopBgMusic();
			SoundManager.getInstance().pauseBgm();
		};

		let onAudioInterruptionEnd = (res) => {
			console.log("onAudioInterruptionEnd");
			SoundManager.getInstance().playBgMusic();
			// SoundManager.getInstance().playBgMusic(SoundManager.getInstance().curBgMusic);
		};

		if (DeviceUtil.isMiniGame()) {
			GameData.getInstance().enterGameInfo = platform.getLaunchOptionsSync();
			MiniManeger.instance.onShow(onShow);
			MiniManeger.instance.onHide(onHide);
			MiniManeger.instance.onAudioInterruptionBegin(onAudioInterruptionBegin);
			MiniManeger.instance.onAudioInterruptionEnd(onAudioInterruptionEnd);
			MiniManeger.instance.initMiniGame();
		} else {
			Laya.stage.on(Laya.Event.FOCUS, this, () => {
				console.log("获取焦点");
				onShow(null);
				//EventMgr.getInstance().sendEvent(GameEvent.ONSHOW);
			});
			Laya.stage.on(Laya.Event.BLUR, this, () => {
				console.log("失去焦点");
				onHide();
				//EventMgr.getInstance().sendEvent(GameEvent.ONHIDE);
			});
		}
	}

	/**
	 * 检验平台
	 */
	public checkPlatform(): void {
		this.loadingView = new GamePreLoadingView();
		SceneManager.getInstance().openSceneInstance(this.loadingView);
		//
		console.log("检验平台---");
		let self = this;
		//h5
		if (window["loadingH5"]) {
			window["loadingH5"](100);
			// 初始化

			// loadLib("vconsole.min.js");
		}

		//判断平台使用不同的地址资源
		let resUrl: string = "./";
		if (DeviceUtil.isQQMiniGame()) {
			//开启定时回收触发
			GameData.getInstance().gameId = "1044";//qq的游戏id
			resUrl = GameData.getInstance().qqMiniGameResUrl;
		} else if (DeviceUtil.isWXMiniGame()) {
			GameData.getInstance().gameId = "1043";//微信的游戏id
			//开启定时回收触发
			Laya.timer.once(10000, this, () => {
				console.log("加速回收---");
				platform.triggerGC();
			});
			resUrl = GameData.getInstance().wxMiniGameResUrl;
		} else if (DeviceUtil.isTTMiniGame()) {
			//GameData.getInstance().gameId = "1043"
			resUrl = GameData.getInstance().ttMiniGameResUrl;
		} else {
			//剩余其他的平台
			self.initDebug();
		}

		self.loadPreLoadRes(resUrl + "configs/infos.json?v=" + Math.random());

	}

	/**
	 * 加载预加载资源
	 */
	private async loadPreLoadRes(resUrl: string) {
		//
		this.initInfos(resUrl);
		Laya.timer.once(5000, this, this.loadPreLoadRes, [resUrl]);
	}

	private isFlage: boolean = false;

	protected enableFileConfig(): void {
		Laya.timer.clearAll(this)
		if (this.isFlage) {
			return
		}
		this.isFlage = true;
		console.log(BaseConst.infos);
		//
		GameData.getInstance().initConfig(BaseConst.infos);
		MiniManeger.instance.showBannerAd();
		//
		let resUrl = "";//
		if (DeviceUtil.isWXMiniGame()) {
			resUrl = GameData.getInstance().wxMiniGameResUrl;
		}
		if (DeviceUtil.isQQMiniGame()) {
			resUrl = GameData.getInstance().qqMiniGameResUrl;
			MiniManeger.instance.initBoxAd();
		}
		if (DeviceUtil.isTTMiniGame()) {
			resUrl = ResUtil.getIntance().defaultOriginUrl = GameData.getInstance().ttMiniGameResUrl;
		}
		if (DeviceUtil.isMiniGame()) {
			ResUtil.getIntance().defaultOriginUrl = resUrl;
			ResUtil.getIntance().addVersionPrefix(resUrl);
		}
		this.loadFileConfig("fileconfig.json");
		MiniManeger.instance.checkCityInfo();
	}

	/**
	 * 平台登陆
	 */
	private async platformLogin() {
		if (DeviceUtil.isQQMiniGame() || DeviceUtil.isWXMiniGame() || DeviceUtil.isTTMiniGame()) {
			console.log("开始登录");
			let res, self = this;
			let enter = async (isCreate: boolean = false) => {
				if (isCreate) {
					return;
				}
				if (DeviceUtil.isWXMiniGame() || DeviceUtil.isQQMiniGame() || DeviceUtil.isTTMiniGame()) {
					if (BaseConst.infos.gameInfo.isDY && DeviceUtil.isWXMiniGame()) {
						let isAuthorize = await platform.checkIsAuthorize();
						let userinfo = null;
						if (isAuthorize) {
							userinfo = await MiniManeger.instance.initUserTemp();
						}
						if (userinfo == null) {//如果没授权 就是纯净模式
							userinfo = { nickName: '', avatarUrl: '', gender: '' };
						}

						let obj = GameData.getInstance().enterGameInfo;
						let scene = obj.query.scene == undefined ? null : obj.query.scene;
						PlatformDY.getOpenidAndAuthorzia({
							code: res, nickName: userinfo.nickName, avatarUrl: userinfo.avatarUrl, gender:
								userinfo.gender, scene: decodeURIComponent(scene)
						}).then((dyUser) => {
							GameData.getInstance().userInfo.openId = dyUser.openid;
							GameData.getInstance().strOpenIDWx = dyUser.openid;
							console.log("GameData.getInstance().strOpenIDWx = ", GameData.getInstance().strOpenIDWx);
							let strOpenIdOther = GameData.getInstance().enterGameInfo.query["openid"];
							console.log("strOpenIdOther = ", strOpenIdOther);
							if (strOpenIdOther && strOpenIdOther != "") {
								InviteManager.getInstance().judgeInvite();
								console.log("createUserInfoButton 用户信息 : ", GameData.getInstance().userInfo);
							}

							//嘟游
							if (BaseConst.infos.gameInfo.isDY) {
								PlatformDY.refreshGameList();
							}

							//加载玩家数据
							PlayerDataManager.getInstance().GetData();
						});
					} else {
						console.log("登陆信息:", res);
						GameData.getInstance().userInfo.openId = res.openid;
						GameData.getInstance().userInfo.sessionKey = res.session_key;
						GameData.getInstance().strOpenIDWx = res.openid;
						console.log("GameData.getInstance().strOpenIDWx = ", GameData.getInstance().strOpenIDWx);
						console.log("用户信息 : ", GameData.getInstance().userInfo);
						if (DeviceUtil.isTTMiniGame()) {
							let userInfo = await platform.getUserInfo();
							console.log("getUserInfo:", userInfo);
							GameData.getInstance().userInfo.nick = userInfo.nickName;
							GameData.getInstance().userInfo.avatarUrl = userInfo.avatarUrl;
							console.log("授权用户信息 : ", GameData.getInstance().userInfo);
						} else {
							await MiniManeger.instance.initUserTemp();
						}
						PlayerDataManager.getInstance().GetData();
					}
				}
			}
			if (DeviceUtil.isTTMiniGame()) {
				let res = await platform.login();
				if (res) {
					res = JSON.parse(res);
					console.log("登陆信息:", res);
					GameData.getInstance().userInfo.openId = res.openid;
					GameData.getInstance().userInfo.sessionKey = res.session_key;
					console.log("用户信息 : ", GameData.getInstance().userInfo);
				}
				//加载玩家数据
				PlayerDataManager.getInstance().GetData();
			} else {
				if (BaseConst.infos.gameInfo.isDY && DeviceUtil.isWXMiniGame()) {
					res = await platform.DYlogin();
				} else {
					res = await platform.login();
					res = JSON.parse(res);
				}
				enter();
			}
		} else if (DeviceUtil.isOPPOMiniGame()) {
			// MiniOppoManager.instance.login().then(async (userInfo) => {
			// 	GameData.getInstance().userInfo.openId = GameData.getInstance().userInfo.sessionKey = userInfo.uid;
			// 	GameData.getInstance().userInfo.nick = userInfo.nickName;
			// 	GameData.getInstance().userInfo.avatarUrl = userInfo.avatar;
			// 	Laya.loader.load('https://hs.yz061.com/res/down/public/configs/youtiao.json?v=' + new Date().getTime(), Laya.Handler.create(self, (res) => {
			// 		let infos = [];
			// 		for (let i = 0, len = res.length; i < len; i++) {
			// 			let d = res[i]
			// 			let info: { "ad_id": number, "ad_img": string, "ad_appid": string, "name": string } = {
			// 				ad_id: d.id,
			// 				"ad_img": d.icon, "ad_appid": d.package, "name": d.title
			// 			}
			// 			infos.push(info)
			// 		}
			// 		GameData.getInstance().oppoMiniIconsInfo = infos;
			// 	}));
			// }).catch((err) => {
			// 	console.warn("oppo login 失败！", err);
			// 	GameData.getInstance().userInfo.openId = GameData.getInstance().userInfo.sessionKey = GameData.getInstance().userInfo.nick = GameData.getInstance().userInfo.avatarUrl = DeviceUtil.getDeviceNo();
			// })
		} else {
			GameData.getInstance().userInfo.openId = GameData.getInstance().userInfo.sessionKey = DeviceUtil.getDeviceNo();
			PlayerDataManager.getInstance().GetData();
		}
	}

	/**
	 * 加载资源
	 */

	protected async loadRes() {
		await this.platformLogin();
		console.log("loadRes---");
		console.log("加载预加载资源--");
		let resUrl = "";
		if (DeviceUtil.isQQMiniGame()) {
			Laya.loader.create("configs/gameQQInfo.json" + GameData.getInstance().randomTime, Laya.Handler.create(this, (infos) => {
				GameData.getInstance().gameQQInfo = infos;
			}), null);
		}
		if (DeviceUtil.isNative()) {
			await ResUtil.getIntance().loadThms(resUrl + "resource/default.thm.json");
			await ResUtil.getIntance().loadRESConfig(resUrl + "resource/default.res.json");
		} else {
			let loadresUrl = resUrl;
			await ResUtil.getIntance().loadThms(loadresUrl + "resource/default.thm.json?v=" + Math.random());
			await ResUtil.getIntance().loadRESConfig(loadresUrl + "resource/default.res.json?v=" + Math.random());
		}

		//
		// GameDataManager.instance.initData();
		// GameMgr.getInstance().registerBufferLoading();
		// SceneManager.getInstance().openGameScene(Level1Scene);
		// SceneManager.getInstance().openGameScene(Level2Scene);
		// let level = Utils.getQueryString("level");
		// if (level == null || level == '') {
		// 	level = 1 + '';
		// }
		//加载微信的运营需求
		if (DeviceUtil.isWXMiniGame() && !BaseConst.infos.gameInfo.isDY) {
			Laya.loader.load(resUrl + "configs/wxmoregame.json?v=" + Math.random(), Laya.Handler.create(this, (res) => {
				if (typeof (res) == "string") {
					res = JSON.parse(res);
				}
				let infos = [];
				for (let i = 0, len = res.iconList.length; i < len; i++) {
					res.iconList[i].ad_img = "https://package.32yx.com/ecy_game_small/laya/girl/wx_res/moregame/" + res.iconList[i].ad_img;
				}
				GameData.getInstance().weCatMiniIconsInfo = res.iconList;
			}));
		} else if (DeviceUtil.isTTMiniGame()) {
			Laya.loader.load(resUrl + "configs/ttmoregame.json?v=" + Math.random(), Laya.Handler.create(this, (res) => {
				if (typeof (res) == "string") {
					res = JSON.parse(res);
				}
				let infos = [];
				for (let i = 0, len = res.iconList.length; i < len; i++) {
					res.iconList[i].ad_img = "https://package.32yx.com/ecy_game_small/laya/girl/tt/moregame/" + res.iconList[i].ad_img;
				}
				GameData.getInstance().weCatMiniIconsInfo = res.iconList;
			}));
		}
		else {
			Laya.loader.load(resUrl + "configs/wxmoregame.json?v=" + Math.random(), Laya.Handler.create(this, (res) => {
				if (typeof (res) == "string") {
					res = JSON.parse(res);
				}
				let infos = [];
				//2020.7.13-3
				GameData.getInstance().weCatMiniIconsInfo = [];
				for (let i = 0, len = res.iconList.length; i < len; i++) {
					let stData = new MoreGameIndex();
					stData.ad_img = "https://package.32yx.com/ecy_game_small/laya/girl/wx_res/moregame/" + res.iconList[i].ad_img;;
					stData.name = res.iconList[i].name;
					GameData.getInstance().weCatMiniIconsInfo.push(stData);
				}
			}));
		}


		let group = ["panel", "common", "gamehome"];
		//加入当前关卡的数据
		group.push(PlayerDataManager.getInstance().getCurLevelToChallenge().toString());
		ResUtil.getIntance().loadGroups(group, async () => {
			await ConfigManager.getInstance().initConfigInfo();
			PlayerDataManager.getInstance().initGoods();
			PlayerDataManager.getInstance().refreshOffLinePS();
			ViewChangeManager.getInstance().rigestBufferLoadingView();

			//Laya.stage.on(Laya.Event.CLICK, this, this.onPlayMusic)
			GameData.getInstance().isNewPlayer = PlayerDataManager.getInstance().isNewPlayer;
			if (!PlayerDataManager.getInstance().isNewPlayer) {
				GameStateManager.getInstance().levelState = EnterGameType.enum_EnterGameType_GameHome;
			} else {
				GameStateManager.getInstance().levelState = EnterGameType.enum_EnterGameType_ChooseLevel;
				PlayerDataManager.getInstance().SaveData();
			}
			PlayerDataManager.getInstance().setCurLevel(PlayerDataManager.getInstance().getLevelToChangeMaxLevel() - 1);
			LevelManager.getInstance().createLevelScene(PlayerDataManager.getInstance().getLevelToChangeMaxLevel());

			ViewChangeManager.getInstance().showCommonView();
			ViewChangeManager.getInstance().showImageExit();
			ViewChangeManager.bGameOpen = true;
			this.onPlayMusic();
			ResUtil.getIntance().loadGroups(["lottery", 'success', 'game', 'hit', 'moregame']);
		}, (cur, total) => {
			this.loadingView.progress(cur, total);
		});
	}
	public onPlayMusic() {
		SoundManager.getInstance().bgm = 'bg';
		// SoundManager.getInstance().playBgMusic()
		Laya.stage.off(Laya.Event.CLICK, this, this.onPlayMusic);
	}


}
//激活启动类
new Main();
