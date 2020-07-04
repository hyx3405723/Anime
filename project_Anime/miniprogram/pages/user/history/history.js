// miniprogram/pages/user/history/history.js
const DB = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 点击更多的历史数据
    moreHistoryList: []
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     //获取更多的历史数据
     this.navigateUrl();
  },
  //获取更多的历史数据
  navigateUrl() {
    DB.collection('Anime_history').get({
      success: (res) => {
        this.setData({
          moreHistoryList: res.data
        })
      },
      fail:fail=>{
        console.log(fail);
      }
    })
  }
})