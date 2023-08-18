// pages/setting/components/settingBz.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    tagStyle: [],
    value: '',
    selectTags: [],
    indexs: [],
    tagsList: [],
    bz: '',
    value: '',
    message: ''
  },

  clickIcon(e){
    wx.request({
      url: app.globalData.baseUrl + '/wx/getTags',
      data:{
        // operateUser: app.globalData.userInfo.phone,
        operateUser: '15124869312',
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res => {
        const result = res.data.data.resultData
        if(result.status === 200) {
          this.setData({
            tagsList: result.data
          })
        }
      }
    })
    this.setData({
      show: true
    })
  },
  onClose(){
    this.setData({
      show: false
    })
  },
  sureInfo(e){
    let length = this.data.selectTags.length
    if(length > 0){
      let value = ''
      for (let i = 0; i<length;i++){
        if(i === 0){
          value = this.data.selectTags[i].name
        } else {
          value += ',' + this.data.selectTags[i].name
        }
      }
      this.setData({
        value: value
      })
    }
  },
  getTag(e){
    const name = e.currentTarget.dataset.name
    const index = e.currentTarget.dataset.index
    if(this.data.selectTags.findIndex(item => item.name === name)===-1){
      const style = 'background-color: #63f960'
      const param = {index: index,name: name}
      const styleParam = {index: index,style: style}
      if(this.data.tagStyle.findIndex(obj => obj.index === index)!==-1){
        this.data.tagStyle[index].style = style
        this.setData({
          tagStyle: this.data.tagStyle
        })
      } else {
        this.setData({
          tagStyle: [...this.data.tagStyle,styleParam]
        })
      }
      this.setData({
        selectTags: [...this.data.selectTags,param],
      })
    }
    console.log(this.data.selectTags)
  },
  delTag(e){
    const index = e.currentTarget.dataset.index
    const newIndex = this.data.selectTags.findIndex(item => item.index === index)
    if(newIndex != -1){
      this.data.indexs.splice(newIndex,1)
      this.data.selectTags.splice(newIndex,1)
      this.data.tagStyle.splice(newIndex,1)
      this.setData({
        selectTags: this.data.selectTags,
        tagStyle: this.data.tagStyle,
        indexs: this.data.indexs
      })
    }
  },
  onClickLeft(e){
    wx.navigateBack({
      delta: 1,
    })
  },
  onClickRight(e){
    const selectPerson = wx.getStorageSync('selectPerson')
    wx.request({
      url: app.globalData.baseUrl + '/wx/updatePersonInfo',
      data:{
        phone: selectPerson.phone,
        nickName: selectPerson.nickName,
        tags: this.data.value,
        bz: this.data.bz,
        desc: this.data.message,
        operator: app.globalData.userInfo.phone
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res => {
        if(res.data.errors.length === 0){
          wx.setStorageSync('tags', this.data.value)
          wx.reLaunch({
            url: './../../../friend/friend'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const selectPerson = wx.getStorageSync('selectPerson')
    this.setData({
      bz: selectPerson.bz
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