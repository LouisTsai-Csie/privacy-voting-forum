import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { wallet_address } = req.query;

  if (!wallet_address || typeof wallet_address !== 'string') {
    return res.status(400).json({ 
      message: 'Invalid or missing wallet address parameter',
      required: 'wallet_address query parameter'
    });
  }

  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('wallet_address', wallet_address)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ 
        message: 'Error fetching user data', 
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
      message: 'User found',
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
