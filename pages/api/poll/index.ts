import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getVotings(req, res)
    case 'POST':
      return createVoting(req, res)
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function getVotings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from('Voting')
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

async function createVoting(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, description, options, creator } = req.body

    // Validate required fields
    if (!title || !description || !options || !creator) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const { data, error } = await supabase
      .from('Voting')
      .insert([
        {
          title,
          description,
          options,
          creator
        }
      ])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ message: 'Failed to create voting', error: error.message })
    }

    return res.status(201).json(data[0])
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ message: 'Server error', error: (err as Error).message })
  }
} 