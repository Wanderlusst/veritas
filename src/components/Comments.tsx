'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';


interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  replies?: Comment[];
  reactions?: {
    upvote: string[];
    love: string[];
    laugh: string[];
    wow: string[];
    sad: string[];
    angry: string[];
  };
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reacting, setReacting] = useState<string | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    const commentContent = newComment.trim();
    const tempComment = {
      _id: `temp-${Date.now()}`,
      content: commentContent,
      author: {
        _id: session?.user?.email || '',
        name: session?.user?.name || 'You'
      },
      createdAt: new Date().toISOString(),
      replies: [],
      reactions: {
        upvote: [],
        love: [],
        laugh: [],
        wow: [],
        sad: [],
        angry: []
      }
    };

    // Optimistically add comment to UI
    setComments(prev => [tempComment, ...prev]);
    setNewComment('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (response.ok) {
        const data = await response.json();
        // Replace temp comment with real one
        setComments(prev => prev.map(comment => 
          comment._id === tempComment._id ? data.comment : comment
        ));
      } else {
        // Remove temp comment if failed
        setComments(prev => prev.filter(comment => comment._id !== tempComment._id));
        // Restore the comment text
        setNewComment(commentContent);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Remove temp comment if failed
      setComments(prev => prev.filter(comment => comment._id !== tempComment._id));
      // Restore the comment text
      setNewComment(commentContent);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit reply
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyTo || isSubmitting) return;

    const replyContentText = replyContent.trim();
    const tempReply = {
      _id: `temp-reply-${Date.now()}`,
      content: replyContentText,
      author: {
        _id: session?.user?.email || '',
        name: session?.user?.name || 'You'
      },
      createdAt: new Date().toISOString(),
      replies: [],
      reactions: {
        upvote: [],
        love: [],
        laugh: [],
        wow: [],
        sad: [],
        angry: []
      }
    };

    // Optimistically add reply to UI
    setComments(prev => prev.map(comment => 
      comment._id === replyTo 
        ? { ...comment, replies: [...(comment.replies || []), tempReply] }
        : comment
    ));

    setReplyContent('');
    setReplyTo(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: replyContentText,
          parentComment: replyTo 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Replace temp reply with real one
        setComments(prev => prev.map(comment => 
          comment._id === replyTo 
            ? { 
                ...comment, 
                replies: (comment.replies || []).map(reply => 
                  reply._id === tempReply._id ? data.comment : reply
                )
              }
            : comment
        ));
      } else {
        // Remove temp reply if failed
        setComments(prev => prev.map(comment => 
          comment._id === replyTo 
            ? { 
                ...comment, 
                replies: (comment.replies || []).filter(reply => reply._id !== tempReply._id)
              }
            : comment
        ));
        // Restore the reply text and form
        setReplyContent(replyContentText);
        setReplyTo(replyTo);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      // Remove temp reply if failed
      setComments(prev => prev.map(comment => 
        comment._id === replyTo 
          ? { 
              ...comment, 
              replies: (comment.replies || []).filter(reply => reply._id !== tempReply._id)
            }
          : comment
      ));
      // Restore the reply text and form
      setReplyContent(replyContentText);
      setReplyTo(replyTo);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyTo(null);
    setReplyContent('');
  };

  // Handle reaction
  const handleReaction = async (commentId: string, reactionType: string) => {
    if (!session?.user?.email) return;
    
    const userEmail = session.user.email;
    const currentComment = comments.find(c => c._id === commentId);
    const wasReacted = hasUserReacted(currentComment!, reactionType);
    
    console.log('Reaction state before update:', {
      commentId,
      reactionType,
      userEmail,
      wasReacted,
      currentReactions: currentComment?.reactions?.[reactionType as keyof typeof currentComment.reactions],
      currentCount: currentComment?.reactions?.[reactionType as keyof typeof currentComment.reactions]?.length || 0
    });

    // Optimistically update the UI
    setComments(prev => prev.map(comment => {
      if (comment._id === commentId) {
        const currentReactions = comment.reactions ? {
          upvote: [...(comment.reactions.upvote || [])],
          love: [...(comment.reactions.love || [])],
          laugh: [...(comment.reactions.laugh || [])],
          wow: [...(comment.reactions.wow || [])],
          sad: [...(comment.reactions.sad || [])],
          angry: [...(comment.reactions.angry || [])]
        } : {
          upvote: [], love: [], laugh: [], wow: [], sad: [], angry: []
        };
        
        if (wasReacted) {
          // Remove reaction
          currentReactions[reactionType as keyof typeof currentReactions] = 
            currentReactions[reactionType as keyof typeof currentReactions].filter(email => email !== userEmail);
        } else {
          // Add reaction
          currentReactions[reactionType as keyof typeof currentReactions] = 
            [...currentReactions[reactionType as keyof typeof currentReactions], userEmail];
        }
        
        return { ...comment, reactions: currentReactions };
      }
      return comment;
    }));

    setReacting(commentId);
    
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reactionType }),
      });

      if (!response.ok) {
        console.log('Reaction API failed, reverting optimistic update');
        // Revert optimistic update if failed
        setComments(prev => prev.map(comment => {
          if (comment._id === commentId) {
            const currentReactions = comment.reactions ? {
              upvote: [...(comment.reactions.upvote || [])],
              love: [...(comment.reactions.love || [])],
              laugh: [...(comment.reactions.laugh || [])],
              wow: [...(comment.reactions.wow || [])],
              sad: [...(comment.reactions.sad || [])],
              angry: [...(comment.reactions.angry || [])]
            } : {
              upvote: [], love: [], laugh: [], wow: [], sad: [], angry: []
            };
            
            if (wasReacted) {
              // Re-add reaction
              currentReactions[reactionType as keyof typeof currentReactions] = 
                [...currentReactions[reactionType as keyof typeof currentReactions], userEmail];
            } else {
              // Remove reaction
              currentReactions[reactionType as keyof typeof currentReactions] = 
                currentReactions[reactionType as keyof typeof currentReactions].filter(email => email !== userEmail);
            }
            
            return { ...comment, reactions: currentReactions };
          }
          return comment;
        }));
      } else {
        console.log('Reaction API successful, keeping optimistic update');
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      // Revert optimistic update if failed
      setComments(prev => prev.map(comment => {
        if (comment._id === commentId) {
          const currentReactions = comment.reactions || {
            upvote: [], love: [], laugh: [], wow: [], sad: [], angry: []
          };
          
          if (wasReacted) {
            // Re-add reaction
            currentReactions[reactionType as keyof typeof currentReactions] = 
              [...currentReactions[reactionType as keyof typeof currentReactions], userEmail];
          } else {
            // Remove reaction
            currentReactions[reactionType as keyof typeof currentReactions] = 
              currentReactions[reactionType as keyof typeof currentReactions].filter(email => email !== userEmail);
          }
          
          return { ...comment, reactions: currentReactions };
        }
        return comment;
      }));
    } finally {
      setReacting(null);
    }
  };

  // Check if user has reacted
  const hasUserReacted = (comment: Comment, reactionType: string) => {
    if (!session?.user?.email) return false;
    return comment.reactions?.[reactionType as keyof typeof comment.reactions]?.includes(session.user.email) || false;
  };

  // Get reaction count
  const getReactionCount = (comment: Comment, reactionType: string) => {
    const count = comment.reactions?.[reactionType as keyof typeof comment.reactions]?.length || 0;
    // Debug: log reaction data to see what's happening
    if (count > 0) {
      console.log(`Reaction count for ${reactionType}:`, count, comment.reactions?.[reactionType as keyof typeof comment.reactions]);
    }
    return count;
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {session ? (
        <div className="mb-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Add a comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-gray-900"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {newComment.length}/1000 characters
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-8 max-w-2xl mx-auto p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600 mb-3 text-sm">
            Please sign in to leave a comment.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
          >
            Sign In
          </a>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 max-w-3xl mx-auto pb-8">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-600 text-2xl font-bold">N</span>
            </div>
            <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-4">
              {/* Main Comment */}
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 font-semibold text-xs">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">
                    {comment.content}
                  </p>
                  <div className="flex items-center space-x-4 mb-2">
                    <button
                      onClick={() => setReplyTo(comment._id)}
                      className="text-xs text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                    >
                      Reply
                    </button>
                    
                    {/* Reaction Buttons */}
                    <div className="flex items-center space-x-2 animate-fade-in">
                      {/* Upvote */}
                      <button
                        onClick={() => handleReaction(comment._id, 'upvote')}
                        disabled={reacting === comment._id}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 ${
                          hasUserReacted(comment, 'upvote')
                            ? 'bg-gray-100 text-gray-700 shadow-md'
                            : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50 hover:shadow-sm'
                        } ${reacting === comment._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`text-sm transition-transform duration-300 ${hasUserReacted(comment, 'upvote') ? 'animate-bounce' : ''}`}>
                          👍
                        </span>
                        <span className={`font-medium text-xs min-w-[20px] text-center rounded-full px-1 py-0.5 transition-all duration-300 ${
                          hasUserReacted(comment, 'upvote') 
                            ? 'bg-gray-200 text-gray-800 scale-110' 
                            : 'bg-gray-100'
                        }`}>
                          {getReactionCount(comment, 'upvote')}
                        </span>
                      </button>

                      {/* Love */}
                      <button
                        onClick={() => handleReaction(comment._id, 'love')}
                        disabled={reacting === comment._id}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 ${
                          hasUserReacted(comment, 'love')
                            ? 'bg-gray-100 text-gray-700 shadow-md'
                            : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50 hover:shadow-sm'
                        } ${reacting === comment._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`text-sm transition-transform duration-300 ${hasUserReacted(comment, 'love') ? 'animate-pulse' : ''}`}>
                          ❤️
                        </span>
                        <span className={`font-medium text-xs min-w-[20px] text-center rounded-full px-1 py-0.5 transition-all duration-300 ${
                          hasUserReacted(comment, 'love') 
                            ? 'bg-gray-200 text-gray-800 scale-110' 
                            : 'bg-gray-100'
                        }`}>
                          {getReactionCount(comment, 'love')}
                        </span>
                      </button>

                      {/* Laugh */}
                      <button
                        onClick={() => handleReaction(comment._id, 'laugh')}
                        disabled={reacting === comment._id}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 ${
                          hasUserReacted(comment, 'laugh')
                            ? 'bg-gray-100 text-gray-700 shadow-md'
                            : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50 hover:shadow-sm'
                        } ${reacting === comment._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`text-sm transition-transform duration-300 ${hasUserReacted(comment, 'laugh') ? 'animate-wiggle' : ''}`}>
                          😂
                        </span>
                        <span className={`font-medium text-xs min-w-[20px] text-center rounded-full px-1 py-0.5 transition-all duration-300 ${
                          hasUserReacted(comment, 'laugh') 
                            ? 'bg-gray-200 text-gray-800 scale-110' 
                            : 'bg-gray-100'
                        }`}>
                          {getReactionCount(comment, 'laugh')}
                        </span>
                      </button>

                      {/* Wow */}
                      <button
                        onClick={() => handleReaction(comment._id, 'wow')}
                        disabled={reacting === comment._id}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 ${
                          hasUserReacted(comment, 'wow')
                            ? 'bg-gray-100 text-gray-700 shadow-md'
                            : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50 hover:shadow-sm'
                        } ${reacting === comment._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`text-sm transition-transform duration-300 ${hasUserReacted(comment, 'wow') ? 'animate-ping' : ''}`}>
                          😮
                        </span>
                        <span className={`font-medium text-xs min-w-[20px] text-center rounded-full px-1 py-0.5 transition-all duration-300 ${
                          hasUserReacted(comment, 'wow') 
                            ? 'bg-gray-200 text-gray-800 scale-110' 
                            : 'bg-gray-100'
                        }`}>
                          {getReactionCount(comment, 'wow')}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              {replyTo === comment._id && (
                <div className="mt-3 ml-11">
                  <form onSubmit={handleSubmitReply} className="space-y-3">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-sm text-gray-900"
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {replyContent.length}/1000 characters
                      </span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={cancelReply}
                          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!replyContent.trim() || isSubmitting}
                          className="px-2 py-1 text-xs bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Posting...</span>
                            </>
                          ) : (
                            'Reply'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 ml-11 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-900 font-semibold text-xs">
                              {reply.author.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium text-gray-900">
                              {reply.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-xs leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
