import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {

    const { wallet_address, self_verified } = req.body;

    // Validate required fields
    if (!wallet_address || typeof wallet_address !== 'string') {
      return res.status(400).json({ 
        message: 'Invalid or missing wallet address',
        required: 'wallet_address'
      });
    }

    if (typeof self_verified !== 'boolean') {
      return res.status(400).json({ 
        message: 'Invalid verification status',
        required: 'self_verified (boolean)'
      });
    }

    // Update the user's verification status
    const { data, error } = await supabase
      .from('User')
      .update({ self_verified })
      .eq('wallet_address', wallet_address)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ 
        message: 'Error updating verification status', 
        error: error.message 
      });
    }

    if (!data) {
      return res.status(404).json({ 
        message: 'User not found',
        wallet_address
      });
    }

    return res.status(200).json({
      message: 'Verification status updated successfully',
      data
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ 
      message: 'Server error', 
      error: (err as Error).message 
    });
  }
}
