import React, { useCallback, useState, useRef } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  removeElements
} from 'reactflow'
import 'reactflow/dist/style.css'
import Sidebar from './components/Sidebar'
import CustomNode from './components/CustomNode'
import NodeEditor from './components/NodeEditor'
import { generatePyTorch } from './utils/codegen'

const nodeTypes = { custom: CustomNode }

export default function App() {
  const reactFlowWrapper = useRef(null)
  const [rfInstance, setRfInstance] = useState(null)
  const [elements, setElements] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)

  const onConnect = useCallback(
    (params) => setElements((els) => addEdge(params, els)),
    []
  )

  // Handle drop
  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const data = event.dataTransfer.getData('application/reactflow')
      if (!data) return

      const parsed = JSON.parse(data)
      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top
      })
      const id = `${parsed.type}_${+new Date()}`
      const node = {
        id,
        position,
        data: { label: parsed.type, type: parsed.type, params: {} },
        type: 'custom'
      }
      setElements((es) => es.concat(node))
    },
    [rfInstance]
  )

  const onDragOver = (event) => event.preventDefault()

  function onElementClick(event, element) {
    if (element && element.id && !element.source) {
      setSelectedNode(element)
    } else {
      setSelectedNode(null)
    }
  }

  function updateNode(next) {
    setElements((els) => els.map((e) => (e.id === next.id ? next : e)))
    setSelectedNode(next)
  }

  function onElementsRemove(elementsToRemove) {
    setElements((els) => removeElements(elementsToRemove, els))
    setSelectedNode(null)
  }

  function exportArchitecture() {
    if (!rfInstance) return
    const flow = rfInstance.toObject()
    const pytorchCode = generatePyTorch(flow)
    console.log('Exported Flow:', flow)
    console.log('Generated PyTorch Code:\n', pytorchCode)
    alert('Check console for exported PyTorch code!')
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          ref={reactFlowWrapper}
          style={{ flexGrow: 1 }}
        >
          <ReactFlow
            elements={elements}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onElementClick={onElementClick}
            onLoad={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            deleteKeyCode={46} // 'delete'-key
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <Sidebar />
        {selectedNode && (
          <NodeEditor node={selectedNode} onUpdate={updateNode} />
        )}
        <button
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            padding: '8px 12px'
          }}
          onClick={exportArchitecture}
        >
          Export PyTorch
        </button>
      </ReactFlowProvider>
    </div>
  )
}

