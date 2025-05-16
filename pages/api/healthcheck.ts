import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ message: 'Supabase query failed', error: error.message });
    }

    console.log(data);

    return res.status(200).json({ message: 'Supabase connection successful', data });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
}