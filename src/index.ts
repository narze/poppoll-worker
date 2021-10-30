import { getPollWithKey, createPoll } from './handler'

addEventListener('fetch', (event) => {
  const { pathname } = new URL(event.request.url)

  if (event.request.method === 'POST' && pathname === '/polls') {
    return event.respondWith(createPoll(event.request))
  } else if (event.request.method === 'GET' && pathname.startsWith('/polls')) {
    const key = pathname.split('/', 3)[2]
    console.log('get poll with Key', key)
    return event.respondWith(getPollWithKey(key))
  } else {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 400,
    })
  }
})
