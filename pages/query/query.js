Page({
  data: {
    primarySize: 'mini',
    plain:false,
    loading:false
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.navigateTo({
      url: '../list/list',
    })
  },
})
