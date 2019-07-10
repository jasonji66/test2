var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //页面初始化 options为页面跳转带来的参数

    this.setData({
      posts_key: postsData.postList
    });
  },

  onPostTap:function(event){
    var postId=event.currentTarget.dataset.postid;
    wx.navigateTo({
      url:"post-detail/post-detail?id="+postId
    })
  },
  //普通事件绑定方式
  // onSwiperItemTap:function(event){
  //   var postId = event.currentTarget.dataset.postid;
  //   wx.navigateTo({
  //     url: "post-detail/post-detail?id=" + postId
  //   })
  // }
  //利用事件冒泡机制
  onSwiperTap:function(event){
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }

})