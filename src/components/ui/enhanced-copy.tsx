
import React from 'react';

// Enhanced copy constants with improved UX language
export const COPY = {
  // Button Labels
  buttons: {
    submit: "Let's go",
    search: "Find what you need",
    getStarted: "Get started free",
    signUp: "Create your account",
    signIn: "Welcome back",
    sendMessage: "Send your message",
    subscribe: "Keep me updated",
    tryDemo: "Try it now",
    learnMore: "Discover more",
    viewAll: "See everything",
    download: "Get it now",
    continue: "Continue your journey",
    save: "Save changes",
    cancel: "Not now",
    delete: "Remove this",
    edit: "Make changes",
    share: "Share with others",
    copy: "Copy to clipboard",
    upload: "Choose files",
    reset: "Start over",
  },

  // Error Messages
  errors: {
    generic: "Hmm... that didn't work. Mind trying again?",
    network: "Connection hiccup! Please check your internet and try again.",
    validation: "Looks like something needs your attention above.",
    notFound: "We couldn't find what you're looking for.",
    unauthorized: "You'll need to sign in first.",
    forbidden: "Sorry, you don't have access to this.",
    serverError: "Our servers are having a moment. We're on it!",
    timeout: "That took longer than expected. Let's try again.",
    formSubmission: "We couldn't send that. Mind trying once more?",
    fileUpload: "File upload didn't work out. Try a different file?",
    emailTaken: "That email is already in use. Try signing in instead?",
    passwordWeak: "Let's make that password a bit stronger.",
    required: "This field needs some love.",
    invalidEmail: "That doesn't look like an email address.",
    passwordMismatch: "Those passwords don't match.",
  },

  // Success Messages
  success: {
    generic: "Great! That worked perfectly.",
    saved: "All set! Your changes are saved.",
    sent: "Message sent successfully!",
    uploaded: "File uploaded and ready to go.",
    deleted: "Removed successfully.",
    copied: "Copied to your clipboard!",
    subscribed: "You're all set! Check your email.",
    accountCreated: "Welcome aboard! Check your email to get started.",
    passwordReset: "Password reset link sent to your email.",
    profileUpdated: "Your profile looks great!",
  },

  // Loading Messages
  loading: {
    generic: "Just a moment...",
    saving: "Saving your changes...",
    loading: "Getting things ready...",
    uploading: "Uploading your file...",
    processing: "Working on it...",
    sending: "Sending your message...",
    connecting: "Connecting...",
    analyzing: "Analyzing your data...",
    optimizing: "Making things faster...",
  },

  // Placeholders
  placeholders: {
    email: "your@email.com",
    password: "Make it strong and memorable",
    confirmPassword: "Type your password again",
    firstName: "What should we call you?",
    lastName: "And your last name?",
    company: "Where do you work?",
    message: "What's on your mind?",
    search: "Find what you need...",
    feedback: "How can we improve?",
    subject: "What's this about?",
    phone: "Your phone number",
    website: "https://yoursite.com",
  },

  // Help Text
  help: {
    password: "At least 8 characters with a mix of letters and numbers",
    email: "We'll use this to keep you updated",
    optional: "This is optional, but helps us serve you better",
    required: "We need this to continue",
    privacy: "We'll never share your information",
    support: "Having trouble? We're here to help!",
  },

  // Navigation
  navigation: {
    home: "Home",
    features: "What we can do",
    pricing: "Simple pricing",
    about: "Our story",
    contact: "Get in touch",
    support: "We're here to help",
    docs: "Learn how",
    blog: "Latest insights",
    login: "Sign in",
    dashboard: "Your dashboard",
    settings: "Your preferences",
    profile: "Your profile",
  },

  // Status Messages
  status: {
    online: "Everything's running smoothly",
    offline: "You're offline right now",
    syncing: "Syncing your changes...",
    upToDate: "You're all caught up!",
    draft: "Draft saved automatically",
    published: "Live and ready to share",
    pending: "Waiting for approval",
    processing: "We're working on this",
  }
};

// Component for consistent copy usage
interface CopyTextProps {
  type: keyof typeof COPY;
  variant: string;
  fallback?: string;
  className?: string;
}

export function CopyText({ type, variant, fallback, className }: CopyTextProps) {
  const text = (COPY[type] as any)?.[variant] || fallback || variant;
  
  return (
    <span className={className}>
      {text}
    </span>
  );
}

// Hook for using copy in components
export function useCopy() {
  return COPY;
}
