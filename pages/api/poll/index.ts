import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getVotings(req, res)
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function getVotings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from('Poll')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase query error:', error)
      return res.status(500).json({ message: 'Failed to fetch votings', error: error.message })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ message: 'Server error', error: (err as Error).message })
  }
}