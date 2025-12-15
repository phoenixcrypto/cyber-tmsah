/**
 * Automation & Workflows System
 */

import { getFirestoreDB } from '@/lib/db/firebase'
import { doAction } from '@/lib/theme/hooks'

export interface WorkflowStep {
  id: string
  type: 'action' | 'condition' | 'delay' | 'webhook'
  config: Record<string, any>
  next?: string[]
}

export interface Workflow {
  id: string
  name: string
  description?: string
  trigger: {
    type: 'event' | 'schedule' | 'manual'
    config: Record<string, any>
  }
  steps: WorkflowStep[]
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map()

  /**
   * Register a workflow
   */
  async registerWorkflow(workflow: Workflow): Promise<boolean> {
    try {
      const db = getFirestoreDB()
      await db.collection('workflows').doc(workflow.id).set({
        ...workflow,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      this.workflows.set(workflow.id, workflow)
      return true
    } catch (error) {
      console.error('Error registering workflow:', error)
      return false
    }
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, context: Record<string, any> = {}): Promise<boolean> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow || !workflow.enabled) {
      return false
    }

    try {
      await this.executeSteps(workflow.steps, context, workflowId)
      return true
    } catch (error) {
      console.error('Error executing workflow:', error)
      return false
    }
  }

  /**
   * Execute workflow steps
   */
  private async executeSteps(
    steps: WorkflowStep[],
    context: Record<string, any>,
    _workflowId: string
  ): Promise<void> {
    const stepMap = new Map(steps.map((step) => [step.id, step]))
    const executed = new Set<string>()

    const executeStep = async (stepId: string): Promise<void> => {
      if (executed.has(stepId)) return

      const step = stepMap.get(stepId)
      if (!step) return

      executed.add(stepId)

      switch (step.type) {
        case 'action':
          await this.executeAction(step, context)
          break

        case 'condition':
          const result = await this.evaluateCondition(step, context)
          if (result && step.next) {
            for (const nextId of step.next) {
              await executeStep(nextId)
            }
          }
          break

        case 'delay':
          await this.executeDelay(step, context)
          break

        case 'webhook':
          await this.executeWebhook(step, context)
          break
      }

      // Execute next steps
      if (step.next) {
        for (const nextId of step.next) {
          await executeStep(nextId)
        }
      }
    }

    // Start from first step
    if (steps.length > 0 && steps[0]) {
      await executeStep(steps[0].id)
    }
  }

  /**
   * Execute action step
   */
  private async executeAction(step: WorkflowStep, context: Record<string, any>): Promise<void> {
    const { action, params } = step.config

    switch (action) {
      case 'send_email':
        // Send email
        await this.sendEmail(params, context)
        break

      case 'create_content':
        // Create content
        await this.createContent(params, context)
        break

      case 'update_content':
        // Update content
        await this.updateContent(params, context)
        break

      case 'trigger_hook':
        // Trigger hook
        await doAction(params.hook, context)
        break

      default:
        console.warn(`Unknown action: ${action}`)
    }
  }

  /**
   * Evaluate condition step
   */
  private async evaluateCondition(
    step: WorkflowStep,
    context: Record<string, any>
  ): Promise<boolean> {
    const { field, operator, value } = step.config

    const fieldValue = this.getNestedValue(context, field)

    switch (operator) {
      case 'equals':
        return fieldValue === value
      case 'not_equals':
        return fieldValue !== value
      case 'greater_than':
        return fieldValue > value
      case 'less_than':
        return fieldValue < value
      case 'contains':
        return String(fieldValue).includes(String(value))
      default:
        return false
    }
  }

  /**
   * Execute delay step
   */
  private async executeDelay(step: WorkflowStep, _context: Record<string, any>): Promise<void> {
    const { duration } = step.config // in milliseconds
    await new Promise((resolve) => setTimeout(resolve, duration))
  }

  /**
   * Execute webhook step
   */
  private async executeWebhook(step: WorkflowStep, context: Record<string, any>): Promise<void> {
    const { url, method = 'POST', headers = {}, body } = step.config

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ ...body, context }),
    })
  }

  /**
   * Helper: Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  /**
   * Helper: Send email
   */
  private async sendEmail(params: any, context: Record<string, any>): Promise<void> {
    // Implement email sending
    console.log('Sending email:', params, context)
  }

  /**
   * Helper: Create content
   */
  private async createContent(params: any, context: Record<string, any>): Promise<void> {
    // Implement content creation
    console.log('Creating content:', params, context)
  }

  /**
   * Helper: Update content
   */
  private async updateContent(params: any, context: Record<string, any>): Promise<void> {
    // Implement content update
    console.log('Updating content:', params, context)
  }

  /**
   * Load workflows from database
   */
  async loadWorkflows(): Promise<void> {
    try {
      const db = getFirestoreDB()
      const snapshot = await db.collection('workflows').get()
      snapshot.docs.forEach((doc) => {
        this.workflows.set(doc.id, doc.data() as Workflow)
      })
    } catch (error) {
      console.error('Error loading workflows:', error)
    }
  }
}

// Singleton instance
export const workflowEngine = new WorkflowEngine()

// Initialize workflows on startup
if (typeof window === 'undefined') {
  workflowEngine.loadWorkflows()
}

/**
 * Common workflow templates
 */
export const WORKFLOW_TEMPLATES = {
  AUTO_PUBLISH: {
    name: 'Auto Publish',
    description: 'Automatically publish content at scheduled time',
    trigger: {
      type: 'schedule',
      config: { cron: '0 9 * * *' }, // 9 AM daily
    },
    steps: [
      {
        id: 'check_scheduled',
        type: 'condition',
        config: {
          field: 'content.scheduled',
          operator: 'equals',
          value: true,
        },
        next: ['publish_content'],
      },
      {
        id: 'publish_content',
        type: 'action',
        config: {
          action: 'update_content',
          params: { status: 'published' },
        },
      },
    ],
  },
} as const

