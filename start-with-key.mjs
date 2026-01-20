import { spawn } from 'child_process'

const API_KEY = process.env.OPENAI_API_KEY

console.log('Starting with OpenAI API key from env...')
console.log('OPENAI_API_KEY set:', API_KEY ? 'YES' : 'NO')

const server = spawn('node', ['server/src/index.js'], {
  env: {
    ...process.env,
    PORT: '3000',
    ADMIN_PASSWORD: 'demo-password',
    OPENAI_API_KEY: API_KEY,
    NODE_ENV: 'development'
  },
  stdio: 'inherit'
})

const client = spawn('npx', ['vite', '--port', '5175'], {
  cwd: './client',
  stdio: 'inherit',
  shell: true
})

process.on('SIGINT', () => {
  server.kill()
  client.kill()
  process.exit()
})

server.on('error', (e) => console.error('Server error:', e))
client.on('error', (e) => console.error('Client error:', e))
