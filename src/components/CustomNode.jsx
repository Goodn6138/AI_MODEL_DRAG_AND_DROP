import React from 'react'
import { Handle } from 'reactflow'


export default function CustomNode({ data }) {
return (
<div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.03)', minWidth: 140 }}>
<div style={{ fontWeight: '600' }}>{data.label}</div>
<div style={{ fontSize: 12, opacity: 0.8 }}>{data.meta?.summary || 'Model block'}</div>
<Handle type="target" position="left" style={{ background: '#555' }} />
<Handle type="source" position="right" style={{ background: '#555' }} />
</div>
)
}
