# Gmail OAuth2 Setup for Invoice Emails

## Overview

This system now uses Gmail OAuth2 instead of app passwords for sending invoice emails. OAuth2 is more secure and modern than app passwords.

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Gmail API** for your project
4. Go to **APIs & Services** → **Credentials**

### 2. Create OAuth2 Credentials

1. Click **Create Credentials** → **OAuth 2.0 Client IDs**
2. Choose **Web application** as application type
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
4. **Copy your Client ID and Client Secret**

### 3. Update Environment Variables

#### Local Development (.env.local)

```bash
GOOGLE_CLIENT_ID=your_oauth2_client_id
GOOGLE_CLIENT_SECRET=your_oauth2_client_secret
GMAIL_USER=loveserenespaces@gmail.com
```

#### Vercel Production

1. Go to [vercel.com](https://vercel.com) → Your project
2. **Settings** → **Environment Variables**
3. Add:
   - `GOOGLE_CLIENT_ID`: `your_oauth2_client_id`
   - `GOOGLE_CLIENT_SECRET`: `your_oauth2_client_secret`
   - `GMAIL_USER`: `loveserenespaces@gmail.com`

### 4. Test the Setup

1. **Restart your dev server**: `npm run dev`
2. **Test the email endpoint**: `http://localhost:3000/api/test-email`
3. **Try sending an invoice** from the admin panel

## How It Works

- **From Address**: `Serene Spaces <loveserenespaces@gmail.com>`
- **Reply-To**: `loveserenespaces@gmail.com`
- **Service**: Gmail API via OAuth2
- **Authentication**: OAuth2 tokens (most secure method)
- **Setup Process**: Use the admin setup page at `/admin/gmail-setup`

## Benefits of Gmail OAuth2

✅ **Most Secure** - OAuth2 is the industry standard for authentication
✅ **No App Passwords** - Uses modern token-based authentication
✅ **Better Security** - Tokens can be revoked and have expiration
✅ **Google's Infrastructure** - Rock-solid reliability and deliverability
✅ **Free** - No monthly costs or API limits
✅ **Modern** - Follows current security best practices

## Troubleshooting

### Common Issues:

1. **"OAuth2 credentials not configured"**
   - Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
   - Verify your Google Cloud project has Gmail API enabled

2. **"Refresh token not configured"**
   - Complete the OAuth2 setup process at `/admin/gmail-setup`
   - Add the refresh token to your `.env.local` file

3. **"Authorization failed"**
   - Check that your redirect URIs are correctly configured
   - Ensure you're using the right OAuth2 client credentials

### Testing:

1. **Complete OAuth2 Setup**: Visit `/admin/gmail-setup`
2. **Test Email Endpoint**: `http://localhost:3000/api/test-email`
3. **Send Test Invoice**: Try sending an invoice from the admin panel
4. **Check Console**: Monitor server logs for detailed information

## Security Notes

- **Never commit OAuth2 credentials** to version control
- **Use environment variables** for all sensitive data
- **OAuth2 tokens are more secure** than app passwords
- **Tokens can be revoked** if compromised
- **Follow Google's security best practices**

## Production Deployment

1. Set environment variables in Vercel
2. Test email sending in production
3. Monitor email delivery rates
4. Check Gmail's sending limits (2,000 emails/day for regular accounts)

## Support

- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- Check your Gmail account for any security warnings

## Next Steps

1. **Set up Google Cloud Project** following the steps above
2. **Get OAuth2 credentials** (Client ID and Client Secret)
3. **Update your .env.local file** with the credentials
4. **Complete OAuth2 setup** at `/admin/gmail-setup`
5. **Test the email functionality** locally
6. **Deploy to production** with the same environment variables
7. **Start sending real invoices** via email!

---

**Note**: This setup replaces the previous app password configuration. The system now uses modern OAuth2 authentication for secure Gmail access.
