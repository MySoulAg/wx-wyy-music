// pages/albumDetail/albumDetail.js
import request from '../../api/index.js'
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight:App.globalData.navHeight,
    tabBarHeight:App.globalData.tabBarHeight,
    picUrl:null,
    coverImgUrl: "", //封面、背景
    name: "", //歌单标题
    avatarUrl: "", //头像
    nickname: "", //昵称
    description: "", //描述
    songList: [] //歌曲信息
  },

  /**点击歌曲列表 跳 播放 */
  goPlay(e){
    App.globalData.currentSongId = e.currentTarget.dataset.songid
    App.globalData.currentSongList = this.data.songList
    App.globalData.currentSongIndex = e.currentTarget.dataset.index
    App.globalData.isChangeSongId = true
    wx.navigateTo({
      url: '../play/play'
    })
  },

  /**获取歌单详情 */
  getAlbumDetail(id) {
    request.getAlbumDetail(id).then(res => {
      console.log(res);
      this.setData({
        coverImgUrl: res.playlist.coverImgUrl,
        name: res.playlist.name,
        avatarUrl: res.playlist.creator.avatarUrl,
        nickname: res.playlist.creator.nickname,
        description: res.playlist.description,
        songList: res.playlist.tracks
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAlbumDetail(options.id)
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
      picUrl:App.globalData.songDetail.picUrl,
    })
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