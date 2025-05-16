import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const body = req.body

    // Validate required fields
    if (!body.wallet_address || !body.passport_id) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['wallet_address', 'passport_id']
      })
    }

    // Set default value for self_verified if not provided
    const userData = {
      wallet_address: body.wallet_address,
      passport_id: body.passport_id,
      self_verified: body.self_verified ?? false
    }

    const { data, error } = await supabase
      .from('User')
      .insert([userData])
      .select()
      .single()

    if (error) {
      return res.status(500).json({ 
        message: 'Error creating user', 
        error: error.message 
      })
    }

    return res.status(201).json({ 
      message: 'User created successfully', 
      data 
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ 
      message: 'Server error', 
      error: (err as Error).message 
    })
  }
}
