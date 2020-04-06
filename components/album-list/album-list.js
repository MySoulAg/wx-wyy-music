// components/album-list/album-liat.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    albumList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**点击歌单 */
    goAlbumDetail(e) {
      this.triggerEvent("getId", {
        id: e.currentTarget.dataset.id
      })
      // console.log(e.currentTarget.dataset.id)
    }
  }
})