import FileSaver from 'file-saver'
import { nanoid } from 'nanoid'
import { Ref } from 'vue'
import cloneDeep from 'lodash.clonedeep'
import { Answers } from './pdf'

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

export function useSchema() {
  return { schema }
}

export function deleteNodeOption(node: ECNode, option: ECNodeOption) {
  if (node.options) {
    return node.options.filter((nodeOption) => nodeOption._id !== option._id)
  }
}

export function addNodeOption(node: ECNode, when: boolean) {
  node.options?.push({
    _id: nanoid(),
    type: 'option',
    title: '',
    when,
  })
}

export function addNodeChild(node: ECNode, when: boolean) {
  node.options?.push({
    _id: nanoid(),
    creator: node._id,
    type: 'node',
    title: '',
    options: [
      { _id: nanoid(), title: '', type: 'option', when: true },
      { _id: nanoid(), title: '', type: 'option', when: false },
    ],
    when,
  })
}

export function addNode(nodes: ECNode[]) {
  const lastId = nodes[nodes.length - 1]?.id || 0
  nodes.push({
    _id: nanoid(),
    id: lastId + 1,
    type: 'node',
    title: '',
    options: [
      { _id: nanoid(), title: '', type: 'option', when: true },
      { _id: nanoid(), title: '', type: 'option', when: false },
    ],
  })
}

export function useEnrichedSchema() {
  const enrichedSchema = computed(() => {
    const schemaCopy = reactive(cloneDeep(schema))

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

    addIdAndValue(schemaCopy.nodes)

    schemaCopy.nodes.forEach((node) => {
      addComputedId(node)
    })

    return schemaCopy
  })

  return { enrichedSchema }
}

export function deleteNode(node: ECNode, parent: ECNode | null) {
  if (!parent) {
    schema.nodes = schema.nodes
      .filter((e) => e._id !== node._id)
      .map((e, i) => {
        return {
          ...e,
          id: i + 1,
        }
      })
    return
  }

  if (parent.options) {
    parent.options = parent.options.filter((e) => e._id !== node._id)
  }
}

export function setSchema(schemaToSet: { name: string; nodes: ECNode[] }) {
  schema.name = schemaToSet.name
  schema.nodes = schemaToSet.nodes
}

export function resetSchema() {
  schema.name = ''
  schema.nodes = []
}

export function schemaToFile() {
  const file = new Blob([JSON.stringify(schema)], {
    type: 'application/json',
  })

  FileSaver.saveAs(file, `${schema.name}.json`)
}

export function isNodeCompleted(node: ECNode) {
  const hasSubnodes = node.options?.some((nodeEl) => nodeEl.type === 'node')

  if (hasSubnodes) {
    const relevantNodes = node.options?.filter((nodeEl) => {
      if (nodeEl.type === 'option') {
        return false
      }

      if (nodeEl.when !== node.value) {
        return false
      }

      return true
    })

    if (!relevantNodes?.length) {
      return !!node.answer
    }

    return relevantNodes?.every((nodeEl) => nodeEl.answer)
  }

  return !!node.answer
}

export function useSchemaAnswers(nodes: ECNode[]) {
  const answers: Ref<Answers> = ref([])

  const getNodeAnswers = (node: ECNode, indent: number) => {
    const question = `${node.computedId || `${node.id}.`} ${node.title}`
    const questionAnswer = node.value ? 'Да' : 'Нет'
    const selectedOption = node.answer || ''

    answers.value.push({
      question,
      questionAnswer,
      selectedOption,
      indent,
    })

    const hasSubnodes = node.options?.some((nodeEl) => nodeEl.type === 'node')
    if (hasSubnodes) {
      node.options?.forEach((nodeOption) => {
        if (nodeOption.type === 'node' && node.value === nodeOption.when) {
          getNodeAnswers(nodeOption, indent + 8)
        }
      })
    }
  }

  nodes.forEach((node) => getNodeAnswers(node, 0))

  return { answers }
}
