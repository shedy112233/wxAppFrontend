// pages/msg/msg.js
import TIM from 'tim-wx-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin';
import { genTestUserSig } from './../../debug/GenerateTestUserSig';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    config: {},
    searchUser: {},
    conversationList: [],
  },
  onChange(event) {
    this.setData({ active: event.detail });
  },
  onClose(event) {
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close();
        });
        break;
    }
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
    wx.$TUIKit.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
    wx.$TUIKit.registerPlugin({ 'tim-profanity-filter-plugin': TIMProfanityFilterPlugin });
    wx.$TUIKit.login({
      userID: app.globalData.config.userID,
      userSig
    });
    this.config = app.globalData.config
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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
    wx.$TUIKit.off(wx.$TUIKitTIM.EVENT.SDK_READY, this.onSDKReady,this);
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
    console.log(event)
    wx.$TUIKit.on(wx.$TUIKitTIM.EVENT.SDK_READY, this.onSDKReady,this);

    wx.$TUIKit.getConversationList().then((imResponse) => {
      console.log(imResponse)
      this.setData({
        conversationList: imResponse.data.conversationList,
      });
      // this.filterUserIDList(imResponse.data.conversationList);
    });
  }
})