module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1690768904620, function(require, module, exports) {
// TUIKitWChat/Chat/index.js
var __TEMP__ = require('aegis-mp-sdk');var Aegis = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./utils/constant');var constant = __REQUIRE_DEFAULT__(__TEMP__);
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowConversation: false,
    isShowConversationList: true,
    currentConversationID: '',
    unreadCount: 0,
    hasCallKit: false,
    config: {
      userID: '',
      userSig: '',
      type: 1,
      tim: null,
      SDKAppID: 0,
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      const { config } = this.data;
      config.userID = wx.$chat_userID;
      config.userSig = wx.$chat_userSig;
      config.tim = wx.$TUIKit;
      config.SDKAppID = wx.$chat_SDKAppID;
      this.setData({
        config,
      }, () => {
        this.TUICallKit = this.selectComponent('#TUICallKit');
        // 这里的 isExitInit 用来判断 TUICallKit init 方法是否存在
        // 当 isExitInit 为 true 时，进行 callkit 初始化和日志上报
        const isExitInit = (this.TUICallKit.init !== undefined);
        if (this.TUICallKit !== null && isExitInit) {
          wx.aegis.reportEvent({
            name: 'TUICallKit',
            ext1: 'TUICallKitInit',
            ext2: wx.$chat_reportType,
            ext3: wx.$chat_SDKAppID,
          });
          this.TUICallKit.init();
          wx.setStorageSync('_isTIMCallKit', true);
          wx.$_isTIMCallKit = '_isTIMCallKit';
          this.setData({
            hasCallKit: true,
          });
        }
      });
      const TUIConversation = this.selectComponent('#TUIConversation');
      TUIConversation.init();
      if (!app.globalData || app.globalData.reportType !== constant.OPERATING_ENVIRONMENT) {
        this.aegisInit();
      }
      wx.$chat_reportType = 'chat-uikit-wechat';
      wx.aegis.reportEvent({
        name: 'time',
        ext1: 'first-run-time',
        ext2: wx.$chat_reportType,
        ext3: wx.$chat_SDKAppID,
      });
    },
    aegisInit() {
      wx.aegis = new Aegis({
        id: 'iHWefAYquFxvklBblC', // 项目key
        reportApiSpeed: true, // 接口测速
        reportAssetSpeed: true, // 静态资源测速
        pagePerformance: true, // 开启页面测速
      });
    },
    currentConversationID(event) {
      this.setData({
        isShowConversation: true,
        isShowConversationList: false,
        currentConversationID: event.detail.currentConversationID,
        unreadCount: event.detail.unreadCount,
      }, () => {
        const TUIChat = this.selectComponent('#TUIChat');
        TUIChat.init();
      });
    },
    showConversationList() {
      this.setData({
        isShowConversation: false,
        isShowConversationList: true,
      }, () => {
        const TUIConversation = this.selectComponent('#TUIConversation');
        TUIConversation.init();
      });
    },
    handleCall(event) {
      if (event.detail.groupID) {
        this.TUICallKit.groupCall(event.detail);
      } else {
        this.TUICallKit.call(event.detail);
      }
    },
    sendMessage(event) {
      this.selectComponent('#TUIChat').sendMessage(event);
    },
  },
});

}, function(modId) {var map = {"./utils/constant":1690768904621}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1690768904621, function(require, module, exports) {
const constant = {
  FEAT_NATIVE_CODE: {
    NATIVE_VERSION: 1,
    ISTYPING_STATUS: 1,
    NOTTYPING_STATUS: 1,
    ISTYPING_ACTION: 14,
    NOTTYPING_ACTION: 0,
    FEAT_TYPING: 1
  },
  TYPE_INPUT_STATUS_ING: 'EIMAMSG_InputStatus_Ing',
  TYPE_INPUT_STATUS_END: 'EIMAMSG_InputStatus_End',
  MESSAGE_TYPE_TEXT: {
    TIM_CUSTOM_ELEM: 'TIMCustomElem',
  },
  BUSINESS_ID_TEXT: {
    USER_TYPING: 'user_typing_status',
    EVALUATION: 'evaluation',
    ORDER: 'order',
    LINK: 'text_link',
    CREATE_GROUP: 'group_create',
    CONSULTION: 'consultion',
  },

  STRING_TEXT: {
    TYPETYPING: '对方正在输入...',
    TYPETEXT: '对本次服务的评价',
  },
  MESSAGE_ERROR_CODE: {
    DIRTY_WORDS: 80001,
    UPLOAD_FAIL: 6008,
    REQUESTOR_TIME: 2081,
    DISCONNECT_NETWORK: 2800,
    DIRTY_MEDIA: 80004,
    UNUPLOADED_PICTURE: 2040,
    UNUPLOADED_MEDIA: 2350,
    BLACKLIST_MEMBER: 20007,
    NOT_GROUP_MEMBER: 10007
  },
  TOAST_TITLE_TEXT: {
    DIRTY_WORDS: '您发送的消息包含违禁词汇!',
    UPLOAD_FAIL: '文件上传失败!',
    CONNECT_ERROR: '网络已断开',
    DIRTY_MEDIA: '您发送的消息包含违禁内容!',
    RESEND_SUCCESS: '重发成功',
    UNUPLOADED_PICTURE: '上传图片失败，请检查您是否未注册上传插件',
    UNUPLOADED_MEDIA: '上传视频失败，请检查您是否未注册上传插件',
    BLACKLIST_MEMBER: '您已被拉黑，无法对此人发送信息！',
    NOT_GROUP_MEMBER: '您已不在此群组中！'
  },

  OPERATING_ENVIRONMENT: 'imWxTuikit'
};


if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = constant;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1690768904620);
})()
//miniprogram-npm-outsideDeps=["aegis-mp-sdk"]
//# sourceMappingURL=index.js.map