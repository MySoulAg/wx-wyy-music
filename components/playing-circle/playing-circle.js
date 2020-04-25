// components/playing-circle/playing-circle.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:String
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
    goPlaying(){
      wx.navigateTo({
        url: '../../pages/play/play'
      })
    }
  }
})
