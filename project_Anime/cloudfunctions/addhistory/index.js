// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'hyx07180913-9kgac'
})
const db = cloud.database();
const _ = db.command;
const historyCollcetion = db.collection('Anime_history')
// 云函数入口函数
exports.main = async (event, context) => {
  let {
    id,
    history_image,
    title,
    navigateto_url,
    history_name,
    time
  } = event;
  let res;
  let data = [];
  data = await historyCollcetion.where({
    id:id
  }).get();
  if(data.data.length !== 0){
    return 
  }
  res = await historyCollcetion.add({
    data: {
      id,
      history_image,
      title,
      navigateto_url,
      history_name,
      time
    }
  })
  return {
    res
  }
}