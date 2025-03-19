import request from '@/utils/request'

// 查询消息通知信息列表
export function listInfo(query) {
  return request({
    url: '/common/msg/list',
    method: 'get',
    params: query
  })
}

// 分页查询消息通知信息列表
export function listAllInfo(query) {
  return request({
    url: '/common/msg/listAll',
    method: 'get',
    params: query
  })
}

// 查询消息通知信息详细
export function getInfo(trainingMsgId) {
  return request({
    url: '/common/msg/' + trainingMsgId,
    method: 'get'
  })
}

// 新增消息通知信息
export function addInfo(data) {
  return request({
    url: '/common/msg',
    method: 'post',
    data: data
  })
}

// 修改消息通知信息
export function updateInfo(data) {
  return request({
    url: '/common/msg',
    method: 'put',
    data: data
  })
}

// 删除消息通知信息
export function delInfo(trainingMsgId) {
  return request({
    url: '/common/msg' + trainingMsgId,
    method: 'delete'
  })
}

// 查询个人消息通知信息数量
export function getNotReadCount(userId) {
  return request({
    url: '/common/msg/getNotReadCount',
    method: 'get'
  })
}

// 发布培训通知
export function noticeTraining(data) {
  return request({
    url: '/common/msg/send',
    method: 'post',
    data: data
  })
}

//发布培训课程安排通知给专家
export function sendScheme(data) {
  return request({
    url: '/common/msg/sendScheme',
    method: 'post',
    data: data
  })
}


