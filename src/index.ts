import { getPollWithKey, createPoll } from './handler'

addEventListener('fetch', (event) => {
  const { pathname } = new URL(event.request.url)
  // console.log(pathname)

  if (event.request.method === 'POST' && pathname === '/polls') {
    console.log('create new poll')
  } else if (event.request.method === 'GET' && pathname.startsWith('/polls')) {
    const key = pathname.split('/', 3)[2]
    console.log('get poll with Key', key)
    event.respondWith(getPollWithKey(key))
  } else {
    console.log('404')
  }
  // event.respondWith(createPoll(event.request))
})
