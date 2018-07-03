const { Result } = require('ya-mock-server');

const fullData = {
  app: {
    name: 'BFend后台管理系统',
    title: 'BFend管理系统',
    description: '',
  },
  user: {
    name: 'Admin',
    avatar: './assets/img/avatar.svg',
    email: 'hypomail@gmail.com',
    acl: {
      roles: ['admin'],
      abilities: ['dashboard.index', 'manager.index', 'table.basic.index', 'table.basic.show'],
      super: false
    },
    token: {
      access_token: 'fake-token'
    }
  },
  menus: [
    {
      text: '主导航',
      translate: 'main_navigation',
      group: true,
      children: [
        {
          text: '仪表盘',
          icon: 'icon-speedometer',
          link: '/dashboard',
          translate: 'dashboard_v1'
        },
        {
          text: '列表页',
          icon: 'icon-grid',
          link: '/table/basic/index',
          acl: 'table.basic.index',
        },
        {
          text: '小部件',
          translate: 'widgets',
          link: '/widgets',
          icon: 'icon-present',
          badge: 2
        }
      ]
    },
    {
      text: '组件',
      translate: 'component',
      group: true,
      children: [
        {
          text: '基础元素',
          translate: 'elements',
          link: '/elements',
          icon: 'icon-chemistry',
          acl: 'role-a',
          children: [
            {
              text: '按钮',
              link: '/elements/buttons',
              translate: 'buttons',
              shortcut: true
            },
            {
              text: 'Notification',
              link: '/elements/notification',
              translate: 'notification',
              shortcut: true
            },
            {
              text: 'Modal',
              link: '/elements/modal',
              translate: 'modal'
            },
            {
              text: 'SweetAlert',
              link: '/elements/sweetalert',
              translate: 'sweetalert'
            },
            {
              text: 'Tree Antd',
              link: '/elements/tree-antd',
              translate: 'tree-antd'
            },
            {
              text: 'Sortable',
              link: '/elements/sortable',
              translate: 'sortable'
            },
            {
              text: 'Spin',
              link: '/elements/spin',
              translate: 'spin'
            },
            {
              text: 'Dropdown',
              link: '/elements/dropdown',
              translate: 'dropdown'
            },
            {
              text: 'Grid',
              link: '/elements/grid',
              translate: 'grid'
            },
            {
              text: 'Grid Masonry',
              link: '/elements/gridmasonry',
              translate: 'gridmasonry'
            },
            {
              text: 'Typography',
              link: '/elements/typography',
              translate: 'typography'
            },
            {
              text: 'Font Icons',
              link: '/elements/iconsfont',
              translate: 'iconsfont'
            },
            {
              text: 'Colors',
              link: '/elements/colors',
              translate: 'colors'
            }
          ]
        },
        {
          text: '表单',
          translate: 'forms',
          link: '/forms',
          icon: 'icon-note',
          acl: 'role-a',
          children: [
            {
              text: '标准',
              link: '/forms/standard',
              translate: 'standard'
            },
            {
              text: '扩展',
              link: '/forms/extended',
              translate: 'extended'
            },
            {
              text: '校验',
              link: '/forms/validation',
              translate: 'validation'
            },
            {
              text: '上传',
              link: '/forms/upload',
              translate: 'upload',
              shortcut: true
            },
            {
              text: '图片裁剪',
              link: '/forms/cropper',
              translate: 'cropper'
            }
          ]
        },
        {
          text: 'Charts',
          translate: 'charts',
          link: '/charts',
          icon: 'icon-graph',
          acl: 'role-a',
          children: [
            {
              text: 'G2',
              link: '/charts/g2'
            }
          ]
        },
        {
          text: '表格',
          translate: 'tables',
          link: '/tables',
          icon: 'icon-grid',
          acl: 'role-b',
          children: [
            {
              text: '标准',
              link: '/tables/standard',
              translate: 'standard'
            },
            {
              text: 'Full',
              link: '/tables/full',
              translate: 'full'
            }
          ]
        },
        {
          text: '地图',
          translate: 'maps',
          link: '/maps',
          icon: 'icon-map',
          acl: 'role-b',
          children: [
            {
              text: 'QQ',
              link: '/maps/qq',
              translate: 'qq'
            },
            {
              text: 'Baidu',
              link: '/maps/baidu',
              translate: 'baidu'
            }
          ]
        }
      ]
    },
    {
      text: 'Pro',
      translate: 'pro',
      group: true,
      children: [
        {
          text: 'Form Page',
          translate: 'form',
          link: '/pro/form',
          icon: 'icon-note',
          children: [
            {
              text: 'Step Form',
              link: '/pro/form/step-form',
              translate: 'step-form'
            },
            {
              text: 'Advanced Form',
              link: '/pro/form/advanced-form',
              translate: 'advanced-form'
            }
          ]
        },
        {
          text: 'List',
          translate: 'pro-list',
          link: '/pro/list',
          icon: 'icon-grid',
          children: [
            {
              text: 'Table List',
              link: '/pro/list/table-list',
              translate: 'pro-table-list'
            },
            {
              text: 'Basic List',
              link: '/pro/list/basic-list',
              translate: 'pro-basic-list'
            },
            {
              text: 'Card List',
              link: '/pro/list/card-list',
              translate: 'pro-card-list'
            },
            {
              text: 'Cover Card List',
              link: '/pro/list/cover-card-list',
              translate: 'pro-cover-card-list'
            },
            {
              text: 'Filter Card List',
              link: '/pro/list/filter-card-list',
              translate: 'pro-filter-card-list'
            },
            {
              text: 'Search',
              link: '/pro/list/search',
              translate: 'pro-search'
            }
          ]
        },
        {
          text: 'Profile',
          translate: 'pro-profile',
          link: '/pro/profile',
          icon: 'icon-book-open',
          children: [
            {
              text: 'Basic',
              link: '/pro/profile/basic',
              translate: 'pro-profile-basic'
            },
            {
              text: 'Advanced',
              link: '/pro/profile/advanced',
              translate: 'pro-profile-advanced'
            }
          ]
        },
        {
          text: 'Result',
          translate: 'pro-result',
          link: '/pro/result',
          icon: 'icon-check',
          children: [
            {
              text: 'Success',
              link: '/pro/result/success',
              translate: 'pro-result-success'
            },
            {
              text: 'Fail',
              link: '/pro/result/fail',
              translate: 'pro-result-fail'
            }
          ]
        },
        {
          text: 'Exception',
          translate: 'pro-exception',
          link: '/pro/exception',
          icon: 'icon-fire',
          children: [
            {
              text: '403',
              link: '/pro/exception/403'
            },
            {
              text: '404',
              link: '/pro/exception/404'
            },
            {
              text: '500',
              link: '/pro/exception/500'
            }
          ]
        },
        {
          text: 'User',
          translate: 'pro-user',
          link: '/pro/user',
          icon: 'icon-user',
          children: [
            {
              text: 'login',
              link: '/pro/user/login',
              translate: 'pro-login'
            },
            {
              text: 'register',
              link: '/pro/user/register',
              translate: 'pro-register'
            },
            {
              text: 'register result',
              link: '/pro/user/register-result',
              translate: 'pro-register-result'
            }
          ]
        }
      ]
    },
    {
      text: 'More',
      translate: 'more',
      group: true,
      children: [
        {
          text: 'Common Logics',
          translate: 'logics',
          link: '/logics',
          icon: 'icon-compass',
          children: [
            {
              text: 'ACL',
              link: '/logics/acl',
              translate: 'acl'
            },
            {
              text: 'Route Guard',
              link: '/logics/guard',
              translate: 'guard',
              acl: 'admin'
            },
            {
              text: 'Down File',
              link: '/logics/downfile',
              translate: 'downfile',
              shortcut: true
            }
          ]
        },
        {
          text: 'Report',
          translate: 'report',
          icon: 'anticon anticon-cloud-o',
          children: [
            {
              text: 'Relation',
              link: '/data-v/relation',
              translate: 'relation',
              target: '_blank',
              shortcut: true
            }
          ]
        },
        {
          text: 'Pages',
          translate: 'pages',
          link: '/pages',
          icon: 'icon-doc',
          acl: 'admin',
          children: [
            {
              text: 'Login',
              link: '/login',
              translate: 'm-login'
            },
            {
              text: 'Register',
              link: '/register',
              translate: 'm-register'
            },
            {
              text: 'Forget',
              link: '/forget',
              translate: 'm-forget'
            },
            {
              text: 'Lock',
              link: '/lock',
              translate: 'm-lock'
            },
            {
              text: '404',
              link: '/404'
            },
            {
              text: '500',
              link: '/500'
            },
            {
              text: 'Maintenance',
              link: '/maintenance',
              translate: 'maintenance'
            }
          ]
        },
        {
          text: 'Extras',
          translate: 'extras',
          link: '/extras',
          icon: 'icon-cup',
          children: [
            {
              text: 'Blog',
              link: '/extras/blog',
              translate: 'blog',
              children: [
                {
                  text: 'List',
                  link: '/extras/blog/list',
                  translate: 'list',
                  badge: 1,
                  badge_dot: true
                },
                {
                  text: 'Comment',
                  link: '/extras/blog/comment',
                  translate: 'comment'
                },
                {
                  text: 'Post',
                  link: '/extras/blog/post',
                  translate: 'post'
                },
                {
                  text: 'WebSite',
                  externalLink: '//github.com/cipchk/ng-alain',
                  target: '_blank',
                  translate: 'website'
                }
              ]
            },
            {
              text: 'Help Center',
              link: '/extras/helpcenter',
              translate: 'helpcenter'
            },
            {
              text: 'Settings',
              link: '/extras/settings',
              translate: 'settings'
            },
            {
              text: 'Poi',
              link: '/extras/poi',
              translate: 'poi'
            }
          ]
        }
      ]
    }
  ]
};

module.exports = {
  'GET /api/app': (ctx) => {
    if (ctx.header.authorization) {
      return fullData;
    } else {
      return {
        app: fullData.app
      }
    }
  }
};
