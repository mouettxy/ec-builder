import { Ref } from '@vue/reactivity'
import { AnchorSpec } from '@jsplumb/common'
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui'
import { FlowchartConnector } from '@jsplumb/connector-flowchart'

export type FlowchartNodeType = 'process' | 'decision'

export type FlowchartNodeParent = { id: string; when?: boolean }

export type FlowchartNode = {
  id: string
  text: string
  position: [number, number]
  type: FlowchartNodeType
  parent?: FlowchartNodeParent
  anchors?: [AnchorSpec, AnchorSpec]
  links?: string[]
  when?: boolean
  childrens?: FlowchartNode[]
}

export type JSPlumbRef = Ref<BrowserJsPlumbInstance | null>

export { AnchorSpec, FlowchartConnector }
