import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid voting ID' })
  }

  switch (req.method) {
    case 'GET':
      return getVoting(req, res, id)
    case 'PUT':
      return updateVoting(req, res, id)
    case 'DELETE':
      return deleteVoting(req, res, id)
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function getVoting(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { data, error } = await supabase
      .from('Voting')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase query error:', error)
      return res.status(500).json({ message: 'Failed to fetch voting', error: error.message })
    }

    if (!data) {
      return res.status(404).json({ message: 'Voting not found' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ message: 'Server error', error: (err as Error).message })
  }
}

async function updateVoting(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { title, description, options } = req.body

    // Validate required fields
    if (!title || !description || !options) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const { data, error } = await supabase
      .from('Voting')
      .update({
        title,
        description,
        options
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return res.status(500).json({ message: 'Failed to update voting', error: error.message })
    }

    if (!data) {
      return res.status(404).json({ message: 'Voting not found' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ message: 'Server error', error: (err as Error).message })
  }
}

async function deleteVoting(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { error } = await supabase
      .from('Voting')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return res.status(500).json({ message: 'Failed to delete voting', error: error.message })
    }

    return res.status(204).end()
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ message: 'Server error', error: (err as Error).message })
  }
} 