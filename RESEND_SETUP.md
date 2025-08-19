# Resend Email Service Setup

## Overview

This website uses [Resend](https://resend.com) for sending invoice emails to customers. Resend is a modern email API that provides reliable email delivery.

## Current Configuration

- **API Key**: Currently using a hardcoded key (should be moved to environment variables)
- **From Email**: `noreply@serenespaces.com` (you'll need to verify this domain)
- **Reply-To**: `loveserenespaces@gmail.com`

## Setup Steps

### 1. Create Environment File

Create a `.env.local` file in your project root with:

```bash
# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here

# Other environment variables...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
DATABASE_URL=your_database_url_here
```

### 2. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to the API Keys section
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

### 3. Verify Your Domain (Recommended)

To send emails from `noreply@serenespaces.com` instead of the default Resend domain:

1. In your Resend dashboard, go to Domains
2. Add your domain (`serenespaces.com`)
3. Follow the DNS verification steps
4. Wait for verification (usually takes a few minutes)

### 4. Test Email Sending

1. Start your development server: `npm run dev`
2. Go to `/admin/invoices/new`
3. Fill out an invoice with a valid email address
4. Click "📧 Send Invoice"
5. Check the email was received

## Email Features

### Invoice Email Includes:

- Professional HTML formatting
- Company branding
- Customer information
- Itemized services with prices
- Tax calculations (6.25% Illinois sales tax)
- Payment methods (Zelle, Venmo, Cash)
- Personal message (optional)
- Contact information

### Email Styling:

- Responsive design for mobile and desktop
- Professional color scheme matching your brand
- Clear payment instructions
- Easy-to-read formatting

## Troubleshooting

### Common Issues:

1. **"Email service configuration error"**
   - Check that `RESEND_API_KEY` is set in your `.env.local` file
   - Restart your development server after adding environment variables

2. **"Failed to send email"**
   - Check your Resend dashboard for error details
   - Verify the recipient email address is valid
   - Check your Resend account has sufficient credits

3. **Emails going to spam**
   - Verify your domain with Resend
   - Use a consistent "from" address
   - Include proper email content (not just links)

### Testing:

- Use your own email address for testing
- Check both inbox and spam folders
- Monitor Resend dashboard for delivery status

## Security Notes

- **Never commit API keys to version control**
- **Use environment variables for all sensitive data**
- **Rotate API keys periodically**
- **Monitor email sending for unusual activity**

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform
2. Verify your domain with Resend
3. Test email sending in production environment
4. Monitor email delivery rates and bounce rates

## Support

- [Resend Documentation](https://resend.com/docs)
- [Resend Support](https://resend.com/support)
- Check your Resend dashboard for detailed error logs
