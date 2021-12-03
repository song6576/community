const menuList = [
  {
    title: '首页',
    key: '/home',
    icon: '<RocketOutlined />'
  },
  {
    title: '管理员',
    key: '/user',
    icon: '<TeamOutlined />',
    children: [
      {
        title: '管理员',
        key: '/user',
      }
    ]
  },
  {
    title: '居民管理',
    key: '/residents',
    icon: 'TeamOutlined',
    children: [
      {
        title: '居民信息',
        key: '/residents',
      }
    ]
  },
  {
    title: '物资管理',
    key: '/supplise',
    icon: 'TeamOutlined',
    children: [
      {
        title: '物资信息',
        key: '/materialInformation',
      },
       {
        title: '申请审批',
        key: '/suppliesAdmin',
      }
    ]
  },
  {
    title: '诊断管理',
    key: '/diagnosis',
    icon: 'TeamOutlined',
    children: [
      {
        title: '诊断记录',
        key: '/diagnosis',
      }
    ]
  },
  {
    title: '疫苗接种',
    key: '/vaccine',
    icon: 'TeamOutlined',
    children: [
      {
        title: '接种管理',
        key: '/vaccine',
      }
    ]
  },
  {
    title: '访客管理',
    key: '/visitors',
    icon: 'TeamOutlined',
    children: [
      {
        title: '访客记录',
        key: '/visitors5',
      }
    ]
  },
  {
    title: '健康管理',
    key: '/health',
    icon: 'TeamOutlined',
    children: [
      {
        title: '健康上报',
        key: '/vaccine',
      }
    ]
  },
  {
    title: '疫情通告',
    key: '/outbreakNotice',
    icon: 'TeamOutlined',
    children: [
      {
        title: '疫情通告',
        key: '/outbreakNotice',
      }
    ]
  },
  {
    title: '病例统计',
    key: '/cases',
    icon: 'TeamOutlined',
    children: [
      {
        title: '病例记录',
        key: '/cases',
      }
    ]
  },
]

export default menuList