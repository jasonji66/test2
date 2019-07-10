// pages/movies/more-movie/more-movie.js
var app=getApp()
var util=require('../../../utils/util.js')

Page({
  data: {
    movies:{},
    navigateTitle:"",
    requireUrl:"",
    totalCount:0,
    isEmpty:true,
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle=category;
    var dataUrl="";
    switch(category){
      case"正在热映":
        dataUrl=app.globalData.doubanBase+"/v2/movie/in_theaters";
        break;
      case"即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case"豆瓣TOp250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requireUrl=dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },

  onScrollLower:function(event){
    var nextUrl=this.data.requireUrl+"?start="+this.data.totalCount+"&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  processDoubanData:function(moviesDouban){
    //空的数组作为处理完的数据容器
    var movies = [];
    //遍历数组获取需要数据
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      //定义temp用来保存所有元素装在temp里，最后push到movies数组里
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        //这个movieId是用来方便跳转电影详情
        movieId: subject.id
      }
      //push(往数组末尾添加元素)到空数组movies里
      movies.push(temp)
    }
    var totalMovies={}
    if(!this.data.isEmpty){
      totalMovies=this.data.movies.concat(movies);
    }else{
      totalMovies=movies;
      this.data.isEmpty=false;
    }
    this.setData({
      movies:totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title:this.data.navigateTitle,
    })
  },

  //跳转电影详情页面  
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
})