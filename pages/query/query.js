let timer;
Page({
  data: {
    primarySize: 'default',
    plain:false,
    loading:false,
    buttonType: 'default',
    buttonStatus: true
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value.studentID)
    wx.navigateTo({
      url: '../list/list',
    })
  },
  
  bindInput: function(e){
    var that = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      var phone = e.detail.value
      if (phone.length != 12 ) {
        wx.showToast({
          title: '错误',
          icon: 'error',
          duration: 1000
        })
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
    }, 800);
   
  },
})
