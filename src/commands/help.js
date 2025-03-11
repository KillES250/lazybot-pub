import { genAllHelpMessage, genOneHelpMessage } from '../utils/genHelpMessage.js';
import { checkPerm, getUserPerm } from '../utils/permission.js';

const helpInfo = [
  {
    cmd: 'user',
    perm: 'user',
    help: '查询用户信息',
    usage: '/user <id>',
    args: [
      {
        arg: 'id',
        help: '要查询的用户名或用户id',
      },
    ],
  },
  {
    cmd: 'msg',
    perm: 'user',
    help: '查询用户发言记录',
    usage: '/msg <id> [num]',
    args: [
      {
        arg: 'id',
        help: '要查询的用户名或用户id',
      },
      {
        arg: 'num',
        help: '要查询的聊天记录条数，默认为10条',
      },
    ],
  },
  {
    cmd: 'top',
    perm: 'user',
    help: '查询排行榜信息',
    usage: '/top <server>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5',
      },
    ],
  },
  {
    cmd: 'mpz',
    perm: 'user',
    help: '查询门派战信息',
    usage: '/mpz <server>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5',
      },
    ],
  },

  {
    cmd: 'xy',
    perm: 'user',
    help: '查询襄阳信息',
    usage: '/xy <server>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5',
      },
    ],
  },
  {
    cmd: 'boss',
    perm: 'user',
    help: '查询Boss信息',
    usage: '/boss <server>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5',
      },
    ],
  },
  {
    cmd: 'look',
    perm: 'user',
    help: '查询用户状态',
    usage: '/look <id>',
    args: [
      {
        arg: 'id',
        help: '要查询的用户名或用户id',
      },
    ],
  },
  {
    cmd: 'skill',
    perm: 'user',
    help: '查询技能信息',
    usage: '/skill <id>',
    args: [
      {
        arg: 'id',
        help: '要查询的技能，可以是用户名、用户id或技能id',
      },
    ],
  },
  {
    cmd: 'equip',
    perm: 'user',
    help: '查询装备获取信息',
    usage: '/equip <server> <level>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5',
      },
      {
        arg: 'level',
        help: '要查询的装备等级',
      },
    ],
  },
  {
    cmd: 'auction',
    perm: 'user',
    help: '查询拍卖信息',
    usage: '/action <server>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5',
      },
    ],
  },
  {
    cmd: 'perm',
    perm: 'admin',
    help: '设置权限',
    usage: '/perm <qq> <perm>',
    args: [
      {
        arg: 'qq',
        help: '要设置权限的用户qq',
      },
      {
        arg: 'perm',
        help: '要设置的权限，可选项：admin user none，为none时将拒绝该用户使用bot命令',
      },
    ],
  },
  {
    cmd: 'exp',
    perm: 'user',
    help: '查看各区经验排行',
    usage: '/exp <server>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5'',
      }
    ],
  },
    {
    cmd: 'mp',
    perm: 'user',
    help: '查看各区内力排行',
    usage: '/mp <server>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5'',
      }
    ],
  },
    {
    cmd: 'money',
    perm: 'user',
    help: '查看各区黄金排行',
    usage: '/money <server>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5'',
      }
    ],
  },
    {
    cmd: 'party',
    perm: 'user',
    help: '查看各区帮派积分排行',
    usage: '/party <server>',
    args: [
      {
        arg: 'server',
        help: '要查询的服务器，可选项：1 2 3 4 5'',
      }
    ],
  },
];

export const name = 'help';
export const perm = 'user';
export const fuc = function (msg, type = 'all') {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun) return;
  let message = ``;
  if (type === 'all') {
    const userPerm = getUserPerm(msg.user_id);
    const helpList = helpInfo.filter(({ perm }) => checkPerm(msg.user_id, perm));
    message += genAllHelpMessage(
      '用户命令：',
      helpList.filter(({ perm }) => perm === 'user'),
      true
    );
    if (checkPerm(msg.user_id, 'admin')) {
      message += genAllHelpMessage(
        '管理员命令：',
        helpList.filter(({ perm }) => perm === 'admin')
      );
    }
    if (checkPerm(msg.user_id, 'root')) {
      message += genAllHelpMessage(
        '系统权限命令：',
        helpList.filter(({ perm }) => perm === 'root')
      );
    }
  } else {
    const cmdHelpInfo = helpInfo.find((item) => item.cmd === type);
    if (cmdHelpInfo && checkPerm(msg.user_id, cmdHelpInfo.perm)) {
      message += genOneHelpMessage(cmdHelpInfo.help, cmdHelpInfo.usage, cmdHelpInfo.args);
    } else {
      message += `无此命令帮助信息`;
    }
  }
  msg.quick_action(message);
};
