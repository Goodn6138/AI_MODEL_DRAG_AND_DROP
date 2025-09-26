import React from 'react'


const PALETTE = [
{ type: 'Transformer', label: 'Transformer Block' },
{ type: 'VAE_Decoder', label: 'VAE Decoder' },
{ type: 'Linear', label: 'Linear Layer' },
{ type: 'ReLU', label: 'ReLU Activation' },
{ type: 'Conv2d', label: 'Conv2d' }
]


export default function Sidebar({ onAddNode }) {
// For React Flow drag-and-drop we will create plain dataTransfer drag events
function handleDragStart(e, nodeType) {
e.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType }))
e.dataTransfer.effectAllowed = 'move'
}


return (
<aside className="sidebar">
<h3>Blocks</h3>
{PALETTE.map((b) => (
<div
key={b.type}
className="block"
draggable
onDragStart={(e) => handleDragStart(e, b.type)}
>
{b.label}
</div>
))}


<hr />
<p style={{ fontSize: 12, opacity: 0.8 }}>
Drag blocks into the canvas. Click a node to edit params. Export JSON or generate PyTorch code.
</p>
</aside>
)
}
