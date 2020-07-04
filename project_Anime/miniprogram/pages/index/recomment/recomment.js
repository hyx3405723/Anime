// components/Tabs/Tabs.js
const DB = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 楼层数据
    floorList: {}
  },
  ready() {
    this.getSwiperList();
    this.getFloorList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取轮播图数据
    getSwiperList() {
      DB.collection('Anime').get({
        success: (res) => {
          this.setData({
            swiperList: res.data
          })
        }
      })
    },
    // 获取 楼层数据
    getFloorList() {
      DB.collection('Anime_floorList').get({
        success: (res) => {
          this.setData({
            floorList: res.data
          })
        }
      })
    },
    // 点击事件
    handleItemTap(e) {
      // 1 获取点击的索引
      const {
        index
      } = e.currentTarget.dataset;
      // 2 触发 父组件中的事件 自定义
      this.triggerEvent("tabsItemChange", {
        index
      });
    }
  }
})