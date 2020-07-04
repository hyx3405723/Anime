const DB = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户名字
    userdigloname: '登录',
    // 用户头像
    userimage: 'cloud://hyx07180913-9kgac.6879-hyx07180913-9kgac-1301547416/Anime_photo/u=1736163552,1696885273&fm=26&gp=0.jpg',
    // 用户名字的颜色
    isusername: false,
    // 历史记录数据
    historyList: []

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取历史数据
    this.getHostoryList();
  },
  // 获取历史数据
  getHostoryList() {
    DB.collection('Anime_history').limit(3).get({
      success: (res) => {
        this.setData({
          historyList: res.data
        })
      }
    })
  },
  // 点击查看更多事件
  navagateUrl() {
    wx.navigateTo({
      url: '/pages/user/history/history'
    })
  },
  // 登录事件
  getbindgetuserinfo(e) {
    if (!e.detail.userInfo) {
      return
    }
    // 存储用户信息
    wx.setStorage({
      key: "users",
      data: {
        username: e.detail.userInfo.nickName,
        userimg: e.detail.userInfo.avatarUrl,
        islogin: true
      },
      success: (res) => {
        wx.showToast({
          title: '登录成功',
        })
      }
    })
    // 获取用户信息
    wx.getStorage({
      key: 'users',
      success: (res) => {
        this.setData({
          userimage: res.data.userimg,
          userdigloname: res.data.username,
          isusername: true
        })
      },
      fail: fail => {
        console.log(fail)
      }
    })
  }
})