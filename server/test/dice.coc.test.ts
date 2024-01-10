import { ICard } from '../../interface/card/types'
import { createDiceRoll, IDiceRollContext } from '../service/dice/utils'
import { ChannelConfig } from '../service/config/config'
import { getInitialDefaultConfig } from '../service/config/default'
import { CocCard } from '../../interface/card/coc'
import { getCocCardProto, MockChannelId, MockUserId, resetRandomEngine } from './utils'

function createContext(card: ICard): IDiceRollContext {
  return {
    channelId: MockChannelId,
    userId: MockUserId,
    username: 'Maca',
    userRole: 'admin',
    config: new ChannelConfig(getInitialDefaultConfig()),
    getCard: () => card,
    linkCard: () => {},
    queryCard: () => []
  }
}

describe('已关联COC人物卡', () => {
  let card: CocCard
  let context: IDiceRollContext

  beforeEach(() => {
    card = new CocCard(getCocCardProto())
    context = createContext(card)
    resetRandomEngine(1)
  })

  test('检定', () => {
    const roller = createDiceRoll('d100 侦察', context)
    expect(roller.output).toBe('Maca 🎲 侦察 d100: [2] = 2 / 40 成功')
  })

  test('检定+调整值', () => {
    const roller = createDiceRoll('d100 侦察 + 10', context)
    expect(roller.output).toBe('Maca 🎲 侦察 d100: [2] = 2 / 50 成功')
  })

  test('默认骰检定', () => {
    const roller = createDiceRoll('d侦察', context)
    expect(roller.output).toBe('Maca 🎲 侦察 d%: [2] = 2 / 40 成功')
  })

  test('默认骰检定2', () => {
    const roller = createDiceRoll('侦察', context)
    expect(roller.output).toBe('Maca 🎲 侦察 d%: [2] = 2 / 40 成功')
  })

  test('临时值优先于人物卡', () => {
    const roller = createDiceRoll('d100 侦察 50', context)
    expect(roller.output).toBe('Maca 🎲 侦察 d100: [2] = 2 / 50 成功')
  })

  test('不存在技能仅回显', () => {
    const roller = createDiceRoll('不存在技能', context)
    expect(roller.output).toBe('Maca 🎲 不存在技能 d%: [2] = 2')
  })

  test('人物卡引用', () => {
    const roller = createDiceRoll('3d100<=$力量', context)
    expect(roller.output).toBe('Maca 🎲 3d100<=60: [2*, 2*, 2*] = 3')
  })

  test('人物卡引用使用大括号', () => {
    const roller = createDiceRoll('${力量}+${理智}', context)
    expect(roller.output).toBe('Maca 🎲 60+30: 60+30 = 90')
  })

  test('直接引用表达式', () => {
    const roller = createDiceRoll('徒手格斗', context)
    expect(roller.output).toBe('Maca 🎲 徒手格斗\n先是 🎲 db 0: 0 = 0\n最后 🎲 1d3+0: [2]+0 = 2')
  })

  test('描述不应解析为表达式', () => {
    const roller = createDiceRoll('d% 徒手格斗', context)
    expect(roller.output).toBe('Maca 🎲 徒手格斗 d%: [2] = 2')
  })

  test('表达式内嵌', () => {
    const roller = createDiceRoll('$徒手格斗+1d6+1', context)
    expect(roller.output).toBe('Maca 🎲\n先是 🎲 db 0: 0 = 0\n然后 🎲 徒手格斗 1d3+0: [2]+0 = 2\n最后 🎲 2+1d6+1: 2+[2]+1 = 5')
  })

  test('组合检定', () => {
    const roller = createDiceRoll('侦察 图书馆', context)
    expect(roller.output).toBe('Maca 🎲 侦察，图书馆 d%: [2] = 2\n侦察 2 / 40 成功\n图书馆 2 / 70 成功')
  })

  test('coc理智检定 默认骰', () => {
    const roller = createDiceRoll('sc', context)
    roller.applyToCard()
    expect(roller.output.trim()).toBe('Maca 🎲 d% = 2 / 30 成功\nMaca 🎲 理智损失 0: 0 = 0')
  })

  test('coc理智检定', () => {
    const roller = createDiceRoll('sc 0/d10', context)
    roller.applyToCard()
    expect(roller.output.trim()).toBe('Maca 🎲 d% = 2 / 30 成功\nMaca 🎲 理智损失 0: 0 = 0')
  })

  test('coc理智检定 临时值优先', () => {
    const roller = createDiceRoll('sc 1/d3 60', context)
    roller.applyToCard()
    expect(roller.output).toBe('Maca 🎲 d% = 2 / 60 成功\nMaca 🎲 理智损失 1: 1 = 1\n理智变化：60 → 59')
  })

  test('coc理智检定 调整值', () => {
    const roller = createDiceRoll('sc 1/d3直视伟大的克苏鲁+10', context)
    roller.applyToCard()
    expect(roller.output).toBe('Maca 🎲 直视伟大的克苏鲁 d% = 2 / 40 成功\nMaca 🎲 理智损失 1: 1 = 1\n理智变化：30 → 29')
  })

  test('coc理智检定 区分大成功', () => {
    resetRandomEngine(0)
    const roller = createDiceRoll('sc 0/d10', context)
    roller.applyToCard()
    expect(roller.output.trim()).toBe('Maca 🎲 d% = 1 大成功\nMaca 🎲 理智损失 0: 0 = 0')
  })

  test('coc理智检定 负数特殊处理', () => {
    const roller = createDiceRoll('sc d10-3', context)
    roller.applyToCard()
    expect(roller.output).toBe('Maca 🎲 d% = 2 / 30 成功\nMaca 🎲 理智损失 d10-3: [2]-3 = -1\n理智变化：30 → 30')
    const roller2 = createDiceRoll('sc d10-30', context)
    roller2.applyToCard()
    expect(roller2.output).toBe('Maca 🎲 d% = 2 / 30 成功\nMaca 🎲 理智损失 d10-30: [2]-30 = -28\n理智变化：30 → 58')
  })

  test('coc理智检定 inline 嵌套', () => {
    const roller = createDiceRoll('sc[[1d10]]/[[$1+1]]', context)
    roller.applyToCard()
    expect(roller.output).toBe('Maca 🎲 d% = 2 / 30 成功\nMaca 🎲 理智损失 2: 2 = 2\n理智变化：30 → 28')
  })

  test('coc成长检定 列出', () => {
    const initRoll = createDiceRoll('侦查', context)
    initRoll.applyToCard()
    const roller = createDiceRoll('enl', context)
    expect(roller.output).toBe('Maca 当前可成长的技能：\n侦查')
  })

  test('coc成长检定 全部', () => {
    const initRoll = createDiceRoll('侦查', context)
    initRoll.applyToCard()
    const roller = createDiceRoll('en', context)
    expect(roller.output).toBe('Maca 🎲 侦查 d% = 2 / 40 失败')
  })

  test('coc成长检定 指定技能', () => {
    const roller = createDiceRoll('en图书馆', context)
    expect(roller.output).toBe('Maca 🎲 图书馆 d% = 2 / 70 失败')
  })

  test('coc成长检定 成功', () => {
    resetRandomEngine(70)
    const roller = createDiceRoll('en图书馆', context)
    roller.applyToCard()
    expect(roller.output).toBe('Maca 🎲 图书馆 d% = 71 / 70 成功\nMaca 🎲 图书馆成长 d10 = 1\n图书馆变化：70 → 71')
  })

  test('coc成长检定 临时值优先', () => {
    const roller = createDiceRoll('en图书馆60', context)
    expect(roller.output).toBe('Maca 🎲 图书馆 d% = 2 / 60 失败')
  })

  test('coc成长检定 +标记', () => {
    const roller = createDiceRoll('en+侦查 图书馆', context)
    roller.applyToCard()
    expect(roller.output).toBe('Maca 已添加以下技能成长标记：\n侦查、图书馆')
    expect(card.data.meta.skillGrowth.侦查).toBe(true)
    expect(card.data.meta.skillGrowth.图书馆).toBe(true)
  })

  test('coc成长检定 -标记', () => {
    card.data.meta.skillGrowth.侦查 = true
    card.data.meta.skillGrowth.图书馆 = true
    const roller = createDiceRoll('en-侦查 图书馆', context)
    roller.applyToCard()
    expect(roller.output).toBe('Maca 已移除以下技能成长标记：\n侦查、图书馆')
    expect(card.data.meta.skillGrowth.侦查).toBeFalsy()
    expect(card.data.meta.skillGrowth.图书馆).toBeFalsy()
  })

  test('coc成长检定 清除', () => {
    card.data.meta.skillGrowth.侦查 = true
    card.data.meta.skillGrowth.图书馆 = true
    const roller = createDiceRoll('enx', context)
    roller.applyToCard()
    expect(roller.output).toBe('Maca 已移除所有的技能成长标记')
    expect(card.data.meta.skillGrowth).toMatchObject({})
  })

  test('st 展示指定技能', () => {
    const roller = createDiceRoll('st show 侦查', context)
    expect(roller.output).toBe(`<@!${MockUserId}>(铃木翼):\n侦查:40`)
  })

  test('st 展示指定表达式', () => {
    const roller = createDiceRoll('st show 徒手格斗', context)
    expect(roller.output).toBe(`<@!${MockUserId}>(铃木翼):\n徒手格斗:1d3+$db`)
  })

  test('st 未指定', () => {
    const roller = createDiceRoll('st', context)
    expect(roller.output).toBe(`<@!${MockUserId}>请指定想要设置的属性名与属性值`)
  })

  test('st 修改', () => {
    const roller = createDiceRoll('st 侦查+10', context)
    expect(roller.output).toBe(`<@!${MockUserId}>(铃木翼) 设置:\n侦查 40+10: 40+10 = 50`)
  })

  test('st 批量新增', () => {
    const roller = createDiceRoll('st 拉拉20，打架30', context)
    expect(roller.output).toBe(`<@!${MockUserId}>(铃木翼) 设置:\n拉拉 20: 20 = 20\n打架 30: 30 = 30`)
  })

  test('st = 处理', () => {
    const roller = createDiceRoll('st 侦察=99', context)
    expect(roller.output).toBe(`<@!${MockUserId}>(铃木翼) 设置:\n侦察 99: 99 = 99`)
  })

  test('st 设置 ability', () => {
    const roller = createDiceRoll('st &徒手格斗1d10+$db,命中d100', context)
    roller.applyToCard()
    expect(roller.output).toBe(`<@!${MockUserId}>(铃木翼) 设置:\n徒手格斗 1d10+$db\n命中 d100`)
    const ability1 = card.getAbility('徒手格斗')
    expect(ability1?.value).toBe('1d10+$db')
    const ability2 = card.getAbility('命中')
    expect(ability2?.value).toBe('d100')
  })

  test('coc 先攻默认骰', () => {
    const roller = createDiceRoll('ri', context)
    expect(roller.output).toBe('Maca 🎲 先攻 60: 60 = 60')
  })
})

export {}
