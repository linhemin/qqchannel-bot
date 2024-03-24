import type { CustomTextKeys } from '../../../../interface/config'

export interface ICustomTextMetaItem {
  key: CustomTextKeys
  name: string
  description: string
  defaultTemplate: string
  args: {
    name: string
    scope?: 'coc' // 是否是 coc 特有
    section?: boolean // 是否是 section 变量
  }[]
}

export interface ICustomTextMetaGroup {
  name: string
  items: ICustomTextMetaItem[]
}

// common args
const _ = Object.freeze<Record<string, ICustomTextMetaItem['args'][number]>>({
  用户名: { name: '用户名' },
  人物卡名: { name: '人物卡名' }, // fallback 用户名
  at用户: { name: 'at用户' },
  原始指令: { name: '原始指令' },
  描述: { name: '描述' },
  掷骰结果: { name: '掷骰结果' },
  掷骰表达式: { name: '掷骰表达式' },
  掷骰输出: { name: '掷骰输出' },
  目标值: { name: '目标值' },
  ds: { name: 'ds', section: true },
  en: { name: 'en', section: true },
  ri: { name: 'ri', section: true },
  sc: { name: 'sc', section: true },
  st: { name: 'st', section: true },
  coc: { name: 'coc', section: true },
  dnd: { name: 'dnd', section: true },
  last: { name: 'last', section: true },
  困难前缀: { name: '困难前缀', section: true, scope: 'coc' },
  极难前缀: { name: '极难前缀', section: true, scope: 'coc' },
  无前缀: { name: '无前缀', section: true, scope: 'coc' },
})

const customTextMeta = Object.freeze<ICustomTextMetaGroup[]>([
  {
    name: '通用文案',
    items: [
      {
        key: 'roll.start',
        name: '掷骰-起始',
        description: '.侦查<br><u>Maca 🎲 侦察</u> d%: [84] = 84',
        defaultTemplate: '{{用户名}} 🎲 {{描述}}',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.ds, _.en, _.ri, _.sc, _.coc, _.dnd, { name: '普通检定', section: true }, { name: '普通掷骰', section: true }]
      },
      {
        key: 'roll.inline.first',
        name: '中间骰-起始步骤',
        description: '.d[[d[[d100]]]]<br>Maca 🎲<br><u>先是 🎲 </u>d100: [72] = 72<br>然后 🎲 d72: [27] = 27<br>最后 🎲 d27: [19] = 19',
        defaultTemplate: '先是 🎲 ',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'roll.inline.middle',
        name: '中间骰-中间步骤',
        description: '.d[[d[[d100]]]]<br>Maca 🎲<br>先是 🎲 d100: [72] = 72<br><u>然后 🎲 </u>d72: [27] = 27<br>最后 🎲 d27: [19] = 19',
        defaultTemplate: '然后 🎲 ',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'roll.inline.last',
        name: '中间骰-最终步骤',
        description: '.d[[d[[d100]]]]<br>Maca 🎲<br>先是 🎲 d100: [72] = 72<br>然后 🎲 d72: [27] = 27<br><u>最后 🎲 </u>d27: [19] = 19',
        defaultTemplate: '最后 🎲 ',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'roll.result',
        name: '掷骰输出（完整）',
        description: '.2d10+d6+1<br>Maca 🎲 <u>2d10+d6+1: [3, 8]+[5]+1 = 17</u>',
        defaultTemplate: '{{掷骰输出}}',
        args: [_.掷骰结果, _.掷骰表达式, _.掷骰输出, _.ds, _.ri, _.sc, _.st]
      },
      {
        key: 'roll.result.quiet',
        name: '掷骰输出（简略）',
        description: '.q 2d10+d6+1<br>Maca 🎲 <u>2d10+d6+1 = 17</u>',
        defaultTemplate: '{{掷骰表达式}} = {{掷骰结果}}',
        args: [_.掷骰结果, _.掷骰表达式, _.掷骰输出, _.en, _.sc]
      },
      {
        key: 'roll.hidden',
        name: '暗骰',
        description: '.h心理学<br><u>Maca 在帷幕后面偷偷地 🎲 心理学，猜猜结果是什么</u>',
        defaultTemplate: '{{用户名}} 在帷幕后面偷偷地 🎲 {{描述}}，猜猜结果是什么',
        args: [_.用户名, _.人物卡名, _.at用户, _.描述]
      },
      {
        key: 'test.worst',
        name: '检定-大失败',
        description: '.侦查<br>Maca 🎲 侦察 d%: [100] = 100<u> 大失败</u>',
        defaultTemplate: ' 大失败',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出, _.ds, _.sc, _.困难前缀, _.极难前缀, _.无前缀]
      },
      {
        key: 'test.best',
        name: '检定-大成功',
        description: '.侦查<br>Maca 🎲 侦察 d%: [1] = 1<u> 大成功</u>',
        defaultTemplate: ' 大成功',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出, _.ds, _.en, _.sc, _.困难前缀, _.极难前缀, _.无前缀]
      },
      {
        key: 'test.fail',
        name: '检定-失败',
        description: '.侦查<br>Maca 🎲 侦察 d%: [80] = 80<u> / 60 失败</u>',
        defaultTemplate: ' / {{目标值}} 失败',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出, _.ds, _.en, _.sc, _.困难前缀, _.极难前缀, _.无前缀]
      },
      {
        key: 'test.exsuccess',
        name: '检定-成功（极难）',
        description: '.侦查<br>Maca 🎲 侦察 d%: [10] = 10<u> / 60 成功</u>',
        defaultTemplate: ' / {{目标值}} 成功',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出, _.sc, _.困难前缀, _.极难前缀, _.无前缀]
      },
      {
        key: 'test.hardsuccess',
        name: '检定-成功（困难）',
        description: '.侦查<br>Maca 🎲 侦察 d%: [25] = 25<u> / 60 成功</u>',
        defaultTemplate: ' / {{目标值}} 成功',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出, _.sc, _.困难前缀, _.极难前缀, _.无前缀]
      },
      {
        key: 'test.success',
        name: '检定-成功',
        description: '.侦查<br>Maca 🎲 侦察 d%: [50] = 50<u> / 60 成功</u>',
        defaultTemplate: ' / {{目标值}} 成功',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出, _.ds, _.en, _.sc, _.困难前缀, _.极难前缀, _.无前缀]
      },
      {
        key: 'roll.vs.prompt',
        name: '对抗检定标记',
        description: '.v侦查<br>Maca 🎲 侦查 d%: [88] = 88 / 60 失败<br><u>> 回复本条消息以进行对抗</u>',
        defaultTemplate: '> 回复本条消息以进行对抗',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'roll.vs.result',
        name: '对抗检定',
        description: 'Maca 🎲 聆听 d%: [10] = 10 / 50 成功<br><u>🟩 Maca 聆听(50) 极难成功 ↔️ NPC 侦察(60) 失败 🟥</u>',
        defaultTemplate: '{{#胜}}🟩{{/胜}}{{#负}}🟥{{/负}}{{#平}}🟨{{/平}} {{用户名}} {{描述}}{{#coc}}({{技能值}}) {{成功等级}}{{/coc}}{{#dnd}} {{掷骰结果}}{{/dnd}} ↔️ {{对方用户名}} {{对方描述}}{{#coc}}({{对方技能值}}) {{对方成功等级}}{{/coc}}{{#dnd}} {{对方掷骰结果}}{{/dnd}} {{#对方胜}}🟩{{/对方胜}}{{#对方负}}🟥{{/对方负}}{{#对方平}}🟨{{/对方平}}',
        args: [
          { name: '胜', section: true }, { name: '负', section: true }, { name: '平', section: true },
          { name: '对方胜', section: true }, { name: '对方负', section: true }, { name: '对方平', section: true },
          _.用户名, _.人物卡名, _.at用户, _.描述, _.掷骰结果, _.掷骰表达式, _.掷骰输出,
          { name: '对方用户名' }, { name: '对方人物卡名' }, { name: '对方at用户' }, { name: '对方描述' }, { name: '对方掷骰结果' }, { name: '对方掷骰表达式' }, { name: '对方掷骰输出' },
          _.coc, _.dnd,
          { name: '技能值', scope: 'coc' }, { name: '目标值', scope: 'coc' }, { name: '成功等级', scope: 'coc' },
          { name: '成功', scope: 'coc', section: true }, { name: '大成功', scope: 'coc', section: true }, { name: '极难成功', scope: 'coc', section: true }, { name: '困难成功', scope: 'coc', section: true }, { name: '常规成功', scope: 'coc', section: true }, { name: '常规失败', scope: 'coc', section: true }, { name: '大失败', scope: 'coc', section: true },
          { name: '对方成功', scope: 'coc', section: true }, { name: '对方大成功', scope: 'coc', section: true }, { name: '对方极难成功', scope: 'coc', section: true }, { name: '对方困难成功', scope: 'coc', section: true }, { name: '对方常规成功', scope: 'coc', section: true }, { name: '对方常规失败', scope: 'coc', section: true }, { name: '对方大失败', scope: 'coc', section: true },
        ]
      },
      {
        key: 'card.empty',
        name: '人物卡-未关联',
        description: '.st<br><u>@Maca 没有关联人物卡</u>',
        defaultTemplate: '{{at用户}}没有关联人物卡',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'card.nopermission',
        name: '人物卡-无操作权限',
        description: '.st hp-1<br><u>Maca 没有操作人物卡的权限</u>',
        defaultTemplate: '{{用户名}} 没有操作人物卡的权限',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
    ]
  },
  {
    name: '人物卡操作',
    items: [
      {
        key: 'roll.st.prompt',
        name: '人物卡-设置提示',
        description: '.st<br><u>@Maca 请指定想要设置的属性名与属性值</u>',
        defaultTemplate: '{{at用户}}请指定想要设置的属性名与属性值',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'roll.st.show',
        name: '人物卡-展示条目列表',
        description: '.st show 侦查，图书馆<br><u>@Maca (铃木翼):<br>侦查:60 图书馆:50</u>',
        defaultTemplate: '{{at用户}}({{人物卡名}}):\n{{#条目列表}}{{条目}}{{^last}} {{/last}}{{/条目列表}}',
        args: [_.用户名, _.人物卡名, _.at用户, { name: '条目列表', section: true }, { name: '条目' }, { name: '条目唯一', section: true }, _.last, { name: '展示全部', section: true }]
      },
      {
        key: 'roll.st.set',
        name: '人物卡-设置条目列表',
        description: '.st hp-1<br><u>@Maca (铃木翼) 设置:<br>hp 11-1: 11-1 = 10</u>',
        defaultTemplate: '{{at用户}}({{人物卡名}}) 设置:\n{{#条目列表}}{{条目}}{{^last}}\n{{/last}}{{/条目列表}}',
        args: [_.用户名, _.人物卡名, _.at用户, { name: '条目列表', section: true }, { name: '条目' }, { name: '条目唯一', section: true }, _.last]
      },
      {
        key: 'nn.show',
        name: '人物卡关联-展示已关联人物卡',
        description: '.nn<br><u>@Maca 当前已关联人物卡：铃木翼</u>',
        defaultTemplate: '{{at用户}}当前{{#人物卡名}}已关联人物卡：{{人物卡名}}{{/人物卡名}}{{^人物卡名}}未关联人物卡{{/人物卡名}}',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'nn.link',
        name: '人物卡关联-关联成功',
        description: '.nn 铃木翼<br><u>@Maca 已关联人物卡：铃木翼</u>',
        defaultTemplate: '{{at用户}}已关联人物卡：{{人物卡名}}',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'nn.clear',
        name: '人物卡关联-取消关联',
        description: '.nn clear<br><u>@Maca 已取消关联人物卡</u>',
        defaultTemplate: '{{at用户}}已取消关联人物卡',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'nn.search',
        name: '人物卡关联-关键词搜索',
        description: '.nn 木<br><u>@Maca 请选择想要关联的人物卡：<br>铃木翼a<br>铃木翼b</u>',
        defaultTemplate: '{{at用户}}请选择想要关联的人物卡：\n{{#人物卡列表}}{{人物卡名}}{{^last}}\n{{/last}}{{/人物卡列表}}\n{{^人物卡列表}}未找到名字包含{{关键词}}的人物卡{{/人物卡列表}}',
        args: [_.用户名, _.人物卡名, _.at用户, { name: '人物卡列表' }, { name: '关键词' }]
      },
    ]
  },
  {
    name: '先攻',
    items: [
      // {
      //   key: 'roll.ri.unsupported',
      //   name: '先攻-不支持',
      //   description: '.ri<br><u>当前场景不支持先攻列表</u>',
      //   defaultTemplate: '当前场景不支持先攻列表',
      //   args: [_.用户名, _.人物卡名, _.at用户]
      // },
      {
        key: 'roll.ri.del',
        name: '先攻-删除人物',
        description: '.init del @Maca<br><u>Maca 删除先攻：@Maca</u>',
        defaultTemplate: '{{用户名}} 删除先攻：{{#人物列表}}{{人物名}}{{^last}}、{{/last}}{{/人物列表}}',
        args: [_.用户名, _.人物卡名, _.at用户, { name: '人物列表', section: true }, { name: '人物名' }, { name: '人物唯一', section: true }, _.last]
      },
      {
        key: 'roll.ri.clear',
        name: '先攻-清空列表',
        description: '.init clr<br><u>*先攻列表已清空</u>',
        defaultTemplate: '*先攻列表已清空',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
    ]
  },
  {
    name: 'COC 理智检定',
    items: [
      {
        key: 'roll.sc.unsupported',
        name: '理智检定-不支持',
        description: '.sc<br>Maca 🎲 d% = 69<u> ……未指定理智值，成功了吗？</u>',
        defaultTemplate: ' ……未指定理智值，成功了吗？',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'roll.sc.extra',
        name: '理智检定-附加语',
        description: '.sc1/1d3<br>Maca 🎲 d% = 44 / 30 失败<br>Maca 🎲 理智损失 1d3: [3] = 3<br><u>理智变化：30 → 27</u>',
        defaultTemplate: '\n{{#掷骰结果}}理智变化：{{旧值}} → {{新值}}{{/掷骰结果}}',
        args: [_.用户名, _.人物卡名, _.at用户, { name: '旧值' }, { name: '新值' }, { name: '损失值' }, _.原始指令, _.掷骰结果, _.掷骰表达式, _.掷骰输出]
      },
    ]
  },
  {
    name: 'COC 成长检定',
    items: [
      {
        key: 'roll.en.empty',
        name: '成长检定-不支持',
        description: '.en<br><u>Maca 当前暂无可成长的技能或不支持成长</u>',
        defaultTemplate: '{{用户名}} 当前暂无可成长的技能或不支持成长',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
      {
        key: 'roll.en.list',
        name: '成长检定-列出技能',
        description: '.en list<br><u>Maca 当前可成长的技能：<br>手枪、侦察、心理学</u>',
        defaultTemplate: '{{用户名}} 当前可成长的技能：\n{{#技能列表}}{{技能名}}{{^last}}、{{/last}}{{/技能列表}}',
        args: [_.用户名, _.人物卡名, _.at用户, { name: '技能列表', section: true }, { name: '技能名' }, { name: '技能唯一', section: true }, _.last]
      },
      {
        key: 'roll.en.extra',
        name: '成长检定-附加语',
        description: '.en 图书馆<br>Maca 🎲 图书馆 d% = 71 / 70 成功<br>Maca 🎲 图书馆成长 d10 = 1<br><u>图书馆变化：70 → 71</u>',
        defaultTemplate: '\n{{描述}}变化：{{旧值}} → {{新值}}',
        args: [_.用户名, _.人物卡名, _.at用户, { name: '旧值' }, { name: '新值' }, { name: '变化值' }, _.原始指令, _.描述, _.掷骰结果, _.掷骰表达式, _.掷骰输出]
      },
      {
        key: 'roll.en.mark',
        name: '成长检定-打标记',
        description: '.en+侦查 图书馆<br><u>Maca 已添加以下技能成长标记：<br>侦查、图书馆</u>',
        defaultTemplate: '{{用户名}} 已{{#添加}}添加{{/添加}}{{^添加}}移除{{/添加}}以下技能成长标记：\n{{#技能列表}}{{技能名}}{{^last}}、{{/last}}{{/技能列表}}',
        args: [_.用户名, _.人物卡名, _.at用户, { name: '添加', section: true }, { name: '技能列表', section: true }, { name: '技能名' }, { name: '技能唯一', section: true }, _.last]
      },
      {
        key: 'roll.en.markclear',
        name: '成长检定-清除所有标记',
        description: '.en clear<br><u>Maca 已移除所有的技能成长标记</u>',
        defaultTemplate: '{{用户名}} 已移除所有的技能成长标记',
        args: [_.用户名, _.人物卡名, _.at用户]
      },
    ]
  },
  {
    name: 'DND 死亡豁免',
    items: [
      {
        key: 'roll.ds.best',
        name: '死亡豁免-起死回生',
        description: '.ds<br>Maca 🎲 死亡豁免 d20: [20] = 20<u> 起死回生，HP+1</u>',
        defaultTemplate: ' 起死回生，HP+1',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出]
      },
      {
        key: 'roll.ds.worst',
        name: '死亡豁免-二次失败',
        description: '.ds<br>Maca 🎲 死亡豁免 d20: [1] = 1<u> 二次失败</u>',
        defaultTemplate: ' 二次失败',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出]
      },
      {
        key: 'roll.ds.tostable',
        name: '死亡豁免-伤势稳定',
        description: '.ds<br>Maca 🎲 死亡豁免 d20: [12] = 12 / 10 成功<u><br>成功三次，伤势稳定了</u>',
        defaultTemplate: '\n成功三次，伤势稳定了',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出]
      },
      {
        key: 'roll.ds.todeath',
        name: '死亡豁免-去世',
        description: '.ds<br>Maca 🎲 死亡豁免 d20: [2] = 2 / 10 失败<u><br>失败三次，去世了</u>',
        defaultTemplate: '\n失败三次，去世了',
        args: [_.用户名, _.人物卡名, _.at用户, _.原始指令, _.描述, _.目标值, _.掷骰结果, _.掷骰表达式, _.掷骰输出]
      },
    ]
  },
])

export default customTextMeta
