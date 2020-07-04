const db = wx.cloud.database();
const anime = db.collection("Anime_Category");
const _ = db.command;
Page({
  data: {
    current: 'tab1',
    // 分类数据
    tabs: [],
  },
  // tabs切换时，key，index发生改变
  onTabsChange(e) {
    const {
      key
    } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)
    this.setData({
      key,
      index,
    })
  },
  // tabs切换事件
  onSwiperChange(e) {
    const {
      current: index,
      source
    } = e.detail
    const {
      key
    } = this.data.tabs[index]
    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
  },
  // 获取分类数据
  getList() {
    anime.get({
      success: res => {
        this.setData({
          tabs: res.data
        })
      }
    })
  },
  onShow() {
    this.getList()
  },
  // 获取历史记录数据
  getHistoryInfo(e){
    db.collection('Anime_audio_info').where({
      audio_id: e.currentTarget.dataset.index
    }).get({
      success: res=>{
        wx.cloud.callFunction({
          name: 'addhistory',
          data: {
            id:res.data[0].audio_id,
            time:util.formatTime(new Date()),
            history_image:res.data[0].image_src, 
            title:res.data[0].audio_title,
            history_name:res.data[0].audio_name,
            navigateto_url:'/pages/video/index?audio_id='+res.data[0].audio_id
          },
          success: res => {
          },
          fail:fail=>{
            console.log(fail)
          }
        })
      }
    })
  }
})