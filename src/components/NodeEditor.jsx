import React from 'react'


export default function NodeEditor({ node, onChange }) {
if (!node) return <div style={{ padding: 12 }}>Select a node to edit parameters</div>


const params = node.data.params || {}


function setParam(k, v) {
const next = { ...params, [k]: v }
onChange({ ...node, data: { ...node.data, params: next } })
}


return (
<div style={{ padding: 12 }}>
<h4>{node.data.label}</h4>
<div style={{ marginTop: 8 }}>
<label>Size</label>
<input value={params.size || ''} onChange={(e) => setParam('size', e.target.value)} />
</div>
<div style={{ marginTop: 8 }}>
<label>Heads</label>
<input value={params.heads || ''} onChange={(e) => setParam('heads', e.target.value)} />
</div>
</div>
)
}
