// pages/play/play.js
const audioCxt = getApp().globalData.audioCxt;
const selectorQuery3 = getApp().globalData.selectorQuery;
const App = getApp();

//songUrl:  http://m8.music.126.net/20200320162957/564329e54e7c68069752fcf71f6cef80/ymusic/b77b/bdc2/dd34/1af5d236ad9e8b3ae1057d825a6b105c.mp3
//songId: 557581476

import request from '../../api/index.js'
const {
  parseLyric
} = require("../../utils/util.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    animation:true,//用于切换歌曲后，封面的重新开始动画
    isShowLyric:false,//是否显示歌词
    isLoading: true, //背景图的占位图
    isShow: false, //是否显示列表弹出层
    playingType: 0, //播放模式
    navTop: 0,
    titleWidth: 0,
    playingState: false, //播放状态
    currentTime: 0, //当前播放时间
    sliderValue: 0, //进度条的值
    songDetail: {
      authorName: '', //歌手
      musicName: '', //歌曲名
      picUrl: null, //封面
      totleTime: 0, //歌曲总时间
    },
    nolyric: false, //是否无歌词
    lyricArr: [], //歌词
    lyricBoxArr: [], //装歌词的盒子,用来计算歌词的滚动高度
    currentIndex: -1, //当前播放的歌词下表
    scrollHeight: 0 //歌词滚动的高度
  },

  /**初始化监听 */
  listenInit() {

    //监听是否可以播放
    audioCxt.onCanplay(() => {
      wx.hideLoading()
      console.log("可以播放了")
      if (this.data.playingState) {
        audioCxt.play()
      }

    })
    //监听播放
    audioCxt.onPlay(() => {
      console.log("开始播放了start")
      this.setData({
        playingState: true
      })
      App.globalData.playingState = true
    })
    //监听停止事件
    audioCxt.onStop(() => {
      console.log("播放停止了end")
      this.setData({
        playingState: false
      })
      App.globalData.playingState = false
    })
    //监听音频自然播放至结束
    audioCxt.onEnded(() => {
      console.log("自然播放结束了end")
      this.setData({
        playingState: false,
        currentTime: 0,
        sliderValue: 0,
        currentIndex: -1,
        scrollHeight: 0,
      })
      App.globalData.playingState = false
      audioCxt.startTime = 0
      this.playNext();
    })
    //监听暂停
    audioCxt.onPause(() => {
      console.log("播放暂停了pause")
      this.setData({
        playingState: false
      })
      App.globalData.playingState = false
    })
    //监听播放进度更新事件
    audioCxt.onTimeUpdate(() => {
      console.log("播放进度正在更新" + parseInt(audioCxt.currentTime))
      this.lyricScroll(audioCxt.currentTime);
      if (this.data.currentTime + 1 == parseInt(audioCxt.currentTime)) {
        this.setData({
          currentTime: this.data.currentTime + 1,
          sliderValue: this.data.sliderValue + 500 / this.data.songDetail.totleTime
        })
      }
    })
    //监听用户在系统音乐播放面板点击下一曲事件（仅iOS）
    audioCxt.onNext(() => {
      console.log("系统音乐播放面板点击下一曲事件")
      this.playNext()
    })
    //监听用户在系统音乐播放面板点击上一曲事件（仅iOS）
    audioCxt.onPrev(() => {
      console.log("系统音乐播放面板点击上一曲事件")
      this.playPrev()
    })
    //监听播放错误事件
    audioCxt.onError(() => {
      console.log("播放错误！！！")
    })
    //当音频因为数据不足，需要停下来加载
    audioCxt.onWaiting(() => {
      console.log("音频加载中。。。")
    })
    //监听音频进行跳转操作
    audioCxt.onSeeking(() => {
      console.log("正在跳转ing")
    })
    //监听音频完成跳转操作
    audioCxt.onSeeked(() => {
      console.log("跳转结束end")

    })
  },

  /**显示封面 或 歌词 */
  target(){
    this.setData({
      isShowLyric:!this.data.isShowLyric
    })
  },

  /**背景图片加载完成时触发 */
  bindload() {
    this.setData({
      isLoading: false
    })
  },

  /**进度条拖动过程中 */
  bindchanging(e) {
    let temTime = this.data.songDetail.totleTime * e.detail.value / 500
    this.setData({
      currentTime: parseInt(temTime)
    })
  },

  /**完成进度条的拖动 */
  bindchange(e) {
    let temTime = this.data.songDetail.totleTime * e.detail.value / 500
    audioCxt.seek(temTime)
    this.setData({
      sliderValue: e.detail.value,
      currentTime: parseInt(temTime)
    })

    if (temTime > this.data.lyricArr[this.data.lyricArr.length - 1].time) {
      let temHeight = 0
      for (let i = 0, len = this.data.lyricBoxArr.length - 1; i < len; i++) {
        temHeight += this.data.lyricBoxArr[i].height
      }
      this.setData({
        scrollHeight: temHeight,
        currentIndex: this.data.lyricArr.length - 1
      })
      return
    }

    for (let i = 0, len = this.data.lyricArr.length; i < len; i++) {
      if (temTime > this.data.lyricArr[i].time && temTime < this.data.lyricArr[i + 1].time) {
        let temHeight = 0
        for (let j = 0; j < i; j++) {
          temHeight += this.data.lyricBoxArr[j].height
        }
        this.setData({
          scrollHeight: temHeight,
          currentIndex: i
        })
      }
    }
  },

  /**点击列表图标 */
  showPopup() {
    this.setData({
      isShow: true
    })
  },

  /**监听组件的函数 */
  handlePopup(e) {
    this.setData({
      isShow: e.detail.isShow
    })
  },

  /**点击弹出层的列表 播放 */
  playingById(e) {
    this.playInit(e.detail.songId);
  },

  /**点击播放/暂停 */
  playOrPause() {
    this.data.playingState ? audioCxt.pause() : audioCxt.play()
  },

  /**点击播放模式 */
  playType() {
    if (App.globalData.playingType === 2) {
      App.globalData.playingType = 0
      this.setData({
        playingType: 0
      })
    } else {
      App.globalData.playingType = App.globalData.playingType + 1;
      this.setData({
        playingType: this.data.playingType + 1
      })
      App.globalData.playingType === 1 ? audioCxt.loop = true : audioCxt.loop = false
    }
  },

  /**点击下一曲 */
  playNext() {
    App.globalData.playingType === 2 ? this.randomSong() : this.orderNextSong()
  },

  /**点击上一曲 */
  playPrev() {
    App.globalData.playingType === 2 ? this.randomSong() : this.orderPrevSong()
  },

  /**随机播放下一曲 或 上一曲 */
  randomSong() {
    let itemIndex //当前播放的歌曲的下标
    App.globalData.currentSongList.forEach((ele, index) => {
      if (ele.id == App.globalData.currentSongId) {
        itemIndex = index
        return
      }
    });
    //随机出一个不包括正在播放列表的下标的随机数，作为下一个随机播放的下标
    let randomIndex = this.getRandom(0, App.globalData.currentSongList.length - 1, itemIndex)
    App.globalData.currentSongId = App.globalData.currentSongList[randomIndex].id
    this.playInit(App.globalData.currentSongId);
  },

  //取两个整数之间，不包括某个整数的随机数
  getRandom(min, max, notInclude) {
    let random = Math.floor(Math.random() * (max - min + 1)) + min
    if (random != notInclude) {
      return random
    } else {
      return this.getRandom(min, max, notInclude)
    }

  },

  /**顺序播放下一曲 */
  orderNextSong() {
    let itemIndex //当前播放的歌曲的下标
    App.globalData.currentSongList.forEach((ele, index) => {
      if (ele.id == App.globalData.currentSongId) {
        itemIndex = index
        return
      }
    });
    if (itemIndex == App.globalData.currentSongList.length - 1) {
      //列表中的最后一首
      App.globalData.currentSongId = App.globalData.currentSongList[0].id
    } else {
      App.globalData.currentSongId = App.globalData.currentSongList[itemIndex + 1].id
    }
    this.playInit(App.globalData.currentSongId);
  },

  /**顺序播放上一曲 */
  orderPrevSong() {
    let itemIndex //当前播放的歌曲的下标
    App.globalData.currentSongList.forEach((ele, index) => {
      if (ele.id == App.globalData.currentSongId) {
        itemIndex = index
        return
      }
    });
    if (itemIndex == 0) {
      //列表中的第一首
      App.globalData.currentSongId = App.globalData.currentSongList[App.globalData.currentSongList.length - 1].id
    } else {
      App.globalData.currentSongId = App.globalData.currentSongList[itemIndex - 1].id
    }
    this.playInit(App.globalData.currentSongId);
  },

  /**获取歌曲的url */
  getSongUrl(songId) {
    return new Promise(resolve=>{
      request.getSongUrl(songId).then(res => {
        resolve()
        if (res.data[0].url) {
          const {
            url
          } = res.data[0]
          audioCxt.src = url
          this.setData({
            playingState: true
          })
          App.globalData.playingState = true
        } else {
          wx.showToast({
            title: '该歌曲不可播放，已切换下一曲',
            icon: 'none',
            duration: 2000
          })
          if (this.data.playingType == 0 || this.data.playingType == 1) {
            //顺序的下一曲
            this.orderNextSong();
          }
          if (this.data.playingType == 2) {
            //随机的下一曲
            this.randomSong();
          }
        }
  
      })
    })


  },

  /**获取音乐详情 */
  getSongDetail(songId) {
    return new Promise(resolve=>{
      request.getSongDetail(songId).then(res => {
        resolve()
        console.log(res);
        audioCxt.title = res.songs[0].name
        audioCxt.singer = res.songs[0].ar[0].name
        audioCxt.coverImgUrl = res.songs[0].al.picUrl
        this.setData({
          "songDetail.authorName": res.songs[0].ar[0].name,
          "songDetail.musicName": res.songs[0].name,
          "songDetail.picUrl": res.songs[0].al.picUrl,
          "songDetail.totleTime": parseInt(res.songs[0].dt / 1000),
          isLoading: true
        })
        App.globalData.songDetail.authorName = res.songs[0].ar[0].name;
        App.globalData.songDetail.musicName = res.songs[0].name;
        App.globalData.songDetail.picUrl = res.songs[0].al.picUrl;
        App.globalData.songDetail.totleTime = parseInt(res.songs[0].dt / 1000);
      });
    }) 
  },

  /**歌词滚动 */
  lyricScroll(newTime) {
    if (this.data.currentIndex == this.data.lyricArr.length - 1)
      return
    if (newTime > this.data.lyricArr[this.data.currentIndex + 1].time) {
      let temHeight = 0
      for (let i = 0, len = this.data.currentIndex + 1; i < len; i++) {
        temHeight += this.data.lyricBoxArr[i].height
      }
      this.setData({
        scrollHeight: temHeight,
        currentIndex: this.data.currentIndex + 1
      })
    }
  },

  /**获取歌词 */
  getLyric(songId) {
    return new Promise(resolve=>{
      request.getLyric(songId).then(res => {
        resolve()
        console.log(res);
        if (res.nolyric || res.needDesc) {
          this.setData({
            nolyric: true,
            lyricArr: []
          })
          App.globalData.nolyric = true
          App.globalData.lyricArr = []
        }else {
          App.globalData.nolyric = false
          App.globalData.lyricArr = parseLyric(res.lrc.lyric)
          this.setData({
            nolyric: false,
            lyricArr: parseLyric(res.lrc.lyric)
          }, () => {
            const query = wx.createSelectorQuery()
            query.selectAll('#lyric-item').boundingClientRect()
            query.exec((res) => {
              this.setData({
                lyricBoxArr: res[0]
              })
              App.globalData.lyricBoxArr = res[0]
            })
          })
        }
        console.log(this.data.lyricArr);
      });
    })
  },

  /**初始化播放 */
  playInit(songId) {
    wx.showLoading({
      title: '加载中',
    })
    audioCxt.stop();
    this.setData({
      playingState: true,
      currentTime: 0,
      sliderValue: 0,
      currentIndex: -1,
      scrollHeight: 0,
      lyricArr: [],
      isLoading: true,
      animation:!this.data.animation
    })
    App.globalData.playingState = true
    App.globalData.lyricArr = []
    audioCxt.startTime = 0
    let r1 = this.getSongDetail(songId);
    let r2 = this.getLyric(songId);
    let r3 = this.getSongUrl(songId);
    Promise.all([r1,r2,r3]).then(res=>{
      wx.hideLoading()
      console.log(res,)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('load')
    this.setData({
      navTop: App.globalData.navTop,
      titleWidth: App.globalData.windowWidth - (App.globalData.menuButtonWidth) * 2 - 50
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
    wx.setKeepScreenOn({
      keepScreenOn: true
    })

    this.listenInit();
    if (App.globalData.isChangeSongId) {
      //从点击歌曲列表进来
      this.playInit(App.globalData.currentSongId);
    } else {
      //从点击屏幕右边的“旋转光碟”进来
      this.setData({
        "songDetail.authorName": App.globalData.songDetail.authorName,
        "songDetail.musicName": App.globalData.songDetail.musicName,
        "songDetail.picUrl": App.globalData.songDetail.picUrl,
        "songDetail.totleTime": App.globalData.songDetail.totleTime,
        currentTime: parseInt(audioCxt.currentTime),
        playingState: App.globalData.playingState,
        sliderValue: 500 * audioCxt.currentTime / App.globalData.songDetail.totleTime,
        nolyric: App.globalData.nolyric,
        lyricArr: App.globalData.lyricArr,
        lyricBoxArr: App.globalData.lyricBoxArr,
        playingType: App.globalData.playingType
      })

      // 找currentIndex
      for (let i = 0, len = App.globalData.lyricArr.length; i < len; i++) {
        if (audioCxt.currentTime < App.globalData.lyricArr[i].time) {
          this.setData({
            currentIndex: i - 1
          })
          break
        }
      }

      //计算歌词滚动的高度
      let temHeight = 0
      for (let i = 0, len = this.data.currentIndex; i < len; i++) {
        temHeight += this.data.lyricBoxArr[i].height
      }
      this.setData({
        scrollHeight: temHeight
      })

    }



  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
    App.globalData.isChangeSongId = false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
    App.globalData.isChangeSongId = false
    App.globalData.playingState = this.data.playingState
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})