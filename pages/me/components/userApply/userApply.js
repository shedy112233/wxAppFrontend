// pages/me/components/userApply/userApply.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearch: false,
    invitedUserList: [],
  },
  onClickLeft() {
    console.log('1')
  },
  onClickLeft(){
    wx.reLaunch({
      url: './../../me',
    })
  },
  onClickRight(){
    this.setData({
      isSearch: true
    })
  },
  onCancel(){
    this.setData({
      isSearch: false
    })
    const invitedUserList = wx.getStorageSync('invitedUserList')
    this.setData({
      invitedUserList: invitedUserList
    })
  },
  onSearch(e){
    const value = e.detail.value
    const invitedUserList = wx.getStorageSync('invitedUserList')
    if(value != ''){
      let list = this.data.invitedUserList.filter(item => item.invitedNickName === value || item.invitedPhone === value)
      this.setData({
        invitedUserList: list
      })
    } else {
      this.setData({
        invitedUserList: invitedUserList
      })
    }
  },
  sureInvite(e){
    console.log(e)
    const info = e.currentTarget.dataset.info
    wx.request({
      url: app.globalData.baseUrl + '/wx/updateInvitedInfo',
      data: {
        id: info.id,
        invitePhone: info.invitePhone,
        invitedPhone: info.invitedPhone,
        yesOrNo: 'yes'
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{
        wx.navigateTo({
          url: './userApply',
        })
      }
    })
  },
  refuseInvite(e){
    const info = e.currentTarget.dataset.info
    wx.request({
      url: app.globalData.baseUrl + '/wx/updateInvitedInfo',
      data: {
        id: info.id,
        invitePhone: info.invitePhone,
        invitedPhone: info.invitedPhone,
        yesOrNo: 'no'
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{wx.navigateTo({
        url: './userApply',
      })}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: app.globalData.baseUrl + '/wx/getInvitedInfo',
      data: {
        phone: app.globalData.userInfo.phone
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res =>{
        const result = res.data.data.resultData
        if(result.data.length > 0) {
          this.setData({
            invitedUserList: result.data
          })
          wx.setStorageSync('invitedUserList', result.data)
        }
      }
    })
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