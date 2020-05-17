// pages/albumDetail/albumDetail.js
import request from '../../api/index.js'
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: App.globalData.navHeight * 750 / wx.getSystemInfoSync().windowWidth,
    tabBarHeight: App.globalData.tabBarHeight,
    picUrl: null,
    coverImgUrl: "", //封面、背景
    name: "", //歌单标题
    avatarUrl: "", //头像
    nickname: "", //昵称
    description: "", //描述
    songList: [], //歌曲信息
    currentIndex: -1, //当前歌单播放的下标
  },

  /**点击歌曲列表 跳 播放 */
  goPlay(e) {
    
    App.globalData.currentSongList = this.data.songList
    if (e.currentTarget.dataset.songid != App.globalData.currentSongId) {
      App.globalData.currentSongId = e.currentTarget.dataset.songid
      App.globalData.currentSongIndex = e.currentTarget.dataset.index
      App.globalData.isChangeSongId = true
    } else {
      App.globalData.isChangeSongId = false
    }
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '../play/play'
    })
  },

  /**获取歌单详情 */
  getAlbumDetail(id) {
    wx.showLoading({
      title: '加载中',
    })
    request.getAlbumDetail(id).then(res => {
      wx.hideLoading()
      console.log(res);
      this.setData({
        coverImgUrl: res.playlist.coverImgUrl,
        name: res.playlist.name,
        avatarUrl: res.playlist.creator.avatarUrl,
        nickname: res.playlist.creator.nickname,
        description: res.playlist.description,
        songList: res.playlist.tracks
      })
      for (let i = 0, len = res.playlist.tracks.length; i < len; i++) {
        if (res.playlist.tracks[i].id == App.globalData.currentSongId) {
          this.setData({
            currentIndex: i
          })
          return
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    App.watchSongId(this.watchBackwatchSongId)
    App.watchPicUrl(this.watchBackPicUrl)
    this.getAlbumDetail(options.id)
  },

  /**
   * 监听 picUrl 的变化
   */
  watchBackPicUrl: function (juju) {
    console.log(juju,33333333)
    this.setData({
      picUrl: App.globalData.songDetail.picUrl,
    })
  },

  /**
   * 监听 currentSongId 的变化
   */
  watchBackwatchSongId: function (dthbgth) {
    console.log(dthbgth,44444444)
    for (let i = 0, len = this.data.songList.length; i < len; i++) {
      if (this.data.songList[i].id == App.globalData.currentSongId) {
        this.setData({
          currentIndex: i
        })
        return
      }
    }
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
    this.setData({
      picUrl: App.globalData.songDetail.picUrl,
    })
    for (let i = 0, len = this.data.songList.length; i < len; i++) {
      if (this.data.songList[i].id == App.globalData.currentSongId) {
        this.setData({
          currentIndex: i
        })
        return
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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