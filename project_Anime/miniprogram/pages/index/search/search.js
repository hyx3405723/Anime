const DB = wx.cloud.database();
let TimeId = -1
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
    // 搜素到数据
    goods: [],
    // 取消 按钮 是否显示
    isFocus: false,
    // 删除按钮是否显示
    isFocusText: false,
    // 输入框的值
    inpValue: "",
    // 搜素图片
    ischangicon: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 输入框的值改变 就会触发的事件
    handleInput(e) {
      // 1 获取输入框的值
      const {
        value
      } = e.detail;
      // 2 检测合法性
      if (!value.trim()) {
        this.setData({
          goods: [],
          isFocus: false,
          isFocusText: false
        })
        // 值不合法
        return;
      }
      // 3 准备发送请求获取数据
      this.setData({
        isFocus: true,
        isFocusText: true
      })
      clearTimeout(this.TimeId);
      this.TimeId = setTimeout(() => {
        this.qsearch(value);
      }, 300);
    },
    // 发送请求获取搜索建议 数据
    qsearch(query) {
      DB.collection('Anime_Search').where({
        goods_name: DB.RegExp({
          regexp: query,
          //从搜索栏中获取的value作为规则进行匹配。
          options: 'i',
          //大小写不区分
        })
      }).get({
        success: (res) => {
          this.setData({
            goods: res.data
          })
        }
      })
    },
    // 获取焦点事件
    focus() {
      this.setData({
        ischangicon: true,
        isFocus: true
      })
      console.log('ff');
    },
    // 点击删除按钮
    handleCancelText() {
      this.setData({
        inpValue: '',
        isFocusText: false,
        ischangicon: true
      })
    },
    // 点击 取消按钮
    handleCancel() {
      this.setData({
        inpValue: "",
        isFocus: false,
        isFocusText: false,
        ischangicon: false,
        goods: []
      })
    },
  }
})
