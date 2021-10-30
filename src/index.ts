import { getPollWithKey, createPoll, upvote } from './handler'

addEventListener('fetch', (event) => {
  const { pathname } = new URL(event.request.url)

  // preflight
  console.log(event.request.method)

  if (event.request.method == 'OPTIONS') {
    console.log('preflight', pathname)

    return event.respondWith(
      new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type, Authorization, Access-Control-Allow-Origin',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
      }),
    )
  }

  if (event.request.method === 'POST' && pathname === '/polls') {
    return event.respondWith(createPoll(event.request))
  } else if (
    event.request.method === 'POST' &&
    pathname.startsWith('/polls') &&
    pathname.endsWith('/pop')
  ) {
    const key = pathname.split('/', 4)[2]
    return event.respondWith(upvote(key, event.request))
  } else if (event.request.method === 'GET' && pathname.startsWith('/polls')) {
    const key = pathname.split('/', 3)[2]
    return event.respondWith(getPollWithKey(key))
  } else {
    return event.respondWith(
      new Response(JSON.stringify({ error: 'Not found' }), {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
        status: 400,
      }),
    )
  }
})
