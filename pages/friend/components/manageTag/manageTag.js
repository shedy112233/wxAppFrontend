// pages/friend/components/manageTag/manageTag.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagList: [{tagName: '朋友',toolsImGroupTagUserVos:[{nickName: '张三'}]}],
    result: []
  },
  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  noop() {},

  clear(){
    wx.request({
      url: app.globalData.baseUrl + '/tag/deleteInfo',
      data:{
        selectedInfo: this.data.result,
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res => {
        wx.navigateTo({
          url: './../tags/tags',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let tagList = wx.getStorageSync('tagList')
    console.log(tagList)
    this.setData({
      tagList: tagList
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