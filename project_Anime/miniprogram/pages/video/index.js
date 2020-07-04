const DB = wx.cloud.database();
const _ = DB.command
let util = require('../../unit/unit.js')
Page({

      /**
       * 页面的初始数据
       */
      data: {
        // 视频中心数据
        audio_info: [],
        // 视频数据的_id
        id: '',
        // 视频数据的audio_id
        audio_id: 0,
        // 视频src属性
        audio_src: '',
        //  表示已经收藏，收藏图片为红色
        ischangeiconchange: false,
        // 判断用户是否登录,再是否评论
        islogin: false,
        // 评论内容被显示在视频上，出现的时间
        time: [],
        // 视频下载
        download: '',
        // 是否显示评论对话框
        isCommentary: true,
        // 用户姓名
        userdigloname: '',
        // 评论内容
        userdiglocontent: '',
        // 用户头像
        userimage: '',
        // 选集的数组数据
        anthology_list: [],
        // 选集的索引
        current: '0',
        // 查看更多的索引
        current_index: 0,
        // 显示或者隐藏选集弹出框
        visible2: false,
        // 弹簧内容的数组
        danmuList: [],
        // 判断是否已收藏
        iscomment: false
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
        this.setData({
          audio_id: parseInt(options.audio_id)
        })
        //获取视频的数据
        this.getAudioInfo();
      },
      // 获取视频的数据
      getAudioInfo() {
        DB.collection('Anime_audio_info').where({
          audio_id: this.data.audio_id
        }).get({
          success: (res) => {
            this.setData({
              audio_info: res.data[0],
              id: res.data[0]._id,
              anthology_list: res.data[0].video,
              audio_src: res.data[0].video[0].audio_src,
              download: res.data[0].video[0].audio_download,
              danmuList: res.data[0].audio_comment.map(item => {
                return {
                  text: item.comment_content,
                  color: item.color,
                  time: item.time + 2
                }
              })

            })
            // 获取历史数据记录
            wx.cloud.callFunction({
              name: 'addhistory',
              data: {
                id: res.data[0].audio_id,
                time: util.formatTime(new Date()),
                history_image: res.data[0].image_src,
                title: res.data[0].audio_title,
                history_name: res.data[0].audio_name,
                navigateto_url: '/pages/video/index?audio_id=' + res.data[0].audio_id
              },
              success: res => {
                console.log(res)
              },
              fail: fail => {
                console.log(fail)
              }
            })
            // 获取用户信息，判断是否已经登录
            wx.getStorage({
              key: 'users',
              success: (res) => {
                this.setData({
                  islogin: res.data.islogin
                })
              }
            })
          }
        })
      },
      // 点击收藏
      Collected() {
        wx.showModal({
          title: '提示',
          content: '是否收藏！',
          success: res => {
            if (res.confirm) {
              this.setData({
                ischangeiconchange: true
              })
              if (this.data.iscomment === true) {
                wx.showToast({
                  title: '已经收藏过了!',
                  icon: 'none'
                })
                return
              }
              wx.showToast({
                title: '收藏成功'
              })
              // 添加收藏数据记录
              let commet = true
              this.getCommet(commet)
            } else if (res.cancel) {
              this.setData({
                ischangeiconchange: false
              })
              if (this.data.iscomment === false) {
                wx.showToast({
                  title: '请先收藏',
                  icon: 'none'
                })
                return
              }
              wx.showToast({
                title: '取消收藏',
                icon: 'none'
              })
              let commet = false
              // 删除收藏数据记录
              this.getCommet(commet);
            }
          }
        })
      },
      // 获取收藏数据记录
      getCommet(commet) {
        if (commet === false) {
          wx.cloud.callFunction({
            name: 'addcommet',
            data: {
              id: this.data.audio_info.audio_id,
              commet: commet
            },
            success: res => {
              this.setData({
                iscomment: false
              })
            },
            fail: fail => {
            }
          })
          return
        }
        wx.cloud.callFunction({
          name: 'addcommet',
          data: {
            id: this.data.audio_info.audio_id,
            hot: this.data.audio_info.audio_icontext2,
            commet_image: this.data.audio_info.image_src,
            title: this.data.audio_info.audio_title,
            commet_name: this.data.audio_info.audio_name,
            commet: commet,
            navigateto_url: '/pages/video/index?audio_id=' + this.data.audio_info.audio_id
          },
          success: res => {
            this.setData({
              iscomment: true
            })
          },
          fail: fail => {
            console.log(fail)
          }
        })
      },
      // 选集事件
      onChange(e) {
        console.log(e)
        this.setData({
          current: e.detail.key,
          audio_src: this.data.anthology_list[parseInt(e.detail.key)].audio_src,
          download: this.data.anthology_list[parseInt(e.detail.key)].audio_download
        })
        console.log(this.data.current);
      },
      // 点击评论里的点赞按钮，改变点赞数量
      changecommentcount(count) {
        const {
          id
        } = count.currentTarget.dataset
        const {
          index
        } = count.currentTarget.dataset
        let iszhang = this.data.audio_info.audio_comment.some((item) => {
          if (item.comment_id === index) return item.iszhang
        })
        if (iszhang === true) {
          wx.showToast({
            title: '已经点赞过了!',
            icon: 'none'
          })
          return
        }
        wx.cloud.callFunction({
          name: 'changecount',
          data: {
            id: id,
            index: index,
          },
          success: res => {
            this.getAudioInfo();
          },
          fail: fail => {
            console.log(fail)
          }
        })
        wx.showToast({
          title: '点赞成功',
          icon: 'success'
        })
      },
      // 点击下载视频
      handleDownload() {
        wx.showLoading({
          title: '下载中',
        })
        wx.downloadFile({
          url: this.data.download,
          success: res => {
            let filePath = res.tempFilePath;
            wx.saveVideoToPhotosAlbum({
              filePath,
              success: file => {
                wx.hideLoading()
                wx.showToast({
                  title: '下载成功',
                  icon: 'none'
                })
              },
              fail: fail => {
                wx.hideLoading()
              }
            })
          }
        })
      },
      //滑动切换视频
      handleSwiperAction(e) {
        const videoList = getApp().globalData.videoList;
        if (e.detail.direction === 'left' && this.data.audio_id < videoList.length) {
          this.data.audio_id++;
          this.getAudioInfo()
        } else if (e.detail.direction === 'right' && this.data.audio_id > 0) {
          this.data.audio_id--;
          this.getAudioInfo()
        } else {
          wx.showToast({
            title: '没有数据了',
            icon: "none"
          })
        }
      },
      // 点击评论一下，弹出对话框
      getbindgetuserinfo() {
        if (!this.data.islogin) {
          wx.showToast({
            title: '请先授权登录',
            icon: 'none'
          })
        }
        wx.getStorage({
          key: 'users',
          success: (res) => {
            this.setData({
              userimage: res.data.userimg,
              userdigloname: res.data.username,
              isCommentary: false
            })
          }
        })
      },
      //弹出框确认操作
          modalConfirm: function () {
            if (this.data.userdiglocontent === '') {
              this.setData({
                isCommentary: false
              })
              wx.showToast({
                title: '请输入评论内容',
                icon: 'none'
              })
            } else {
              wx.cloud.callFunction({
                name: 'updateCommnet',
                data: {
                  id: this.data.audio_id,
                  comment_content: this.data.userdiglocontent,
                  comment_src: this.data.userimage,
                  comment_title: this.data.userdigloname,
                  time: this.data.audio_info.audio_comment[this.data.audio_info.audio_comment.length - 1].time,
                  comment_id: this.data.audio_info.audio_comment[this.data.audio_info.audio_comment.length - 1].comment_id
                },
                success: res => {
                  this.getAudioInfo()
                },
                fail: fail => {
                  console.log(fail);
                }
              })
              this.setData({
                isCommentary: true,
                userdiglocontent: ''
              })
              wx.showToast({
                title: '评论成功',
              })
            }
          },
          //弹出框取消操作
          modalCancel: function () {
            this.setData({
              isCommentary: true,
              userdiglocontent: ''
            })
          },
          // 显示弹出框
          openanthology() {
            this.setData({
              visible2: true,
            })
          },
          //隐藏弹出框
          close2() {
            this.setData({
              visible2: false,
            })
          },
          //隐藏弹出框
          onClose2() {
            this.setData({
              visible2: false
            })
          },
          // 查看更多选集事件
          anthologyselect(event) {
            console.log(event)
            const index = parseInt(event.currentTarget.id);
            let
              anthology_list = this.data.anthology_list;
            anthology_list.forEach((v, i) => i === index ? v.isactive = true : v.isactive = false);
            this.setData({
              anthology_list,
              current:event.currentTarget.id,
              audio_src: this.data.anthology_list[index].audio_src,
              download: this.data.anthology_list[index].audio_download,
              visible2: false
            })
          }
        })