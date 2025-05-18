import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabase } from '@/app/lib/supabase'

// Define the type for allowed update fields
type UserUpdateFields = {
  wallet_address?: string;
  passport_id?: string;
  self_verified?: boolean;
}

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

        // Validate required fields if they are being updated
        if (body.wallet_address === '' || body.passport_id === '') {
          return res.status(400).json({ 
            message: 'Invalid field values',
            error: 'wallet_address and passport_id cannot be empty'
          });
        }

        // Only allow updating specific fields
        const allowedUpdates: UserUpdateFields = {
          wallet_address: body.wallet_address,
          passport_id: body.passport_id,
          self_verified: body.self_verified
        };

        // Remove undefined fields
        (Object.keys(allowedUpdates) as Array<keyof UserUpdateFields>).forEach(key => {
          if (allowedUpdates[key] === undefined) {
            delete allowedUpdates[key];
          }
        });

        const { data, error } = await supabase
          .from('User')
          .update(allowedUpdates)
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