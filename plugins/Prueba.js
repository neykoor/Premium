import { performance } from 'perf_hooks'

const handler = async (m, { conn }) => {
  const start = performance.now()

  const uptime = process.uptime()
  const memory = process.memoryUsage().heapUsed / 1024 / 1024
  const end = performance.now()
  const ping = (end - start).toFixed(2)

  // Verifica si el usuario (bot) está conectado
  const isLoggedIn = !!conn?.user?.id
  const connectionStatus = isLoggedIn
    ? '🟢 Conectado'
    : '🔴 Desconectado'

  const readyState = conn?.ws?.readyState
  let stateReadable = 'Desconocido'
  switch (readyState) {
    case 0: stateReadable = '🟡 Conectando...'; break
    case 1: stateReadable = '🟢 Abierto'; break
    case 2: stateReadable = '🟠 Cerrando'; break
    case 3: stateReadable = '🔴 Cerrado'; break
  }

  const reconnecting = !!conn?.ws?.reconnectIntervalMs
  const pendingRequests = conn?.ws?.pendingRequests?.size || 0
  const lastDisconnect = conn?.ws?.lastDisconnect?.error?.message || 'Ninguno'

  const status = `
╭─⬣ *📡 Diagnóstico del Bot*
┃🔌 *Estado de sesión:* ${connectionStatus}
┃🌐 *Socket:* ${stateReadable}
┃🔁 *¿Reconexión activa?:* ${reconnecting ? '🟠 Sí' : '✅ No'}
┃📤 *Mensajes pendientes:* ${pendingRequests}
┃🧠 *Memoria usada:* ${memory.toFixed(2)} MB
┃⏱️ *Uptime:* ${Math.floor(uptime)}s
┃📶 *Ping:* ${ping} ms
┃⚠️ *Último error:* ${lastDisconnect}
╰───────────────⬣
`.trim()

  await m.reply(status)
}

handler.help = ['baileys', 'estado', 'conexion']
handler.tags = ['herramientas']
handler.command = ['baileys']
handler.register = true

export default handler
