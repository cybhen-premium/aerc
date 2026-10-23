'use client';

import { useState } from 'react';
import { submitBlogComment } from '@/app/actions';
import type { BlogComment } from '@/db/schema';

interface CommentSectionProps {
  blogSlug: string;
  initialComments: BlogComment[];
}

export default function CommentSection({ blogSlug, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('blogSlug', blogSlug);

    const author = (formData.get('author') as string) || '';
    const email = (formData.get('email') as string) || '';
    const subject = (formData.get('subject') as string) || '';
    const commentText = (formData.get('comment') as string) || '';

    const res = await submitBlogComment(formData);
    setLoading(false);
    setStatus(res);

    if (res.success) {
      const newComment: BlogComment = {
        id: Date.now(),
        blogSlug,
        author,
        email,
        subject,
        comment: commentText,
        createdAt: new Date(),
      };
      setComments([newComment, ...comments]);
      form.reset();
    }
  };

  return (
    <section className="article-comment-section" id="comments">
      {/* Existing Comments Header */}
      <div className="comments-header">
        <h3 className="comments-count-title">
          <i className="fa-regular fa-comments"></i>
          <span>
            {comments.length === 0
              ? 'Comments (0)'
              : comments.length === 1
              ? '1 Comment'
              : `${comments.length} Comments`}
          </span>
        </h3>
      </div>

      {/* Comment List */}
      {comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="comment-content">
                <div className="comment-meta">
                  <span className="comment-author">{c.author}</span>
                  <span className="comment-date">
                    {new Date(c.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {c.subject && <div className="comment-subject">{c.subject}</div>}
                <p className="comment-body">{c.comment}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-comments-box">
          <p>There are no comments on this post yet. Be the first to start the conversation!</p>
        </div>
      )}

      {/* Leave A Comment Form Area */}
      <div className="leave-comment-wrap" id="respond">
        <div className="leave-comment-header">
          <h3 className="comment-reply-title">Leave A Comment</h3>
          <p className="comment-notes">
            Your email address will not be published. Required fields are marked <span className="required">*</span>
          </p>
        </div>

        {status && (
          <div
            className={`comment-alert ${status.success ? 'comment-alert-success' : 'comment-alert-error'}`}
            role="alert"
          >
            <i className={`fa-solid ${status.success ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-form-grid">
            <div className="comment-field">
              <label htmlFor="comment-author" className="comment-label">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="comment-author"
                name="author"
                placeholder="Your Name *"
                required
                className="comment-input"
              />
            </div>

            <div className="comment-field">
              <label htmlFor="comment-email" className="comment-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="comment-email"
                name="email"
                placeholder="Your Email *"
                required
                className="comment-input"
              />
            </div>
          </div>

          <div className="comment-field">
            <label htmlFor="comment-subject" className="comment-label">
              Subject
            </label>
            <input
              type="text"
              id="comment-subject"
              name="subject"
              placeholder="Subject (Optional)"
              className="comment-input"
            />
          </div>

          <div className="comment-field">
            <label htmlFor="comment-text" className="comment-label">
              Comment <span className="required">*</span>
            </label>
            <textarea
              id="comment-text"
              name="comment"
              rows={6}
              placeholder="Comment..."
              required
              className="comment-textarea"
            ></textarea>
          </div>

          {/* Consent and Subscription Checkboxes */}
          <div className="comment-checkboxes">
            <label className="checkbox-row">
              <input type="checkbox" name="save_info" value="yes" className="comment-checkbox" defaultChecked />
              <span>Save my name, email, and website in this browser for the next time I comment.</span>
            </label>

            <label className="checkbox-row">
              <input type="checkbox" name="notify_comments" value="yes" className="comment-checkbox" />
              <span>Notify me of follow-up comments by email.</span>
            </label>

            <label className="checkbox-row">
              <input type="checkbox" name="notify_posts" value="yes" className="comment-checkbox" />
              <span>Notify me of new posts by email.</span>
            </label>
          </div>

          <div className="comment-submit-wrap">
            <button type="submit" disabled={loading} className="btn-primary comment-submit-btn">
              <span>{loading ? 'Posting...' : 'Post Comment'}</span>
              <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
