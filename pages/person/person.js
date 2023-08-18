// pages/person/person.js
import logger from './../TUIKit/utils/logger';
import constant from './../TUIKit/utils/constant';
import TIM from 'tim-wx-sdk';
import { genTestUserSig } from './../../debug/GenerateTestUserSig';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    show: false,
    actions: [
      {
        name: '设置备注',
      },
    ],
    phone: '',
    bz: '',
    isSettingBz: false,
    conversation:{}
  },
  onClose() {
    this.setData({ show: false });
  },

  sureInfo(){
    wx.request({
      url: app.globalData.baseUrl + '/wx/updatePersonInfo',
      data:{
        phone: this.data.phone,
        bz: this.data.bz
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res => {
        console.log('===========================')
        this.setData({
          isSettingBz: false
        })
        wx.reLaunch({
          url: './../friend/friend',
        })
      }
    })
  },
  fnClose(){
    this.setData({
      isSettingBz: false
    })
  },

  onSelect(event) {
    if('设置备注' === event.detail.name){
      this.setData({
        isSettingBz: true
      })
    }
  },
  bindShowMsg(){
    this.setData({
      show: true
    })
  },
  toSendMsg(event){
    wx.$TUIKit.setMessageRead({ conversationID: 'C2C' + this.data.phone }).then(() => {
      logger.log('| TUI-chat | setMessageRead | ok');
    });
    wx.$TUIKit.getConversationProfile('C2C' + this.data.phone).then((res) => {
      console.log(res)
      const { conversation } = res.data;
      this.setData({
        conversationName: this.getConversationName(conversation),
        conversation,
        isShow: conversation.type === wx.$TUIKitTIM.TYPES.CONV_GROUP,
      });
      /**
         * 将即将创建的会话在数据库做记录
         */
        wx.request({
          url: app.globalData.baseUrl + '/im/insertConversation',
          data:{
            fromId: app.globalData.userInfo.phone,
            toId: this.data.phone,
            conversationId: 'C2C' + this.data.phone
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded'},
          success: res => {
            console.log(res)
          },
          fail: err => {

          }
        })
      wx.reLaunch({
        url: './../index/index',
      })
      if (conversation.type !== wx.$TUIKitTIM.TYPES.CONV_GROUP) return;
      
    });
  },
  getConversationName(conversation) {
    if (conversation.type === '@TIM#SYSTEM') {
      this.setData({
        showChat: false,
      });
      return '系统通知';
    }
    if (conversation.type === wx.$TUIKitTIM.TYPES.CONV_C2C) {
      return conversation.remark || conversation.userProfile.nick || conversation.userProfile.userID;
    }
    if (conversation.type === wx.$TUIKitTIM.TYPES.CONV_GROUP) {
      return conversation.groupProfile.name || conversation.groupProfile.groupID;
    }
  },
  goBack(){
    wx.navigateBack({
      delta: 1,
    })
  },
  toTagsSetting(e){
    wx.navigateTo({
      url: '../setting/components/settingBz/settingBz',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.$TUIKit = TIM.create({
      SDKAppID: app.globalData.config.SDKAPPID,
    });
    const userSig = genTestUserSig(app.globalData.config).userSig 
    wx.$chat_SDKAppID = app.globalData.config.SDKAPPID;
    wx.$TUIKitTIM = TIM;
    wx.$chat_userID = app.globalData.config.userID;
    wx.$chat_userSig = userSig;
    wx.$TUIKit.login({
      userID: app.globalData.config.userID,
      userSig
    });
    wx.$TUIKit.setLogLevel(1)
    const selectPerson = wx.getStorageSync('selectPerson')
    const tags = wx.getStorageSync('tags')
    this.setData({
      avatarUrl: selectPerson.avatarUrl,
      nickName: selectPerson.nickName,
      phone: selectPerson.phone,
      bz: selectPerson.bz,
      tagName: tags
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const selectPerson = wx.getStorageSync('selectPerson')
    wx.request({
      url: app.globalData.baseUrl + '/wx/getPersonTags',
      data:{
        operator: app.globalData.userInfo.phone,
        phone: selectPerson.phone
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{
        console.log(res)
        const result = res.data.data.resultData
        if(result.status === 200) {
          this.setData({
            tagName: result.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onSDKReady(event) {
    // 监听到此事件后可调用 SDK 发送消息等 API，使用 SDK 的各项功能。
    // 监听系统级事件
    wx.$TUIKit.on(wx.$TUIKitTIM.EVENT.SDK_READY, this.onSDKReady,this);
  }
})