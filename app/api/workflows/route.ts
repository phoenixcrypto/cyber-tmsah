/**
 * Workflows API
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/middleware/auth'
import { workflowEngine } from '@/lib/automation/workflows'
import type { Workflow } from '@/lib/automation/workflows'

// GET /api/workflows - Get all workflows
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Load workflows from database
    await workflowEngine.loadWorkflows()

    return NextResponse.json({
      success: true,
      data: Array.from((workflowEngine as any).workflows.values()),
    })
  } catch (error) {
    console.error('Error fetching workflows:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/workflows - Create workflow
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const workflow = await request.json() as Workflow
    const success = await workflowEngine.registerWorkflow(workflow)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create workflow' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow created successfully',
    })
  } catch (error) {
    console.error('Error creating workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

