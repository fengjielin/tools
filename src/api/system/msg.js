import request from '@/utils/request';

// 查询通知消息列表
export function listMsg(query) {
  return request({
    url: '/system/msg/list',
    method: 'get',
    params: query,
  });
}

// 查询通知消息详细
export function getMsg(msgId) {
  return request({
    url: '/system/msg/' + msgId,
    method: 'get',
  });
}

// 新增通知消息
export function addMsg(data) {
  return request({
    url: '/system/msg',
    method: 'post',
    data: data,
  });
}

// 修改通知消息
export function updateMsg(data) {
  return request({
    url: '/system/msg',
    method: 'put',
    data: data,
  });
}

// 删除通知消息
export function delMsg(msgId) {
  return request({
    url: '/system/msg/' + msgId,
    method: 'delete',
  });
}
