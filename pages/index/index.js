// pages/index/index.js
import request from '../../api/index.js'
const App =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight:App.globalData.navHeight,
    tabBarHeight:App.globalData.tabBarHeight,
    picUrl:null,
    recommendedList: [] //歌单列表
  },

  getId(e) {
    console.log(e.detail.id)
    wx.navigateTo({
      url: '../albumDetail/albumDetail' + `?id=${e.detail.id}`
    })
  },

  /**获取推荐歌单 */
  getRecommendedList() {
    request.getRecommendedList().then(res => {
      console.log(res);
      if (res && res.code == 200) {
        this.setData({
          recommendedList: res.result
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommendedList()
  },

  bindgetuserinfo(e){
    console.log(e)
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
    wx.showTabBar({
      animation: false,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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