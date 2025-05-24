import type { NextApiRequest, NextApiResponse } from 'next'
import { SelfBackendVerifier, getUserIdentifier } from '@selfxyz/core'

const verifier = new SelfBackendVerifier(
  process.env.NEXT_PUBLIC_SELF_SCOPE as string,
  process.env.NEXT_PUBLIC_SELF_ENDPOINT as string
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const { proof, publicSignals } = req.body
  if (!proof || !publicSignals) {
    return res.status(400).json({ message: 'Proof and publicSignals are required' })
  }

  try {
    const result = await verifier.verify(proof, publicSignals)
    if (!result.isValid) {
      return res.status(400).json({ message: 'Self verification failed' })
    }

    const passportNumber = result.credentialSubject.passport_number
    if (typeof passportNumber !== 'string') {
      return res.status(500).json({ message: 'Missing passport_number in credentialSubject' })
    }

    return res.status(200).json({
      passport_id: passportNumber
    })
  } catch (err: any) {
    console.error('Self verify error', err)
    return res.status(500).json({ message: err.message || 'Internal server error' })
  }
}
