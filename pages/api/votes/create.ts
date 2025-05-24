import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { votes, wallet_address } = req.body
    if (typeof wallet_address !== 'string' || !wallet_address.trim()) {
      return res.status(400).json({ message: 'Missing or invalid wallet_address' })
    }
    const votesValue = typeof votes === 'number' ? votes : 0

    const { data, error } = await supabase
      .from('Votes')
      .insert([{ votes: votesValue, wallet_address }])
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error creating vote', error: error.message })
    }

    return res.status(201).json({ message: 'Vote created successfully', data })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message })
  }
}
