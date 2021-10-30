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
    return response({ error: error.message }, 400)
  }

  if (body && !body.length) {
    return response({ error: 'Not Found' }, 404)
  }

  const result = body && body[0]

  return response(result, 200)
}
export async function createPoll(request: Request): Promise<Response> {
  const data = await request.json()

  const { name, start_at, end_at, key } = data as any

  if (!name || !start_at || !end_at || !key) {
    return response({ error: 'Invalid input' }, 400)
  }

  try {
    const { body, error } = await supabase
      .from('poll')
      .insert([{ name, start_at, end_at, key }])

    if (error) {
      return response({ error: error.message }, 400)
    }

    const result = body && body[0]

    return response(result, 201)
  } catch (error) {
    return response({ error: (error as Error).message }, 400)
  }
}

function response(body: Record<string, any>, status: number) {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    status,
  })
}
