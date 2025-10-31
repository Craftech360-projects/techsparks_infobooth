# Event Website

A Next.js static website with 5 pages: Landing, Agenda, Speakers, Partners, and Navigate.

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── agenda/page.tsx   # Agenda page
│   ├── speakers/page.tsx # Speakers page
│   ├── partners/page.tsx # Partners page
│   ├── navigate/page.tsx # Navigate page
│   ├── layout.tsx        # Root layout with navigation
│   └── globals.css       # Global styles with SF Pro Display font
├── components/
│   └── Navigation.tsx    # Navigation component
public/
└── images/               # Background images folder
    ├── landing-bg.jpg    # Landing page background (add your image)
    ├── agenda-bg.jpg     # Agenda page background (add your image)
    ├── speakers-bg.jpg   # Speakers page background (add your image)
    ├── partners-bg.jpg   # Partners page background (add your image)
    └── navigate-bg.jpg   # Navigate page background (add your image)
```

## Background Images

Add your background images to the `public/images/` folder with these exact names:
- `landing-bg.jpg` - Landing page background
- `agenda-bg.jpg` - Agenda page background  
- `speakers-bg.jpg` - Speakers page background
- `partners-bg.jpg` - Partners page background
- `navigate-bg.jpg` - Navigate page background

## Features

- ✅ SF Pro Display font (with Inter fallback)
- ✅ Responsive design with Tailwind CSS
- ✅ Fixed navigation bar with backdrop blur
- ✅ Full-screen background images on each page
- ✅ Dark overlay for better text readability
- ✅ TypeScript support

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Next Steps

1. Add your background images to `public/images/`
2. Customize the content for each page
3. Add more components as needed
4. Deploy to Vercel or your preferred platform