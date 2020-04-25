// pages/user/user.js
import request from '../../api/index.js'
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:null,
    navHeight:App.globalData.navHeight,
    tabBarHeight:App.globalData.tabBarHeight,
    userList: [], //我的歌单列表
    userName: "", //用户名
    avatarUrl: "" //用户头像
  },

  getId(e){
    console.log(e.detail.id)
    wx.navigateTo({
      url: '../albumDetail/albumDetail'+`?id=${e.detail.id}`
    })
  },

  /**获取我的歌单 */
  getUserList(id) {
    wx.showLoading({
      title: '加载中',
    })
    request.getUserList(id).then(res => {
      wx.hideLoading()
      if (res && res.code == 200 && res.playlist.length != 0) {
        this.setData({
          userList: res.playlist,
          userName: res.playlist[0].creator.nickname,
          avatarUrl: res.playlist[0].creator.avatarUrl
        })
        // this.$refs.maskRef.style.backgroundImage = `url(${this.avatarUrl})`;
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserList(361753092)
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