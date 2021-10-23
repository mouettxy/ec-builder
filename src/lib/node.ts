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
  name: '',
  nodes: [] as ECNode[],
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
  const lastId = nodes[nodes.length - 1]?.id || 0
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

export const setSchema = (schemaToSet: {name: string; nodes: ECNode[]}, enrich: boolean) => {
  schema.name = schemaToSet.name
  schema.nodes = schemaToSet.nodes

  if (enrich) {
    enrichWithFillData(schema)
  }
}

export const resetSchema = () => {
  schema.name = ''
  schema.nodes = []
}
