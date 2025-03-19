import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '教师数据采集系统',
      requireAuth: false,
    },
    component: (resolve) => require(['@/views/login.vue'], resolve),
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '用户注册',
      requireAuth: false,
    },
    component: (resolve) => require(['@/views/register.vue'], resolve),
  },
	{
		path: '/homePage',
		name: 'homePage',
		meta: {
			title: '个人中心',
			requireAuth: true,
		},
		component: (resolve) => require(['@/views/homePage.vue'], resolve),
	},
  {
    path: '/',
    name: 'index',
    meta: {
      title: '',
      requireAuth: true,
    },
    component: (resolve) => require(['@/views/pc/index.vue'], resolve),
    children: [
      {
        path: '/myProfil/index',
        name: 'My_Profil',
        meta: {
          title: '我的档案',
          requireAuth: true,
          keepAlive: false,
        },
        components: {
          My_Profil: (resolve) => require(['@/views/pc/myProfil/index.vue'], resolve),
        },
      },
      {
        path: '/collectionFieldDefinition/index',
        name: 'Collection_Field_Definition',
        meta: {
          title: '采集字段定义',
          requireAuth: true,
          keepAlive: true,
        },
        components: {
          Collection_Field_Definition: (resolve) => require(['@/views/pc/collectionFieldDefinition/index.vue'], resolve),
        },
      },
			{
			  path: '/auditControllerTable/index',
			  name: 'Audit_Controller_Table',
			  meta: {
			    title: '档案填报控制',
			    requireAuth: true,
			    keepAlive: true,
			  },
			  components: {
			    Audit_Controller_Table: (resolve) => require(['@/views/pc/auditControllerTable/index.vue'], resolve),
			  },
			},
      {
        path: '/dataReview/index',
        name: 'Data_Review',
        meta: {
          title: '数据审核',
          requireAuth: true,
          keepAlive: false,
        },
        components: {
          Data_Review: (resolve) => require(['@/views/pc/dataReview/index.vue'], resolve),
        },
      },
      {
        path: '/dataQuery/index',
        name: 'Data_Query',
        meta: {
          title: '数据查询',
          requireAuth: true,
          keepAlive: false,
        },
        components: {
          Data_Query: (resolve) => require(['@/views/pc/dataQuery/index.vue'], resolve),
        },
      },
			{
				path: '/dict/index',
				name: 'Data_Dict',
				meta: {
					title: '数据字典',
					requireAuth: true,
					keepAlive: false,
				},
				components: {
					Data_Dict: (resolve) => require(['@/views/pc/dict/index.vue'], resolve),
				},
			},
			{
				path: '/dict/data',
				name: 'Data_Dict_Detail',
				meta: {
					title: '数据字典详情',
					requireAuth: true,
					keepAlive: false,
				},
				components: {
					Data_Dict: (resolve) => require(['@/views/pc/dict/data.vue'], resolve),
				},
			},
    ],
  },
];

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  mode: 'hash', // history
  routes,
});

export default router;

export function initDynamicRoutes() {}
