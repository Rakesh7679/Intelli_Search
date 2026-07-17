import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'


const Dashboard = () => {
  const chat = useChat()
  const { initializeSocketConnection, handleGetChats, handleSendMessage, handleOpenChat, handleNewChat } = chat
  const [ chatInput, setChatInput ] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const currentChat = currentChatId ? chats[currentChatId] : null

  useEffect(() => {
    initializeSocketConnection()
    handleGetChats()
  }, [initializeSocketConnection, handleGetChats])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    handleOpenChat(chatId,chats)
  }

  const createChat = () => {
    handleNewChat()
    setChatInput('')
  }

  return (
    <main className='min-h-screen w-full bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_35%),linear-gradient(180deg,#05070d_0%,#07090f_100%)] p-3 text-white md:p-5'>
      <section className='mx-auto flex h-[calc(100vh-1.5rem)] w-full max-w-[1600px] overflow-hidden rounded-[28px] bg-[#05070d]/95 shadow-2xl shadow-black/40 md:h-[calc(100vh-2.5rem)]'>
        <aside className='hidden h-full w-80 shrink-0 bg-[#070a11] p-4 md:flex md:flex-col md:shadow-[inset_-1px_0_0_rgba(255,255,255,0.06)]'>
          <div className='mb-5'>
            <h1 className='text-3xl font-semibold tracking-tight'>IntelliSearch</h1>
            <p className='mt-1 text-sm text-white/45'>Your workspace for focused chat</p>
          </div>

          <button
            type='button'
            onClick={createChat}
            className='mb-4 cursor-pointer rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-[#080b12] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white/90'
          >
            New Chat
          </button>

          <div className='space-y-2 overflow-y-auto pr-1'>
            {Object.values(chats).map((chat) => {
              const chatId = chat._id || chat.id
              const isActive = currentChatId === chatId

              return (
                <button
                  onClick={()=>{openChat(chatId)}}
                  key={chatId}
                  type='button'
                  className={`w-full cursor-pointer rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${isActive
                      ? 'bg-white text-[#080b12] shadow-lg shadow-black/20'
                      : 'bg-transparent text-white/85 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {chat.title}
                </button>
              )
            })}
          </div>
        </aside>

        <section className='flex h-full min-w-0 flex-1 flex-col bg-[#07090f]'>
          <header className='flex items-center justify-between px-4 py-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)] md:px-8'>
            <div>
              <p className='text-xs uppercase tracking-[0.22em] text-white/35'>Conversation</p>
              <h2 className='mt-1 text-lg font-semibold text-white md:text-xl'>{currentChat?.title || 'New chat'}</h2>
            </div>

            <div className='hidden items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] md:flex'>
              <span className='h-2 w-2 rounded-full bg-emerald-400' />
              Ready
            </div>
          </header>

          <div className='messages flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8'>
            {currentChat?.messages?.length ? (
              <div className='space-y-4'>
                {currentChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`w-fit max-w-[min(760px,85%)] rounded-3xl px-4 py-3 text-sm leading-relaxed md:px-5 md:py-4 md:text-[15px] ${message.role === 'user'
                        ? 'ml-auto rounded-br-md bg-white/10 text-white shadow-lg shadow-black/10'
                        : 'mr-auto rounded-bl-md bg-white/5 text-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                      }`}
                  >
                    {message.role === 'user' ? (
                      <p>{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                          ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                          ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                          code: ({ children }) => <code className='rounded bg-white/10 px-1 py-0.5'>{children}</code>,
                          pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/30 p-3'>{children}</pre>
                        }}
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[28px] bg-white/3 px-6 py-16 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'>
                <p className='text-xs uppercase tracking-[0.24em] text-white/35'>Start here</p>
                <h3 className='mt-3 text-2xl font-semibold text-white'>Ask something, or open a previous chat</h3>
                <p className='mt-3 max-w-lg text-sm leading-6 text-white/55'>Use the sidebar to start a fresh conversation, then send a message below. Replies will appear here in a clean, readable thread.</p>
              </div>
            )}
          </div>

          <footer className='relative z-20 bg-[#07090f]/80 px-4 pb-4 pt-6 backdrop-blur-2xl shadow-[0_-18px_40px_rgba(0,0,0,0.45)] md:px-8 md:pb-5 md:pt-7'>
            <div className='pointer-events-none absolute left-0 right-0 -top-6 h-6 bg-linear-to-t from-[#07090f] to-transparent' />
            <form onSubmit={handleSubmitMessage} className='mx-auto flex w-full max-w-4xl flex-col gap-2.5 rounded-[26px] bg-white/5 p-2.5 shadow-2xl shadow-black/20 md:flex-row md:items-center md:p-3'>
              <input
                type='text'
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder='Type your message...'
                className='w-full rounded-2xl bg-transparent px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-white/40 focus:bg-white/5 md:text-base'
              />
              <button
                type='submit'
                disabled={!chatInput.trim()}
                className='rounded-2xl bg-white px-6 py-2.5 text-sm font-semibold text-[#080b12] transition hover:-translate-y-0.5 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 md:text-base'
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard
