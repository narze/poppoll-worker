declare const SUPABASE_KEY: string

import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'
import { DateTime } from 'luxon'

const SUPABASE_URL = 'https://rntidcyilmxescqtmwww.supabase.co'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function getPollWithKey(key: string): Promise<Response> {
  const { body, error } = await supabase
    .from('poll')
    .select(
      `
       key,
       name,
       start_at,
       end_at,
       poll_option (
         id,
         name,
         count
       )
    `,
    )
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

  const { name, start_at, end_at } = data as any

  if (!name || !start_at || !end_at) {
    return response({ error: 'Invalid input' }, 400)
  }

  const startAt = DateTime.fromISO(start_at)
  const endAt = DateTime.fromISO(end_at)
  if(!endAt.isValid || !startAt.isValid){
    return response({ error: 'Invalid date format for start and end' }, 400)
  }

  if(endAt.diff(startAt, 'hours') > 24){
    return response({ error: 'Invalid start/end setting. Poll cannot be longer than 24h' }, 400)
  }

  const key = nanoid()

  try {
    const { body, error } = await supabase
      .from('poll')
      .insert([{ name, start_at, end_at, key }])

    if (error) {
      return response({ error: error.message }, 400)
    }

    const result = body && body[0]

    const { options } = data as any

    const { data: optiondata, error: optionerror } = await supabase
      .from('poll_option')
      .insert(
        options.map((option: any) => ({ ...option, poll_key: result.key })),
      )

    if (optionerror) {
      return response({ error: optionerror.message }, 400)
    }

    result.options = optiondata

    return response(result, 201)
  } catch (error) {
    return response({ error: (error as Error).message }, 400)
  }
}

// create or replace function upvote(key text, option_id int, increment_count int)
// returns void as
// $$
//   update poll_option
//   set count = count + increment_count
//   where poll_key = key AND id = option_id
// $$
// language sql volatile;
export async function upvote(key: string, request: Request): Promise<Response> {
  const data = await request.json()
  console.log('upvote data', JSON.stringify(data))
  const { data: options } = data as any

  await Promise.all(
    options.map(async (option: any) => {
      const { id, name, count } = option
      if (!name || !count) {
        return response({ error: 'Invalid input' }, 400)
      }

      const { data: upvoteData, error: upvoteError } = await supabase.rpc(
        'upvote',
        {
          key,
          option_id: id,
          increment_count: count,
        },
      )
      console.log({ upvoteError, upvoteData })
    }),
  )

  try {
    const { body, error } = await supabase
      .from('poll')
      .select(
        `
        key,
        name,
        start_at,
        end_at,
        poll_option (
          id,
          name,
          count
        )
      `,
      )
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
  } catch (error) {
    return response({ error: (error as Error).message }, 400)
  }
}

function response(body: Record<string, any>, status: number) {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
    status,
  })
}
