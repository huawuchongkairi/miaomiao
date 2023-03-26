// pages/index/index.js
const db=wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data:{
    imgUrls:[
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.jyZ3D5eSjJIqnqMlZTLxqAHaEo?w=313&h=195&c=7&r=0&o=5&pid=1.7',
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.fw5ovj0OnVdjmJ5VXzZCkAHaEo?w=314&h=195&c=7&r=0&o=5&pid=1.7',
      'https://tse1-mm.cn.bing.net/th/id/OIP-C.YKoZzgmubNBxQ8j-mmoTKAHaEK?w=300&h=180&c=7&r=0&o=5&pid=1.7',
      // 'miniprogram\images\swipper\zgc.png'
    ],
    listData:[],
    current:'time'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getListData()
  },  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  handleLinks(ev){
    let id=ev.target.dataset.id;
    wx.cloud.callFunction({
      name:'update',
      data:{
        collection:'users',
        doc:id,
        data:"{links:_.inc(1)}"
      }
    }).then((res)=>{
      db.collection('users').get({
        success:res=>{
          // console.log(updatelistData)
          // console.log(res.data[0].links);
          let cloneListDate=res.data
          this.setData({
            listData:cloneListDate
          })
        }
      })
    })
  },
  handleCurrent(ev){
    let current=ev.target.dataset.current
    if(current==this.data.current){
      return false
    }
    this.setData({
      current
    },()=>{
      this.getListData()
    })
  },
  getListData(){
    db.collection('users')
    .field({
      userPhoto:true,
      nickName:true,
      links:true
    }).orderBy(this.data.current,'desc')
    .get().then((res)=>{
      this.setData({
         listData:res.data
      })
    })
  },
  handleDetail(ev){
    let id=ev.target.dataset.id
    wx.navigateTo({
      url:'/pages/detail/detail?userId='+id
    })
  }

  
})