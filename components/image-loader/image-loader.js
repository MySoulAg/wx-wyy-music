// components/image-loader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLoading: true
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**图片加载完成时触发 */
    bindload() {
      this.setData({
        isLoading: false
      })
    }
  }
})