/**
 * Collaboration Features - Comments System
 */

import { db } from '@/lib/db/firebase'

export interface Comment {
  id: string
  contentId: string
  contentType: 'article' | 'material' | 'page'
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  parentId?: string
  status: 'approved' | 'pending' | 'spam' | 'trash'
  likes: number
  dislikes: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Get comments for content
 */
export async function getComments(
  contentId: string,
  contentType: 'article' | 'material' | 'page',
  options?: {
    parentId?: string
    status?: 'approved' | 'pending' | 'spam' | 'trash'
    limit?: number
    offset?: number
  }
): Promise<Comment[]> {
  try {
    let query = db
      .collection('comments')
      .where('contentId', '==', contentId)
      .where('contentType', '==', contentType)

    if (options?.parentId !== undefined) {
      if (options.parentId) {
        query = query.where('parentId', '==', options.parentId)
      } else {
        query = query.where('parentId', '==', null)
      }
    }

    if (options?.status) {
      query = query.where('status', '==', options.status)
    } else {
      query = query.where('status', '==', 'approved')
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.offset(options.offset)
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get()
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Comment[]
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

/**
 * Create comment
 */
export async function createComment(
  contentId: string,
  contentType: 'article' | 'material' | 'page',
  authorId: string,
  authorName: string,
  content: string,
  parentId?: string
): Promise<Comment | null> {
  try {
    const commentData = {
      contentId,
      contentType,
      authorId,
      authorName,
      content,
      parentId: parentId || null,
      status: 'pending', // Require moderation
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await db.collection('comments').add(commentData)

    return {
      id: docRef.id,
      ...commentData,
    } as Comment
  } catch (error) {
    console.error('Error creating comment:', error)
    return null
  }
}

/**
 * Update comment
 */
export async function updateComment(
  commentId: string,
  updates: Partial<Comment>
): Promise<boolean> {
  try {
    await db.collection('comments').doc(commentId).update({
      ...updates,
      updatedAt: new Date(),
    })
    return true
  } catch (error) {
    console.error('Error updating comment:', error)
    return false
  }
}

/**
 * Delete comment
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    await db.collection('comments').doc(commentId).delete()
    return true
  } catch (error) {
    console.error('Error deleting comment:', error)
    return false
  }
}

/**
 * Like/Dislike comment
 */
export async function toggleCommentReaction(
  commentId: string,
  userId: string,
  reaction: 'like' | 'dislike'
): Promise<boolean> {
  try {
    const commentRef = db.collection('comments').doc(commentId)
    const commentDoc = await commentRef.get()

    if (!commentDoc.exists) {
      return false
    }

    const comment = commentDoc.data()
    const reactions = comment?.reactions || {}
    const userReaction = reactions[userId]

    let likes = comment?.likes || 0
    let dislikes = comment?.dislikes || 0

    if (userReaction === reaction) {
      // Remove reaction
      delete reactions[userId]
      if (reaction === 'like') likes--
      else dislikes--
    } else {
      // Add/Change reaction
      if (userReaction) {
        // Remove previous reaction
        if (userReaction === 'like') likes--
        else dislikes--
      }
      reactions[userId] = reaction
      if (reaction === 'like') likes++
      else dislikes++
    }

    await commentRef.update({
      reactions,
      likes,
      dislikes,
      updatedAt: new Date(),
    })

    return true
  } catch (error) {
    console.error('Error toggling comment reaction:', error)
    return false
  }
}

