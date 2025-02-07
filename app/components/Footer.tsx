export function Footer() {
  return (
    <footer className="py-12 text-center bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">What is TheSurve?</h3>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            A community-driven platform created by DICE (Davao Interschool Computer Enthusiasts) 
            that believes every student deserves quality research data. We connect student researchers 
            with participants to make research easier and more collaborative.
          </p>
        </div>
        <div className="flex items-center justify-center gap-6 text-sm">
          <span className="text-gray-600 font-medium">
            Made with ❤️ by{' '}
            <a
              href="https://dicedvo.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-all hover:scale-105"
            >
              DICE
            </a>
          </span>
          <span className="h-4 w-px bg-gray-200"></span>
          <a 
            href="https://github.com/dicedvo/thesurve" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-all hover:scale-105 font-medium"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
