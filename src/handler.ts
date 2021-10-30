import { createClient } from '@supabase/supabase-js'
declare const SUPABASE_KEY: string

const SUPABASE_URL = 'https://rntidcyilmxescqtmwww.supabase.co'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function getPollWithKey(key: string): Promise<Response> {
  const { body, error } = await supabase
    .from('poll')
    .select()
    .eq('key', key)
    .limit(1)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    })
  }

  if (body && !body.length) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
    })
  }

  const responseOptions = {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    status: 200,
  }

  const result = body && body[0]

  return new Response(JSON.stringify(result), responseOptions)
}
export async function createPoll(request: Request): Promise<Response> {
  // console.log(await request.json())
  // const name = 'test',
  //   start_at = new Date().toUTCString(),
  //   end_at = new Date().toUTCString(),
  //   key = '1234'

  // try {
  //   const { body, error } = await supabase
  //     .from('poll')
  //     .insert([{ name, start_at, end_at, key }])
  //   console.log({ body, err: JSON.stringify(error) })
  // } catch (error) {
  //   console.log('error', error)
  // }

  return new Response(`request method: ${request.method}`)
}
