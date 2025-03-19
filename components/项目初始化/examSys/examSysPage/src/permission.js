import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from '@/utils/auth';
import { isRelogin } from '@/utils/request';
import { getFirstPath, traverseTree } from '@/utils/index';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/register', '/expertApply', '/expertApplySearch'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title);
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (store.getters.roles.length === 0) {
        isRelogin.show = true;
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetInfo')
          .then(() => {
            isRelogin.show = false;
            store.dispatch('GenerateRoutes').then((accessRoutes) => {
              // 根据roles权限生成可访问的路由表
              router.addRoutes(accessRoutes); // 动态添加可访问路由表

              // 由于首页放在菜单管理里面，所以一个角色是可能会存在没有菜单的情况的，需要判断当前用户是否拥有一个有效的菜单
              let firstMenuPath = store.state.permission.topbarRouters.find((item) => !item.hidden);
              if (firstMenuPath) {
                if (from.path == '/login') {
                  // 需要判断当前用户的第一个菜单是什么
                  let path = getFirstPath(firstMenuPath);
                  next({ path: path, replace: true }); // hack方法 确保addRoutes已完成
                } else {
                  // 获取 所有 路由的 路径
                  let pathList = [];
                  for (let i = 0; i < store.state.permission.sidebarRouters.length; i++) {
                    let nodePathList = [];
                    const item = store.state.permission.sidebarRouters[i];
                    traverseTree(item, [], (nodePath) => {
                      nodePathList.push(nodePath.join('/'));
                    });
                    pathList.push(...nodePathList);
                  }

                  // 处理 path为 '/expert/applicationDetailVerify/index/4'情况的匹配，'/expert/applicationDetail/index/:edApplicationUseId(\\d+)'
                  let toPath = to.path;
                  if (to.matched.length > 0) {
                    toPath = to.matched[1].path;
                  }

                  // 判断是否拥有to.path的路径
                  let flag = false;
                  pathList.forEach((path) => {
                    if (path == toPath) {
                      flag = true;
                    }
                  });
                  console.log(pathList);
                  console.log(flag, toPath, to);
                  if (flag) {
                    next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
                  } else {
                    let path = getFirstPath(firstMenuPath);
                    console.log(path);
                    next({ path: path, replace: true }); // hack方法 确保addRoutes已完成
                  }
                }
              } else {
                store.dispatch('LogOut').then(() => {
                  Message.error('您未被分配菜单，请联系系统管理员');
                  next(`/login`); // 否则全部重定向到登录页
                });
              }
            });
          })
          .catch((err) => {
            store.dispatch('LogOut').then(() => {
              Message.error(err);
              next({ path: '/' });
            });
          });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
