# Cyber TMSAH - Content Management Guide

## Admin Access

The admin panel is located at `/admin/content` and is protected with a password.

### Default Password
- **Password**: `cyber2024`
- **URL**: `https://your-domain.com/admin/content`

### How to Change Password
1. Open `app/admin/content/page.tsx`
2. Find line 55: `if (password === 'cyber2024')`
3. Change `'cyber2024'` to your desired password
4. Save and redeploy

## Content Management Workflow

### 1. Access Admin Panel
1. Go to `/admin/content`
2. Enter password: `cyber2024`
3. Click "Access Admin Panel"

### 2. Add New Lecture
1. Click "Add New Lecture"
2. Fill in the form:
   - **Title**: Lecture title
   - **Description**: Brief description
   - **Duration**: e.g., "90 minutes"
   - **Date**: Lecture date
   - **Type**: lecture/lab/assignment
   - **Status**: published/draft/coming-soon
   - **Content**: Markdown content
3. Click "Save Lecture"

### 3. Generate Code
1. After adding lectures, scroll to "Generated Code" section
2. Copy the generated code
3. Paste it into the appropriate subject file:
   - `app/materials/[id]/page.tsx` for lecture list
   - `app/materials/[id]/[lectureId]/page.tsx` for lecture content

### 4. Update Subject Files
1. **For lecture list**: Update the `lectures` array in `subjectData`
2. **For lecture content**: Update the `lectureContent` object

## Security Features

- **Password Protection**: Simple password-based authentication
- **Hidden from Public**: No links to admin panel in navigation
- **Robots.txt**: Blocks search engine indexing
- **Local Storage**: Remembers authentication state
- **Logout Function**: Clear authentication on logout

## File Structure

```
app/
├── admin/
│   └── content/
│       └── page.tsx          # Admin panel
├── materials/
│   ├── [id]/
│   │   ├── page.tsx          # Subject page
│   │   └── [lectureId]/
│   │       └── page.tsx      # Lecture page
│   └── page.tsx              # Materials overview
└── ...

public/
├── data/
│   └── lectures.json         # Alternative data storage
└── robots.txt                # SEO protection

lib/
└── lectures.ts               # Data management utilities
```

## Alternative Methods

### Method 1: Direct Code Editing
- Edit files directly in the codebase
- Add lectures to subject arrays
- Update lecture content objects

### Method 2: JSON File Management
- Edit `public/data/lectures.json`
- Use the utility functions in `lib/lectures.ts`
- More organized for large amounts of content

### Method 3: Admin Panel (Recommended)
- Use the protected admin interface
- Generate code automatically
- Copy-paste into subject files

## Best Practices

1. **Regular Backups**: Keep backups of your content
2. **Test Changes**: Test locally before deploying
3. **Version Control**: Use Git to track changes
4. **Content Validation**: Check markdown formatting
5. **Image Optimization**: Optimize images before upload

## Troubleshooting

### Admin Panel Not Loading
- Check if password is correct
- Clear browser cache
- Check console for errors

### Generated Code Not Working
- Verify JSON syntax
- Check for missing quotes
- Ensure proper indentation

### Content Not Displaying
- Check file paths
- Verify markdown formatting
- Check for typos in IDs

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Test in development environment
4. Contact the developer
