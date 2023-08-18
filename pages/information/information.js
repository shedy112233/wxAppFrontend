// pages/information/information.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: '4000',
    picList: [],
    artList: []
  },

  format(dataString){
		//dataString是整数，否则要parseInt转换
		var time = new Date(dataString);
		var year = time.getFullYear();
		var month = time.getMonth()+1;
		var day = time.getDate();
		var hour = time.getHours();
		var minute = time.getMinutes();
		var second = time.getSeconds();
		return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day)+' '+(hour<10?'0'+hour:hour)+':'+(minute<10?'0'+minute:minute)+':'+(second<10?'0'+second:second)
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let timestamp = Date.parse(new Date());
    const date = this.format(timestamp)
    wx.request({
      url: app.globalData.baseUrl + '/weChatPic/queryWechatPicInfoListForSort',
      data:{
        startTime: date,
        endTime: date
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: res => {
        console.log(res)
        const list = res.data.data.wechatPicList
        this.setData({
          picList: list
        })
        console.log(this.data.picList)
        wx.request({
          url: app.globalData.baseUrl + '/weChatArticle/queryWechatArticleInfoListForSort',
          data:{
            startTime: date,
            endTime: date
          },
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded'},
          success: res => {
            console.log(res)
            const artList = res.data.data.wechatArticleList
            this.setData({
              artList: artList
            })
            console.log(this.data.artList)
          },
          fail: err => {
            console.log(err)
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  toArtInfo(event){
    const artInfo = event.currentTarget.dataset.art
    console.log(artInfo)
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: artInfo.path,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: 'docx',
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },
  toOtherUrl(){
    wx.navigateTo({
      url: 'https://www.baidu.com'
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

  }
})