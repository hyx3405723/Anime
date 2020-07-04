const DB = wx.cloud.database();
Page({
  data: {
    current: 0,
    // tabs切换数据
    tabs: [],
  },
  // 页面开始加载 就会触发
  onLoad: function(options) {
    // 获取tabs切换数据
    this.getTabsList();
    // 获取视频中心的数据
    this.getVideoList();
  },
  // 获取选项卡的数据
  getTabsList() {
    DB.collection('Anime_Tabs').get({
      success: (res) => {
        this.setData({
          tabs: res.data
        })
      }
    })
  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs         
    })
  },
  // 获取视频中心的数据
  getVideoList() {
    DB.collection('Anime_audio_info').get({
      success: (res) => {
        getApp().globalData.videoList = res.data;
      }
    })
  },
  //tabs交换事件
  onClickItem(e) {
    if (this.current !== e.currentIndex) {
      this.current = e.currentIndex;
    }
  }
})