import { nanoid } from 'nanoid'

export type ECNode = {
  _id: string
  computedId?: string
  id?: number
  type: 'node' | 'option'
  title: string
  creator?: string
  options?: (ECNode & { when: boolean })[]
  child?: ECNode
  when?: boolean
  value?: boolean | null
  answer?: string

}

export type ECNodeOption = ECNode & { when: boolean }

export const schema = reactive({
  name: 'Заявка на закупку',
  nodes: [{ _id: 'IQQznVZ6JWMyD-DuzxODW', id: 1, type: 'node', title: 'У заявки фиксированная сумма?', options: [{ _id: 'o4inO5-KwlYbpX40MMsfk', title: 'Фиксированная сумма для группы заявок', type: 'option', when: true }, { _id: '2g3S8hNClao-NwSmyJzqW', title: 'Фиксированная сумма для одной заявки', type: 'option', when: true }, { _id: 'ZOmEQsXUwFBwP1RY8yQBE', title: 'Сумма будет определяться по доп. соглашениям', type: 'option', when: false }] }, { _id: 'jBigyw7804yePTjKMGjg1', id: 2, type: 'node', title: 'Есть номер лота?', options: [{ _id: 'C9lS5xCVp-GcleF6RwHDP', creator: 'jBigyw7804yePTjKMGjg1', type: 'node', title: 'Закупка в ГКПЗ утверждена?', options: [{ _id: 'ee62lmDPO40sYeBs4ybNx', title: 'В закупке один лот', type: 'option', when: true }, { _id: 'fmGMyR-t1KKFxdZhucSzO', title: 'В закупке несколько лотов', type: 'option', when: true }, { _id: 'jXi9Rb85QjRHVg0JGgmaR', type: 'option', title: 'Во внеплановой закупке один лот', when: false }], when: true }, { _id: 'd0V_jW019gTkrwp1iIA7q', creator: 'jBigyw7804yePTjKMGjg1', type: 'node', title: 'Способ закупки упрощённый?', options: [{ _id: 'Kh3zOR2JYWC9TcL_R-Obp', title: 'УЗ или ЕИ или РЗП', type: 'option', when: true }, { _id: '03DhyN64UoZ16bXVZ13qK', title: 'Другой способ', type: 'option', when: false }], when: true }, { _id: 'toSKufj2qw4s9fq7MEzY1', type: 'option', title: 'Входит в список не включаемых ГКПЗ', when: false }, { _id: '2GRqbMc634l-_p8b0kkFT', type: 'option', title: 'Биржевая закупка', when: false }] }, { _id: 'klGVfQ0KbCmE8KGEe25iy', id: 3, type: 'node', title: 'Договор с НДС', options: [{ _id: 'tIfDo-2g1oBn0bCaCtQ5Z', creator: 'klGVfQ0KbCmE8KGEe25iy', type: 'node', title: 'Ставка НДС будет одна?', options: [{ _id: 'KfnZT2mRoR-GNbxm-Ibxz', title: 'Ставка НДС одна', type: 'option', when: true }, { _id: 'viE0csX3vQaDPor00MuQ6', title: 'Несколько ставок НДС', type: 'option', when: false }], when: true }, { _id: '6BOc_MCR_DmqtAOmr8OT6', type: 'option', title: 'Сумма договора без НДС', when: false }] }] as ECNode[],
})

export const deleteNodeOption = (node: ECNode, option: ECNodeOption) => {
  if (node.options) { return node.options.filter(nodeOption => nodeOption._id !== option._id) }
}

export const addNodeOption = (node: ECNode, when: boolean) => {
  node.options?.push({
    _id: nanoid(),
    type: 'option',
    title: '',
    when,
  })
}

export const addNodeChild = (node: ECNode, when: boolean) => {
  node.options?.push(
    {
      _id: nanoid(),
      creator: node._id,
      type: 'node',
      title: '',
      options: [
        { _id: nanoid(), title: '', type: 'option', when: true },
        { _id: nanoid(), title: '', type: 'option', when: false },
      ],
      when,
    },
  )
}

export const addNode = (nodes: ECNode[]) => {
  const lastId = nodes[nodes.length - 1].id || 0
  nodes.push(
    {
      _id: nanoid(),
      id: lastId + 1,
      type: 'node',
      title: '',
      options: [
        { _id: nanoid(), title: '', type: 'option', when: true },
        { _id: nanoid(), title: '', type: 'option', when: false },
      ],
    },
  )
}

export const enrichWithFillData = (schema: {name: string; nodes: ECNode[]}) => {
  const addIdAndValue = (nodes: ECNode[]) => {
    nodes.forEach((e, i) => {
      e.id = i + 1
      e.value = null

      if (e.options) {
        addIdAndValue(e.options)
      }
    })
  }

  const addComputedId = (node: ECNode) => {
    const parentId = node.computedId || node.id
    node.answer = ''

    node.options?.forEach((e) => {
      e.computedId = `${parentId}.${e.id}`

      if (e.type === 'node') {
        addComputedId(e)
      }
    })
  }

  addIdAndValue(schema.nodes)

  schema.nodes.forEach((node) => {
    addComputedId(node)
  })
}
