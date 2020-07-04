// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async(event, context) => {
  const {
    id
  } = event;
  const {
    index
  } = event;
  const db = cloud.database()
  const _ = db.command
  const cnadidate = db.collection('Anime_audio_info')
  let res = await cnadidate.where({
    _id: id,
    'audio_comment.comment_id': index
  }).update({
    data: {
      'audio_comment.$.comment_mount': _.inc(1),
      'audio_comment.$.iszhang':true
    }
  })
  return {
    res
  }
}