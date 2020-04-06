// components/play-list-popup/play-list-popup.js
const App = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: Boolean
  },

  lifetimes: {
    attached: function () {

      this.setData({
        currentSongList: App.globalData.currentSongList

      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentSongList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**点击关闭弹出层 */
    closePopup() {
      this.triggerEvent("handlePopup", {
        isShow: false
      })
    },

    /**点击列表 切换歌曲 */
    playingById(e) {
      this.triggerEvent("playingById", {
        songId: e.currentTarget.dataset.songid
      })
    },

    /**删除列表 */
    delete(e) {
      this.data.currentSongList.splice(e.currentTarget.dataset.index, 1)
      this.setData({
        currentSongList: this.data.currentSongList
      })
      App.globalData.currentSongList = this.data.currentSongList
    }
  }
})