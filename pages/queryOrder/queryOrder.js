let timer;
Page({
  data: {
    primarySize: 'default',
    plain: false,
    loading: false,
    buttonType: 'default',
    buttonStatus: true
  },
  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', input_studentID)
    //本地存储已经验证的学号
    var studentID = "" 
    //用户输入的学号
    var input_studentID = e.detail.value.studentID

    //获取本地存储的学号
    wx.getStorage({
      key: 'studentID',
      success: function(res) {
        if(res.data !== "" && res.data === input_studentID){
          studentID = res.data
        }
      },
      fail: function(res) {
        console.log("本地存储失败")
      },
    })
    //将用户输入的学号进去查询，判断是否预约
    wx.request({
      url: 'http://jygl.uoh.edu.cn/TmAPI/GetOrderInfo',
      data: {
        "xh": input_studentID
      },
      header: {"content-type": 'application/json'},
      method: 'POST',
      success: function(res) {
        //用户输入的学号已经预约，跳转到带领
        if (res.data.Success) {
          wx.navigateTo({
            url: `../help/help?xh=${input_studentID}`,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        } else {
          /*用户输入的学号没有预约时段
           *1.先判断当前输入的学号是不是已经绑定的学号
           *    是：跳转到预约页面
           *    否：跳转到用户绑定页面
           */
          if(input_studentID === studentID){   //用户查询的学号就是当前绑定的学号
            wx.navigateTo({
              url: `../book/book?xh=${input_studentID}`,
              success: function(res) {
              },
            })
          }else{ // 用户输入的学号未绑定
           wx.showModal({
             title: '该学号未认证',
             content: '您的学号没有预约时段，请先登陆认证后再预约',
             showCancel: true,
             confirmText: '认证',
             confirmColor: '#09bb07',
             success(res) {
               if (res.confirm) {
                 wx.switchTab({
                   url: '../bind/bind',
                   success: function (res) {
                     console.log(res)
                   },
                 })
               } else if (res.cancel) {
                 wx.showModal({
                   content: '您没有登陆认证，不能预约领教材',
                   showCancel: false,
                   confirmText: '确定',
                   confirmColor: '#09bb07',
                 })
               }
             }
           })
          }
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
 
  bindInput: function(e){
    var that = this;
    // clearTimeout(timer);
    // timer = setTimeout(() => {
      //表单长度验证
      var StudentID = e.detail.value
      if (StudentID.length !== 12 ) {
        that.setData({
          buttonType: "default",
          buttonStatus: true
        })
      } else {
        that.setData({
          buttonType: "primary",
          buttonStatus: false
        })
      }
  },
})
