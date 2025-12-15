/**
 * Execute Workflow API
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/middleware/auth'
import { workflowEngine } from '@/lib/automation/workflows'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const context = await request.json().catch(() => ({}))

    const success = await workflowEngine.executeWorkflow(id, context)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to execute workflow' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow executed successfully',
    })
  } catch (error) {
    console.error('Error executing workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

