var util=require('../../utils/util.js')
var app=getApp();
Page({
  //RESTFul API JSON
  data:{
    inTheaters:{},
    comingSoon:{},
    top250:{},
    searchResult:{},
    //设置初始化显示
    containerShow:true,
    //设置初始化隐藏
    searchPanelShow:false,
  },

  onLoad:function(event){
    var inTheatersUrl = app.globalData.doubanBase+"/v2/movie/in_theaters"+"?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"+"?star=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250"+"?statr=0&count=3";

    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣TOp250");
  },
  //跳转更多电影页面
  onMoretap:function(event){
    //定义保存更多页面数据
    var category=event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category
    })
  },

  //跳转电影详情页面  
  onMovieTap:function(event){
    var movieId=event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId
    })
  },

  getMovieListData: function (url, settedKey, categoryTitle){
    var that=this;
    wx.request({
      url:url,
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  //x控制显隐
  onCancelImgTap:function(event){
    this.setData({
      containerShow:true,
      searchPanelShow:false,
      //数据置空
      searchResult:{}
    })
  },
  //获取焦点 显隐
  onBindFocus:function(event){
    this.setData({
      containerShow:false,
      searchPanelShow:true
    })
  },

  //触发搜索
  onBindfirm:function(event){
    //获取输入框输入的变量值
    var text=event.detail.value;
    //获取服务器API 搜索页面数据
    var searchUrl=app.globalData.doubanBase+"/v2/movie/search?q="+text;
    //向服务器发送请求
    this.getMovieListData(searchUrl,"searchResult","")
  },

  //提取所有数据封装函数
  processDoubanData:function(moviesDouban,settedkey,categoryTitle){
    //空的数组作为处理完的数据容器
    var movies=[];
    //遍历数组获取需要数据
    for(var idx in moviesDouban.subjects){
      var subject=moviesDouban.subjects[idx];
      var title=subject.title;
      if(title.length>=6){
        title=title.substring(0,6)+"...";
      }
      //定义temp用来保存所有元素装在temp里，最后push到movies数组里
      var temp={
        stars:util.convertToStarsArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        //这个movieId是用来方便跳转电影详情
        movieId:subject.id
      }
      //push(往数组末尾添加元素)到空数组movies里
      movies.push(temp)
    }
    //创建空对象
    var readyData={};
    //为对象添加新属性和值
    readyData[settedkey]={
      categoryTitle:categoryTitle,
      movies:movies
    }
    this.setData(readyData);
  }
})