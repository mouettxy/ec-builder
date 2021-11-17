<script setup lang="ts">
import { BrowserJsPlumbInstance, newInstance } from '@jsplumb/browser-ui'
import { Ref } from '@vue/reactivity'
import { FlowchartConnector } from '@jsplumb/connector-flowchart'
import { AnchorSpec, OverlaySpec } from '@jsplumb/common'

const flowchart = ref(null) as Ref<Element | null>
const instance: Ref<BrowserJsPlumbInstance | null> = ref(null)

type FlowchartBlock = {
  id: string
  text: string
  position: [number, number]
  anchors?: [AnchorSpec, AnchorSpec]
  type: 'block' | 'question'
  links?: string[]
  when?: boolean
}

const blocks: FlowchartBlock[] = [
  {
    id: 'chart_1',
    text: 'У заявки фиксированная сумма?',
    type: 'question',
    position: [0, 380],
  },
  {
    id: 'chart_1_1',
    links: ['chart_1'],
    anchors: ['Left', 'Top'],
    when: true,
    text: 'Фиксированная сумма для группы заявок',
    type: 'block',
    position: [140, 0],
  },
  {
    id: 'chart_1_2',
    links: ['chart_1'],
    anchors: ['Left', 'Top'],
    when: true,
    text: 'Фиксированная сумма для одной заявки',
    type: 'block',
    position: [140, 220],
  },
  {
    id: 'chart_1_3',
    links: ['chart_1'],
    anchors: ['Right', 'Top'],
    when: false,
    text: 'Сумма будет определяться по доп. соглашениям',
    type: 'block',
    position: [140, 640],
  },
  {
    id: 'chart_2',
    links: ['chart_1_3', 'chart_1_2', 'chart_1_1'],
    anchors: ['Bottom', 'Top'],
    text: 'Есть номер лота?',
    type: 'question',
    position: [280, 380],
  },
  {
    id: 'chart_2_1',
    links: ['chart_2'],
    anchors: ['Left', 'Top'],
    when: true,
    text: 'Закупка в ГКПЗ утверждена?',
    type: 'question',
    position: [420, 180],
  },
  {
    id: 'chart_2_1_1',
    links: ['chart_2_1'],
    anchors: ['Left', 'Top'],
    when: true,
    text: 'В закупке один лот',
    type: 'block',
    position: [560, -170],
  },
  {
    id: 'chart_2_1_2',
    links: ['chart_2_1'],
    anchors: ['Left', 'Top'],
    when: true,
    text: 'В закупке несколько лотов',
    type: 'block',
    position: [560, 40],
  },
  {
    id: 'chart_2_1_3',
    links: ['chart_2_1'],
    anchors: ['Right', 'Top'],
    when: false,
    text: 'Во внеплановой закупке один лот',
    type: 'block',
    position: [560, 420],
  },
  {
    id: 'chart_2_2',
    links: ['chart_2_1_3', 'chart_2_1_2', 'chart_2_1_1'],
    anchors: ['Bottom', 'Top'],
    text: 'Способ закупки упрощённый? (УЗ, ЕИ, РЗП)',
    type: 'question',
    position: [700, 180],
  },
  {
    id: 'chart_2_2_1',
    links: ['chart_2_2'],
    anchors: ['Left', 'Top'],
    when: true,
    text: 'УЗ или ЕИ или РЗП',
    type: 'block',
    position: [840, 40],
  },
  {
    id: 'chart_2_2_2',
    links: ['chart_2_2'],
    anchors: ['Right', 'Top'],
    when: false,
    text: 'Другой способ',
    type: 'block',
    position: [840, 420],
  },
  {
    id: 'chart_2_3',
    links: ['chart_2'],
    anchors: ['Right', 'Top'],
    when: false,
    text: 'Входит в список не включаемых в ГКПЗ',
    type: 'block',
    position: [840, 660],
  },
  {
    id: 'chart_2_4',
    links: ['chart_2'],
    anchors: ['Right', 'Top'],
    when: false,
    text: 'Биржевая закупка',
    type: 'block',
    position: [840, 900],
  },
  {
    id: 'chart_3',
    links: ['chart_2_3', 'chart_2_4', 'chart_2_2_1', 'chart_2_2_2'],
    anchors: ['Bottom', 'Top'],
    text: 'Договор с НДС?',
    type: 'question',
    position: [980, 380],
  },
  {
    id: 'chart_3_1',
    links: ['chart_3'],
    anchors: ['Left', 'Top'],
    when: true,
    text: 'Ставка НДС будет одна?',
    type: 'question',
    position: [1120, 180],
  },
  {
    id: 'chart_3_1_1',
    links: ['chart_3_1'],
    anchors: ['Left', 'Top'],
    when: true,
    text: 'Ставка НДС одна',
    type: 'block',
    position: [1260, 40],
  },
  {
    id: 'chart_3_1_2',
    links: ['chart_3_1'],
    anchors: ['Right', 'Top'],
    when: false,
    text: 'Несколько ставок НДС',
    type: 'block',
    position: [1260, 420],
  },
  {
    id: 'chart_3_3',
    links: ['chart_3'],
    anchors: ['Right', 'Top'],
    when: false,
    text: 'Сумма договора без НДС',
    type: 'block',
    position: [1260, 660],
  },
  {
    id: 'chart_4',
    links: ['chart_3_3', 'chart_3_1_2', 'chart_3_1_1'],
    anchors: ['Bottom', 'Top'],
    text: 'Сумма графика оплаты по договору равна сумме графика поставки?',
    type: 'question',
    position: [1400, 380],
  },
  {
    id: 'chart_4_1',
    links: ['chart_4'],
    anchors: ['Left', 'Top'],
    text: 'Не денежные расчеты',
    when: true,
    type: 'block',
    position: [1540, 180],
  },
  {
    id: 'chart_4_2',
    links: ['chart_4'],
    anchors: ['Right', 'Top'],
    text: 'Денежные расчеты',
    when: false,
    type: 'block',
    position: [1540, 660],
  },
  {
    id: 'chart_5',
    links: ['chart_4_2', 'chart_4_1'],
    anchors: ['Bottom', 'Top'],
    text: 'Необходимо контроллировать равенство суммы УСД и БГ?',
    type: 'question',
    position: [1680, 380],
  },
  {
    id: 'chart_5_1',
    links: ['chart_5'],
    anchors: ['Left', 'Top'],
    text: 'Контроль по сумме отсутствует',
    when: true,
    type: 'block',
    position: [1820, 180],
  },
  {
    id: 'chart_5_2',
    links: ['chart_5'],
    anchors: ['Right', 'Top'],
    text: 'Контроль по сумме есть',
    when: false,
    type: 'block',
    position: [1820, 660],
  },
  {
    id: 'chart_6',
    links: ['chart_5_2', 'chart_5_1'],
    anchors: ['Bottom', 'Top'],
    text: 'Договор будет заключен от имени ИАП в интересах двух и более БУ',
    type: 'question',
    position: [1960, 380],
  },
  {
    id: 'chart_6_1',
    links: ['chart_6'],
    anchors: ['Left', 'Top'],
    text: 'Централизованный',
    when: true,
    type: 'block',
    position: [2100, 180],
  },
  {
    id: 'chart_6_2',
    links: ['chart_6'],
    anchors: ['Right', 'Top'],
    text: 'Не централизованный',
    when: false,
    type: 'block',
    position: [2100, 660],
  },
]

const getElement = (id: string): Element => {
  return flowchart.value?.querySelector(`#${id}`) as Element
}

const connectElement = (
  sourceId: string,
  targetId: string,
  anchors: [AnchorSpec, AnchorSpec] | undefined,
  when: boolean | undefined
) => {
  const overlays: OverlaySpec[] = [
    {
      type: 'Arrow',
      options: {
        location: 1,
        width: 8,
        length: 8,
      },
    },
  ]

  if (
    when === true &&
    !flowchart.value?.querySelector(
      `div[jtk-overlay-id="arrow_yes_${sourceId}"]`
    )
  ) {
    overlays.push({
      type: 'Label',
      options: {
        label: 'Да',
        location: 0.1,
        id: `arrow_yes_${sourceId}`,
        cssClass: 'label',
      },
    })
  }

  if (
    when === false &&
    !flowchart.value?.querySelector(
      `div[jtk-overlay-id="arrow_no_${sourceId}"]`
    )
  ) {
    overlays.push({
      type: 'Label',
      options: {
        label: 'Нет',
        location: 0.1,
        id: `arrow_no_${sourceId}`,
        cssClass: 'label',
      },
    })
  }
  instance.value?.connect({
    source: getElement(sourceId),
    target: getElement(targetId),
    anchor: 'Continuous',
    scope: sourceId,
    endpointStyle: {
      draggable: false,
    },
    anchors,
    overlays,
  })
}

onMounted(() => {
  nextTick(() => {
    instance.value = newInstance({
      container: flowchart.value || undefined,
      endpoint: 'Blank',
      connector: {
        type: FlowchartConnector.type,
        options: {
          gap: 4,
          cornerRadius: 2,
        },
      },
      paintStyle: {
        strokeWidth: 1,
        stroke: 'black',
        outlineWidth: 1,
      },
    })

    blocks.forEach((block) => {
      if (block.links?.length) {
        block.links.forEach((link) => {
          connectElement(link, block.id, block.anchors, block.when)
        })
      }
    })
  })
})
</script>

<template>
  <div ref="flowchart" class="ec-flowchart">
    <template v-for="block in blocks" :key="block.id">
      <template v-if="block.type === 'question'">
        <ec-chart-question
          :id="block.id"
          class="jtk-node"
          :top="block.position[0]"
          :left="block.position[1] + 200"
          :width="280"
          :height="140"
        >
          {{ block.text }}
        </ec-chart-question>
      </template>
      <template v-else-if="block.type === 'block'">
        <ec-chart-block
          :id="block.id"
          :top="block.position[0]"
          :left="block.position[1] + 200"
          :width="200"
          :height="80"
        >
          {{ block.text }}
        </ec-chart-block>
      </template>
    </template>
  </div>
</template>

<style>
.ec-flowchart {
  @apply flex flex-col items-center relative;
}

.ec-flowchart .jtk-endpoint {
  @apply !hidden;
}

.ec-flowchart .jtk-overlay.label {
  @apply bg-white z-10 p-2;
}
</style>

<route lang="yaml">
name: flowchart
meta:
  header: Блок-схема
</route>
