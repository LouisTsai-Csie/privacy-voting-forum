import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabase } from '@/app/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing ID parameter' });
  }

  switch (method) {
    case 'GET': {
      try {
        const { data, error } = await supabase
          .from('User')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          return res.status(500).json({ message: 'Error fetching data', error: error.message });
        }

        if (!data) {
          return res.status(404).json({ message: 'Record not found' });
        }
        console.log(data);

        return res.status(200).json(data);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: (err as Error).message });
      }
    }

    case 'PUT': {
      try {
        const supabaseServer = createRouteHandlerClient({ cookies }); 
        const { data: { session } } = await supabaseServer.auth.getSession();

        if (!session) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        const body = req.body;

        const { data, error } = await supabase
          .from('User')
          .update(body)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          return res.status(500).json({ message: 'Error updating data', error: error.message });
        }

        if (!data) {
          return res.status(404).json({ message: 'Record not found' });
        }

        return res.status(200).json({ message: 'Updated', data });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: (err as Error).message });
      }
    }

    case 'DELETE': {
      try {
        const supabaseServer = createRouteHandlerClient({ cookies });
        const { data: { session } } = await supabaseServer.auth.getSession();

        if (!session) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        const { error } = await supabase
          .from('User')
          .delete()
          .eq('id', id);

        if (error) {
          return res.status(500).json({ message: 'Error deleting data', error: error.message });
        }

        return res.status(200).json({ message: 'Deleted' });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: (err as Error).message });
      }
    }

    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}