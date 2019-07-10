var postsData=require('../../../data/posts-data.js')
var app=getApp();

Page({
    data:{
        isPlayingMusic:false,
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(option){
    var postId= option.id;
    //保存到data
    this.data.currenPostId=postId;
    var postData=postsData.postList[postId];
    this.setData({
      postData:postData
    });
    //var postsCollected={
    //1:"true",
    //2:"false",
    //3:"true"
    //.....
    //}
    //从缓存读取文章的收藏状态(读取的是所有文章缓存状态))
    var postsCollected=wx.getStorageSync('posts_collected')
    //判断是否为空
    if(postsCollected){
    //读取一个（要先判断文章缓存状态是不是为空）
      var postCollected=postsCollected[postId]
      if(postCollected){
        //数据更新
        this.setData({
          collected:postCollected
        })
      }   
    }
    else{
      var postsCollected={};
      //当前文章false
      postsCollected[postId]=false;
      //放置在缓存
      wx.setStorageSync('posts_collected',postsCollected);
    }
    //如果全局变量音乐播放状态存在 那么当前页面状态为true正在播放，并且判断对应文章内音乐
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusiPostId === postId){
      this.setData({
        isPlayingMusic:true
      })
    }
   //调用setMusicMonitor页面播放
    this.setMusicMonitor();
  },

  setMusicMonitor:function(){
    //监听页面播放
    var that = this;
    //监听音乐播放事件
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      //设置当前音乐播放是哪一篇文章
      app.globalData.g_currentMusiPostId = that.data.currenPostId;
    });
    //监听页面音乐暂停事件
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic=false;
      //把当前页面音乐播放清空
        app.globalData.g_currentMusiPostId=null;
    });
    //监听音乐停止事件。
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      //把当前页面音乐播放清空
      app.globalData.g_currentMusiPostId = null;
    });
  },

  onColletionTap:function(event){
    //获取缓存（所有）  通过缓存来确定它是否收藏了 
    var postsCollected=wx.getStorageSync('posts_collected');
    //获取当前文章状态
    var postCollected = postsCollected[this.data.currenPostId];
    //取反 （收藏的变成未收藏，未收藏变收藏）
    postCollected=!postCollected;
    //更新缓存
    postsCollected[this.data.currenPostId]= postCollected;
    this.showToast(postsCollected, postCollected);

  },
  showModal:function(postsCollected,postCollected){
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected? '是否收藏该文章?':'取消收藏该文章？',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function (res) {
        if(res.confirm){
          wx.setStorageSync('posts_collected', postsCollected);
          //更新数据绑定变量《从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  showToast: function (postsCollected, postCollected){
    //更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量《从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
        title: postCollected?"收藏成功":"取消成功",
        duration:1000,
        icon:"cuccess"
     })
  },


  onShareTap:function(event){
      var itemList=[
          "分享给微信朋友圈",
          "分享到朋友圈",
          "分享到QQ",
          "分享到微博"
      ];
      wx.showActionSheet({
        itemList:itemList,
        itemColor:"#405f80",
        success:function(res){
            //res.cancel用户是不是点击了取消按钮
            //res.tapIndex数组元素的序号,从0开始
            wx.showModal({
              title: '用户'+itemList[res.tapIndex],
              content: '用户是否取消'+res.cancel+"现在无法实现分享功能，什么时候能尺寸呢"
            })
          }
      })
  },

  onMusicTap:function(event){
    //获取当前文章数据列表
    var currentPostId = this.data.currenPostId;
    var postData = postsData.postList[currentPostId];
    //声明变量 保存播放器播放状态
    var isPlayingMusic=this.data.isPlayingMusic;
    //如果isplayingMusic是存在的那么暂停播放 否则启动播放
    if(isPlayingMusic){
      wx.pauseBackgroundAudio();
      //更新isplayyingMusic为false
      this.setData({
        isPlayingMusic:false
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
      })
      //更新isplayyingMusic为true
      this.setData({
        isPlayingMusic:true
      })
    }

  }

})