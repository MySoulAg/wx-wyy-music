//app.js
App({
  onLaunch: function () {
    var audioCxt = wx.createInnerAudioContext()
    this.globalData.audioCxt = audioCxt

    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    this.globalData.menuButtonWidth = menuButtonObject.width
    wx.getSystemInfo({
      success: res => {

        //导航高度
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
        //屏幕高度
        let ktxScreentHeight = res.screenHeight
        // window的高度
        let ktxWindowHeight = res.windowHeight
        this.globalData.tabBarHeight = ktxScreentHeight - ktxWindowHeight
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.windowWidth = res.windowWidth;
      },
      fail(err) {
        console.log(err);
      }
    })

  },
  globalData: {
    audioCxt: null,
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    currentSongId: null,
    currentSongList:null,
    currentSongIndex:null,
    playingType: 0, //播放模式   0：循序播放（默认）1：单曲循环 2：随机播放
    isChangeSongId:false,//是否是带着id跳转到play页面
    songDetail: {
      authorName: '', //歌手
      musicName: '', //歌曲名
      picUrl: null, //封面
      totleTime: 0, //歌曲总时间
    },
    playingState: false, //播放状态
    nolyric: false, //是否无歌词
    lyricArr: [], //歌词
    lyricBoxArr: [], //装歌词的盒子,用来计算歌词的滚动高度
  }
})