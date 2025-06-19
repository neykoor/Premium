import { performance } from 'perf_hooks'

const handler = async (m, { conn }) => {
  const start = performance.now()

  const uptime = process.uptime()
  const memory = process.memoryUsage().heapUsed / 1024 / 1024
  const end = performance.now()
  const ping = (end - start).toFixed(2)

  // Estado de conexión
  const connectionStatus = conn?.ws?.readyState === 1 ? '🟢 Conectado (OPEN)' :
                          conn?.ws?.readyState === 0 ? '🟡 Conectando...' :
                          conn?.ws?.readyState === 2 ? '🟠 Cerrando conexión...' :
                          '🔴 Desconectado (CLOSED)'

  // Última desconexión si la hay
  const lastDisconnect = conn?.ws?.lastDisconnect?.error?.message || 'Ninguna'
  const isReconnectActive = !!conn?.ws?.reconnectIntervalMs
  const pendingRequests = conn?.ws?.pendingRequests?.size || 0

  const status = `
╭─⬣ *📡 Diagnóstico del Bot*
┃🔌 *Estado de conexión:* ${connectionStatus}
┃🔁 *¿Reconexión activa?:* ${isReconnectActive ? '🟠 Sí' : '✅ No'}
┃📤 *Mensajes pendientes:* ${pendingRequests}
┃⏱️ *Tiempo activo:* ${Math.floor(uptime)} segundos
┃📶 *Ping:* ${ping} ms
┃🧠 *Memoria usada:* ${memory.toFixed(2)} MB
┃⚠ *Último error:* ${lastDisconnect}
╰───────────────⬣
`.trim()

  await m.reply(status)
}

handler.help = ['baileys', 'estado', 'conexion']
handler.tags = ['herramientas']
handler.command = ['baileys']
handler.register = true

export default handler
