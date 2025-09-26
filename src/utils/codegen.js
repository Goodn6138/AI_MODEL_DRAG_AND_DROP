// Very small code generator that turns a nodes+edges graph into a PyTorch nn.Module string.
while (q.length) {
const u = q.shift()
res.push(u)
adj[u].forEach(v => { incoming[v]--; if (incoming[v] === 0) q.push(v) })
}
return res
}


export function generatePyTorch(nodes, edges) {
// Map nodes by id
const nodeMap = {}
nodes.forEach(n => nodeMap[n.id] = n)


const order = topoSort(nodes, edges)


// Build modules
const moduleLines = []
const forwardLines = []
let idx = 0
for (const id of order) {
const n = nodeMap[id]
const t = n.data.type || n.data.label || 'Block'
const varName = `m${idx}_${id.replace(/[^a-zA-Z0-9]/g,'')}`
idx++


if (/Transformer/i.test(t)) {
moduleLines.push(`${varName} = nn.Transformer(d_model=${n.data.params?.size || 512}, nhead=${n.data.params?.heads || 8})`)
forwardLines.push(`x = ${varName}(x)`)
} else if (/VAE/i.test(t)) {
moduleLines.push(`${varName} = nn.Linear(${n.data.params?.size || 512}, ${n.data.params?.size || 512}) # VAE decoder placeholder`)
forwardLines.push(`x = torch.relu(${varName}(x)) # VAE decoder placeholder`)
} else if (/Linear/i.test(t)) {
moduleLines.push(`${varName} = nn.Linear(${n.data.params?.in || n.data.params?.size || 512}, ${n.data.params?.out || 512})`)
forwardLines.push(`x = ${varName}(x)`)
} else if (/Conv2d/i.test(t)) {
moduleLines.push(`${varName} = nn.Conv2d(${n.data.params?.in_channels || 3}, ${n.data.params?.out_channels || 16}, kernel_size=${n.data.params?.kernel || 3}, padding=1)`)
forwardLines.push(`x = ${varName}(x)`)
} else if (/Relu/i.test(t) || /ReLU/i.test(t)) {
forwardLines.push(`x = torch.relu(x)`)
} else if (/Input/i.test(t)) {
forwardLines.push(`# input node`)
} else if (/Output/i.test(t)) {
forwardLines.push(`# output node`)
} else {
moduleLines.push(`${varName} = nn.Linear(${n.data.params?.size || 512}, ${n.data.params?.size || 512})`)
forwardLines.push(`x = ${varName}(x) # custom block`)
}
}


const code = `import torch\nimport torch.nn as nn\n\nclass GeneratedModel(nn.Module):\n def __init__(self):\n super().__init__()\n${moduleLines.map(l => ' self.' + l).join('\n')}\n\n def forward(self, x):\n${forwardLines.map(l => ' ' + l).join('\n')}\n return x\n\n# Example usage:\n# model = GeneratedModel()\n# x = torch.randn(1, 512)\n# y = model(x)\n`


return code
}
