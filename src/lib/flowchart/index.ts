import { AnchorSpec, OverlaySpec } from '@jsplumb/common'
import { newInstance } from '@jsplumb/browser-ui'
import { FlowchartConnector } from '@jsplumb/connector-flowchart'
import { ECNode, Instruction } from '~/lib/schema'
import {
  FlowchartNode,
  FlowchartNodeParent,
  JSPlumbRef,
} from '~/lib/flowchart/types'

export const jsPlumb: JSPlumbRef = ref(null)

export const initJsPlumb = (container: HTMLElement | Element) => {
  if (!jsPlumb.value) {
    jsPlumb.value = newInstance({
      container,
      endpoint: 'Blank',
      connector: {
        type: FlowchartConnector.type,
        options: {
          gap: 4,
          cornerRadius: 2,
        },
      },
      elementsDraggable: false,
      paintStyle: {
        strokeWidth: 1,
        stroke: 'black',
        outlineWidth: 1,
      },
    })
  }
}

export const resetJsPlumb = () => {
  jsPlumb.value = null
}

export const getElementById = (id: string) => {
  return document.getElementById(id) as Element
}

const getConnectorLabelId = (id: string, type: 'yes' | 'no') => {
  if (type === 'yes') {
    const arrowId = `arrow_yes_${id}`
    return {
      id: arrowId,
      selector: `div[jtk-overlay-id="${arrowId}"]`,
    }
  } else {
    const arrowId = `arrow_no_${id}`
    return {
      id: arrowId,
      selector: `div[jtk-overlay-id="${arrowId}"]`,
    }
  }
}

export const connectNodes = (sourceId: string, node: FlowchartNode) => {
  const labelYes = getConnectorLabelId(sourceId, 'yes')
  const labelNo = getConnectorLabelId(sourceId, 'no')
  const linksCount = node.links?.length || 0
  const isDecisionConnector = node.type === 'decision' && linksCount > 1

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
    node.when === true &&
    !document.querySelector(labelYes.selector) &&
    !isDecisionConnector
  ) {
    overlays.push({
      type: 'Label',
      options: {
        label: 'Да',
        location: 40,
        id: labelYes.id,
        cssClass: 'label',
      },
    })
  }

  if (
    node.when === false &&
    !document.querySelector(labelNo.selector) &&
    !isDecisionConnector
  ) {
    overlays.push({
      type: 'Label',
      options: {
        label: 'Нет',
        location: 40,
        id: labelNo.id,
        cssClass: 'label',
      },
    })
  }

  jsPlumb.value?.connect({
    source: getElementById(sourceId),
    target: getElementById(node.id),
    anchor: 'Continuous',
    scope: sourceId,
    endpointStyle: {
      draggable: false,
    },
    anchors: node.anchors,
    overlays,
  })
}

export const setupConnections = (nodes: FlowchartNode[]) => {
  const setupNode = (node: FlowchartNode) => {
    if (node.links?.length) {
      node.links.forEach((link) => connectNodes(link, node))
    }

    node.childrens?.forEach((children) => {
      if (children.type === 'decision') {
        setupNode(children)
      } else {
        children.links?.forEach((link) => connectNodes(link, children))
      }
    })
  }

  jsPlumb.value?.batch(() => {
    nodes.forEach((e) => setupNode(e))
  })
}

export const setupLayout = (
  nodes: FlowchartNode[],
  options: {
    layerHeight: number
    layerBaseline: number
    innerLayerBaselineLeft: number
    innerLayerBaselineRight: number
    spacingX: number
  }
) => {
  let currentLayer = -1

  function setupChildrens(node: FlowchartNode) {
    const [, nodeX] = node.position

    if (node.childrens?.every((children) => !children.childrens)) {
      currentLayer += 1

      const leftChilds = node.childrens?.filter((e) => e.when === true)
      const rightChilds = node.childrens?.filter((e) => e.when === false)

      leftChilds.forEach((children, index) => {
        const nodeOffset = nodeX - 200 // width of process block
        const spaceX = index * options.spacingX
        const widthOffset = index * 200

        const childY = currentLayer * options.layerHeight
        const childX = nodeOffset - spaceX - widthOffset
        children.position = [childY, childX]
      })

      rightChilds.forEach((children, index) => {
        const nodeOffset = nodeX + 280 // width of decision
        const spaceX = index * options.spacingX
        const widthOffset = index * 200

        const childY = currentLayer * options.layerHeight
        const childX = nodeOffset - spaceX - widthOffset
        children.position = [childY, childX]
      })

      return
    }

    node.childrens
      ?.filter((e) => e.type === 'decision')
      .forEach((e) => {
        setupNode(e, true)
      })

    const lastDecision = node.childrens
      ?.filter((e) => e.type === 'decision')
      .reverse()[0]

    let lastDecisionBorder: number
    if (lastDecision && lastDecision.childrens) {
      lastDecisionBorder = Math.max(
        ...lastDecision.childrens?.map((e) => e.position[1])
      )
    }

    node.childrens
      ?.filter((e) => e.type === 'process')
      .forEach((e, index) => {
        if (lastDecisionBorder) {
          const elementOffset = 200 + options.spacingX + 60
          e.position = [
            currentLayer * options.layerHeight,
            index * 200 +
              index * options.spacingX +
              lastDecisionBorder +
              elementOffset,
          ]
        } else {
          e.position = [
            currentLayer * options.layerHeight,
            index * 200 + nodeX + index * options.spacingX,
          ]
        }
      })
  }

  function setupNode(node: FlowchartNode, isInner: boolean) {
    if (node.type === 'decision') {
      currentLayer += 1

      const getNodeBaseline = (node: FlowchartNode) => {
        if (isInner) {
          return node.when
            ? options.innerLayerBaselineLeft
            : options.innerLayerBaselineRight
        }

        return options.layerBaseline
      }

      node.position = [
        currentLayer * options.layerHeight,
        getNodeBaseline(node),
      ]

      if (node.childrens) {
        setupChildrens(node)
      }
    }
  }

  nodes.forEach((node) => setupNode(node, false))
}

export const parseInstruction = (instruction: Instruction) => {
  const getNodeType = (type: 'option' | 'node') => {
    const typeMapper = {
      option: 'process',
      node: 'decision',
    }

    return typeMapper[type] as 'process' | 'decision'
  }

  const getNodeAnchors = (
    when: boolean | undefined
  ): [AnchorSpec, AnchorSpec] => {
    if (when === true) {
      return ['Left', 'Top']
    } else if (when === false) {
      return ['Right', 'Top']
    }

    // when === undefined
    return ['Bottom', 'Top']
  }

  const parseNode = (node: ECNode, parent?: FlowchartNodeParent) => {
    const nodeType = getNodeType(node.type)

    const flowchartNode: FlowchartNode = {
      id: node._id,
      text: node.title,
      type: nodeType,
      anchors: getNodeAnchors(node.when),
      position: [0, 0],
      when: node.when,
      parent,
    }

    if (node.options) {
      flowchartNode.childrens = node.options.map((children) => {
        return parseNode(children, {
          id: flowchartNode.id,
          when: flowchartNode.when,
        })
      })
    }

    return flowchartNode
  }

  return instruction.nodes.map((node) => {
    return parseNode(node as ECNode)
  })
}

export const setupInstructionLinks = (nodes: FlowchartNode[]) => {
  const getFlattenNodes = (nodes: FlowchartNode[]) => {
    const flattenNodes: FlowchartNode[] = []

    const flattenNode = (node: FlowchartNode) => {
      flattenNodes.push(node)
      const order = ['process', 'decision']

      node.childrens
        ?.sort((a, b) => order.indexOf(b.type) - order.indexOf(a.type))
        .forEach((children) => {
          if (children.type === 'decision') {
            flattenNode(children)
          } else {
            flattenNodes.push(children)
          }
        })
    }

    nodes.forEach((node) => flattenNode(node))

    return flattenNodes
  }

  const flattenNodes = getFlattenNodes(nodes)

  let lastDecision: any = null
  let lastProcesses: any = []

  flattenNodes.forEach((node) => {
    if (node.type === 'decision') {
      if (lastDecision === null) {
        lastDecision = node.id
      } else if (lastDecision !== node.id) {
        if (lastProcesses.length) {
          node.links = lastProcesses
          lastProcesses = []
          lastDecision = node.id
          node.anchors = ['Bottom', 'Top']
        } else {
          node.links = [lastDecision]
          lastDecision = node.id
        }
      }
    } else if (node.type === 'process') {
      lastProcesses.push(node.id)

      // there parent id is always string
      // as we linking process that always has parent decision
      node.links = [node.parent?.id as string]
    }
  })

  return nodes
}
