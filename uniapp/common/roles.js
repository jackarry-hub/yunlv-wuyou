export const roleDefinitions = [
  {
    key: "elder",
    messageRole: "user",
    label: "用户端",
    title: "用户/老人",
    home: "/pages/user/home",
    description: "查看首页、活动、求助、下单、消息和个人资料",
  },
  {
    key: "guide",
    messageRole: "guide",
    label: "人工向导端",
    title: "人工向导",
    home: "/pages/guide/hall",
    description: "小程序/App 内人工向导角色端：上线接单、查看任务、开始服务、异常上报和收入统计",
  },
  {
    key: "merchant",
    messageRole: "merchant",
    label: "商户端",
    title: "商户",
    home: "/pages/merchant/workbench",
    description: "小程序/App 内商户角色端：发布服务、接收预约、报价确认、开始服务、完成上报和查看评价",
  },
];

export const roleMap = roleDefinitions.reduce((result, item) => {
  result[item.key] = item;
  return result;
}, {});

export function normalizeRole(role) {
  return roleMap[role] ? role : "elder";
}

export function messageRoleOf(role) {
  return roleMap[normalizeRole(role)].messageRole;
}

export function homeOfRole(role) {
  return roleMap[normalizeRole(role)].home;
}
