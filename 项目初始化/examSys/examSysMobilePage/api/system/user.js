import upload from '@/utils/upload'
import request from '@/utils/request'

// 查询用户列表
export function listPublicUser(query) {
	return request({
		url: '/system/user/listPublicUser',
		method: 'get',
		params: query
	})
}

// 用户密码重置
export function resetPwdPublic(userId, password) {
	const data = {
		userId,
		password
	}
	return request({
		url: '/system/user/resetPwdPublic',
		method: 'put',
		data: data
	})
}


// 查询用户列表
export function listUser(query) {
	return request({
		url: '/system/user/list',
		method: 'get',
		params: query
	})
}
// 用户密码重置
export function resetUserPwd(userId, password) {
	const data = {
		userId,
		password
	}
	return request({
		url: '/system/user/resetPwd',
		method: 'put',
		data: data
	})
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
	const data = {
		oldPassword,
		newPassword
	}
	return request({
		url: '/system/user/profile/updatePwd',
		method: 'put',
		params: data
	})
}

// 查询用户个人信息
export function getUserProfile() {
	return request({
		url: '/system/user/profile',
		method: 'get'
	})
}

// 修改用户个人信息
export function updateUserProfile(data) {
	return request({
		url: '/system/user/profile',
		method: 'put',
		data: data
	})
}

// 用户头像上传
export function uploadAvatar(data) {
	return upload({
		url: '/system/user/profile/avatar',
		name: data.name,
		filePath: data.filePath
	})
}