import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing ID parameter' })
  }

  switch (req.method) {
    case 'GET':
      return getVote(req, res, id)
    case 'PUT':
      return updateVote(req, res, id)
    case 'DELETE':
      return deleteVote(req, res, id)
    default:
      return res.status(405).json({ message: 'Method Not Allowed' })
  }
}

async function getVote(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error fetching vote', error: error.message })
    }

    if (!data) {
      return res.status(404).json({ message: 'Vote not found' })
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message })
  }
}

async function updateVote(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { votes, wallet_address } = req.body
    const updateData: { votes?: number; wallet_address?: string } = {}
    if (typeof votes === 'number') updateData.votes = votes
    if (typeof wallet_address === 'string') updateData.wallet_address = wallet_address
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' })
    }
    const { data, error } = await supabase
      .from('votes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ message: 'Error updating vote', error: error.message })
    }

    if (!data) {
      return res.status(404).json({ message: 'Vote not found' })
    }

    return res.status(200).json({ message: 'Vote updated', data })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message })
  }
}

async function deleteVote(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ message: 'Error deleting vote', error: error.message })
    }

    return res.status(200).json({ message: 'Vote deleted' })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message })
  }
}
