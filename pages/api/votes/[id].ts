import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/app/lib/supabase';

const VALID_TYPES = ['approve', 'reject', 'invalid'] as const;
type VoteType = typeof VALID_TYPES[number];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid id parameter' });
  }

  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { type } = req.body;
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ message: 'Invalid vote type' });
  }

  // Increment the appropriate field
  const { data, error } = await supabase
    .from('votes')
    .update({ [type]: supabase.raw(`${type} + 1`) })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ message: 'Failed to update vote', error: error.message });
  }

  return res.status(200).json({ message: 'Vote updated', data });
}
