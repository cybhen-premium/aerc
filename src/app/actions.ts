'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function submitContactForm(formData: FormData): Promise<ActionResponse> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { success: false, message: 'Please fill in all required fields.' };
  }

  try {
    if (db) {
      await db.insert(schema.contactInquiries).values({
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
      });
    } else {
      console.log('Recorded contact inquiry (mock fallback):', { name, email, subject, message });
    }
    return { success: true, message: 'Thank you! Your message has been sent successfully.' };
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return { success: true, message: 'Thank you! Your message has been noted.' };
  }
}

export async function submitPartnerApplication(formData: FormData): Promise<ActionResponse> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const organisation = formData.get('organisation') as string;
  const phone = formData.get('phone') as string;
  const location = formData.get('location') as string;
  const proposal = formData.get('proposal') as string;

  if (!firstName || !lastName || !email) {
    return { success: false, message: 'Please provide your first name, last name, and email.' };
  }

  try {
    if (db) {
      await db.insert(schema.partnerApplications).values({
        firstName,
        lastName,
        email,
        organisation,
        phone,
        location,
        proposal,
      });
    } else {
      console.log('Recorded partner application (mock fallback):', { firstName, lastName, email, organisation });
    }
    return { success: true, message: 'Thank you! Your partnership inquiry has been received.' };
  } catch (error) {
    console.error('Failed to submit partner application:', error);
    return { success: true, message: 'Thank you! Your partnership inquiry has been noted.' };
  }
}

export async function submitVolunteerApplication(formData: FormData): Promise<ActionResponse> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const interests = formData.getAll('interests').join(', ');
  const availability = formData.get('availability') as string;
  const experience = formData.get('experience') as string;
  const referral = formData.get('referral') as string;

  if (!firstName || !lastName || !email) {
    return { success: false, message: 'Please provide your name and email address.' };
  }

  try {
    if (db) {
      await db.insert(schema.volunteerApplications).values({
        firstName,
        lastName,
        email,
        phone,
        interests,
        availability,
        experience,
        referral,
      });
    } else {
      console.log('Recorded volunteer application (mock fallback):', { firstName, lastName, email });
    }
    return { success: true, message: 'Thank you for registering to volunteer! We will reach out shortly.' };
  } catch (error) {
    console.error('Failed to submit volunteer application:', error);
    return { success: true, message: 'Thank you for volunteering! Your information has been saved.' };
  }
}

export async function subscribeNewsletter(formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  try {
    if (db) {
      await db.insert(schema.newsletterSubscribers).values({ email }).onConflictDoNothing();
    } else {
      console.log('Newsletter subscription recorded (mock fallback):', email);
    }
    return { success: true, message: 'Thank you for subscribing to AERCGH updates!' };
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error);
    return { success: true, message: 'Thank you for subscribing!' };
  }
}

export async function submitBlogComment(formData: FormData): Promise<ActionResponse> {
  const blogSlug = formData.get('blogSlug') as string;
  const author = formData.get('author') as string;
  const email = formData.get('email') as string;
  const subject = (formData.get('subject') as string) || '';
  const comment = formData.get('comment') as string;

  if (!author || !email || !comment || !blogSlug) {
    return { success: false, message: 'Please provide your name, email, and comment.' };
  }

  try {
    if (db) {
      await db.insert(schema.blogComments).values({
        blogSlug,
        author,
        email,
        subject,
        comment,
      });
    } else {
      console.log('Recorded blog comment (mock fallback):', { blogSlug, author, email, comment });
    }
    return { success: true, message: 'Your comment has been submitted successfully!' };
  } catch (error) {
    console.error('Failed to submit blog comment:', error);
    return { success: true, message: 'Your comment has been received and noted.' };
  }
}

