# TheSurve

TheSurve is a community-driven platform developed by [DICE (Davao Interschool Computer Enthusiasts)](https://dicedvo.org) that connects student researchers with willing participants. Our mission is to democratize academic research by making it easier for students to gather quality data for their research projects.

## About DICE

DICE is an organization that promotes technology education and collaboration among different student tech communities in Davao City, Philippines. Through projects like TheSurve, we aim to solve real problems faced by students while fostering a culture of innovation and community-driven development.

## Features

- 🔍 Share and discover academic research surveys
- 📊 Track survey responses and engagement
- 🎓 Connect with students across different institutions
- ⚡ Fast, modern UI built with React and TanStack Router

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start)
- **Router:** [TanStack Router](https://tanstack.com/router)
- **Backend:** [Directus](https://directus.io)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Styling:** Tailwind CSS
- **API Client:** OpenAPI with TanStack Query
- **Runtime:** Bun

## Getting Started

### Prerequisites

- Bun (>= 1.2.1)
- Node.js (>= 18)

### Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/thesurve.git
cd thesurve
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
API_URL=your_api_url
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_APP_ID=your_firebase_app_id
```

### Building for Production

```bash
bun run build
```

### Docker

Build and run the application using Docker:

```bash
docker build -t thesurve .
docker run -p 3000:3000 thesurve
```

## Project Structure

```
├── app/
│   ├── components/     # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/          # Utilities and configurations
│   ├── routes/       # Application routes
│   └── styles/       # Global styles and Tailwind config
├── public/           # Static assets
└── tests/           # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

The application is automatically deployed using GitHub Actions. When pushing to the `master` branch, a new Docker image is built and published to GitHub Container Registry.

See the workflow configuration in `.github/workflows/docker-publish.yml` for details.
