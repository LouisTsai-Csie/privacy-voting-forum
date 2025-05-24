import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/app/lib/supabase';

interface PollOption {
  text: string;
  description?: string;
}

interface CreatePollBody {
  title: string;
  description: string;
  options: PollOption[];
  creator: string;
  end_date?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = req.body as CreatePollBody;

    // Validate required fields
    if (!body.title?.trim()) {
      return res.status(400).json({ 
        message: 'Invalid request',
        error: 'Title is required'
      });
    }

    if (!body.description?.trim()) {
      return res.status(400).json({ 
        message: 'Invalid request',
        error: 'Description is required'
      });
    }

    if (!Array.isArray(body.options) || body.options.length < 2) {
      return res.status(400).json({ 
        message: 'Invalid request',
        error: 'At least 2 options are required'
      });
    }

    if (!body.creator?.trim()) {
      return res.status(400).json({ 
        message: 'Invalid request',
        error: 'Creator ID is required'
      });
    }

    // Validate options
    const validOptions = body.options.every(option => 
      option && typeof option === 'object' && option.text?.trim()
    );

    if (!validOptions) {
      return res.status(400).json({ 
        message: 'Invalid request',
        error: 'Each option must have a non-empty text field'
      });
    }

    // Validate end date if provided
    if (body.end_date && !isValidDate(body.end_date)) {
      return res.status(400).json({ 
        message: 'Invalid request',
        error: 'Invalid end date format'
      });
    }

    // Check if creator exists
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('id', body.creator)
      .single();

    if (userError || !userData) {
      return res.status(400).json({ 
        message: 'Invalid request',
        error: 'Creator not found'
      });
    }

    // Create the poll
    const { data, error } = await supabase
      .from('Poll')
      .insert([{
        title: body.title.trim(),
        description: body.description.trim(),
        options: body.options,
        creator: body.creator,
        end_date: body.end_date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Default to 24 hours from now
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating poll:', error);
      return res.status(500).json({ 
        message: 'Failed to create poll',
        error: error.message 
      });
    }

    return res.status(201).json({
      message: 'Poll created successfully',
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

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
} 