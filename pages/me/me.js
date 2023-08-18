// pages/me/me.js
import TIM from 'tim-wx-sdk';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    nickName: '(暂无昵称)',
    Img: '../../images/jietu.png',
    phone: '',
    showCode: false,
    inviteCode: '',
    isShow: false,
    qrCodeUrl: '',
    isShowActive: false,
    isEdit: false,
    value: '',
    isEditAvatar: false,
  },
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
  editNickName(e){
    let info = e.currentTarget.dataset
    this.setData({
      isEdit: true,
      value: info.nickname
    })
  },
  fnConfirm(){
    wx.request({
      url: app.globalData.baseUrl + '/wx/editUserInfo',
      data:{
        nickName: this.data.value,
        phone: this.data.phone
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{
        const result = res.data.data.resultData
        if(result.status === 200) {
          app.globalData.userInfo.nickName = this.data.value
          this.setData({
            nickName: this.data.value
          })
        }
      }
    })
  },
  editImage(){
    
  },
  toLogin(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  getMyActiveCode(){
    wx.request({
      url: app.globalData.baseUrl + '/qrcode/queryQRCode',
      data:{
        userId: this.data.phone,
      },
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{
        this.setData({
          qrCodeUrl: res.data.data.codePath,
          isShow: true
        })
      },
    })
  },
  getMyCode(){
    this.setData({
      isShow: true
    })
  },
  onClose(){
    this.setData({
      isShow: false,
      isEdit: false,
    })
  },
  getInvitationCode(){
    wx.request({
      url: app.globalData.baseUrl + '/wx/getInviteCode',
      data: {
        userId: this.data.phone
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res => {
        const result = res.data.data.resultData
        this.setData({
          showCode: true,
          inviteCode: result.data
        })
      }
    })
  },
  goBack(){
    app.globalData.userInfo.Img = ''
    app.globalData.userInfo.nickName = ''
    app.globalData.userInfo.phone = ''
    app.globalData.config.userID = ''
    wx.clearStorageSync()
    this.data.Img = ''
    this.data.nickName = ''
    this.data.phone = ''
    let promise = wx.$TUIKit.logout();
    promise.then(function(imResponse) {
      console.log(imResponse.data); // 登出成功
    }).catch(function(imError) {
      console.warn('logout error:', imError);
    });
    wx.reLaunch({
      url: '../me/me',
    })
  },
  toUserApply(e){
    wx.navigateTo({
      url: './components/userApply/userApply',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.$TUIKit = TIM.create({
      SDKAppID: app.globalData.config.SDKAPPID,
    });
    if(app.globalData.userInfo.Img !== ''){
      this.setData({
        Img: app.globalData.userInfo.Img
      })
    } 
    if (app.globalData.userInfo.nickName !== '') {
      this.setData({
        nickName: app.globalData.userInfo.nickName
      })
    }
    if(app.globalData.userInfo.phone !== '') {
      this.setData({
        phone: app.globalData.userInfo.phone
      })
    }
    if(app.globalData.userInfo.userRole != ''){
      this.setData({
        userRole: app.globalData.userInfo.userRole,
        showCode: false
      })
    }
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

  }
})