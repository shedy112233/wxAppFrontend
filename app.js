App({
  onLaunch: function () {

  },
  onUnload() {
    
  },
  onHide(options){
    console.log('--------------onHide-------------')
    console.log(this.globalData.userInfo.phone)
    console.log('--------------onHide-------------')
    this.globalData.userInfo.phone = ''
    wx.reLaunch({
      url: './pages/login/login',
    })
  },
  globalData: {
    config: {
      userID: '', // User ID administrator
      SECRETKEY: '221ad353900437fa8480984ae322d4f604a617ca65e9c1b4dfda1852267e594f', // Your secretKey
      SDKAPPID: 1400811533, // Your SDKAppID
      EXPIRETIME: 604800
    },
    baseUrl: 'https://eicos.com.cn:8085',
    // baseUrl: 'http://localhost:8082/ta404',
    userInfo:{
      Img: '',
      nickName: '',
      phone: '',
      show: false,
      userRole: 'PHYSICIAN'
    },
    isScanCodeRegist: false,
  },
  // onSDKReady(event) {
  //   // 监听到此事件后可调用 SDK 发送消息等 API，使用 SDK 的各项功能。
  // }
})
