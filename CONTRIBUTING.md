# Contributing to Smart Internship Match

Thank you for your interest in contributing to Smart Internship Match! This document provides guidelines for contributing to our AI-powered internship matching platform.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs or request features
- Provide detailed information about the issue
- Include steps to reproduce the problem
- Add relevant screenshots or error messages

### Suggesting Enhancements
- Open an issue with the "enhancement" label
- Describe the proposed feature in detail
- Explain how it would benefit users
- Consider the impact on existing functionality

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git
- Code editor (VS Code recommended)

### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/smart-internship-match.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies:
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Development Workflow
1. Make your changes
2. Test your changes thoroughly
3. Run linting: `npm run lint`
4. Commit with descriptive messages
5. Push to your fork
6. Create a Pull Request

## 📝 Code Style

### Frontend (React/TypeScript)
- Use functional components with hooks
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow the existing component structure

### Backend (Python)
- Follow PEP 8 style guidelines
- Use type hints for function parameters and return values
- Add docstrings for all functions and classes
- Keep functions small and focused
- Use meaningful variable names

### General Guidelines
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions and components small
- Use consistent naming conventions
- Follow the existing code structure

## 🧪 Testing

### Frontend Testing
```bash
npm run test
npm run test:coverage
```

### Backend Testing
```bash
cd backend
python -m pytest
python test_matchmaking_system.py
```

### Manual Testing
- Test all user flows
- Verify responsive design
- Check accessibility features
- Test error handling

## 📋 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] No console errors or warnings

### PR Description
- Clear title describing the change
- Detailed description of what was changed
- Reference any related issues
- Include screenshots for UI changes
- List any breaking changes

### Review Process
- All PRs require review from maintainers
- Address feedback promptly
- Keep PRs focused and small
- Update PR if requested changes are made

## 🏗️ Project Structure

### Frontend (`src/`)
- `components/` - Reusable UI components
- `pages/` - Route components
- `services/` - API and business logic
- `contexts/` - React contexts
- `hooks/` - Custom React hooks
- `utils/` - Utility functions

### Backend (`backend/`)
- `main.py` - FastAPI application
- `matchmaking_system.py` - AI matching logic
- `requirements.txt` - Python dependencies

### Database (`supabase/`)
- `migrations/` - Database schema changes
- `functions/` - Edge functions

## 🎯 Areas for Contribution

### High Priority
- Bug fixes and performance improvements
- Accessibility enhancements
- Mobile responsiveness
- Error handling improvements

### Medium Priority
- New AI features
- Additional resume templates
- Enhanced analytics
- Integration improvements

### Low Priority
- Documentation updates
- Code refactoring
- Test coverage improvements
- UI/UX enhancements

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, etc.)
- Screenshots or error messages
- Console logs (if applicable)

## 💡 Feature Requests

When suggesting features:
- Describe the problem it solves
- Explain the proposed solution
- Consider implementation complexity
- Think about user impact
- Check for existing similar features

## 📚 Documentation

- Update README.md for major changes
- Add JSDoc comments for new functions
- Update API documentation
- Include code examples
- Keep documentation current

## 🚀 Release Process

1. All changes go through PR review
2. Tests must pass
3. Documentation is updated
4. Version is bumped
5. Changes are merged to main
6. Release is created

## 📞 Getting Help

- Check existing issues and discussions
- Join our community discussions
- Contact maintainers directly
- Review documentation and examples

## 🙏 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Credited in the hackathon submission
- Recognized in project documentation

Thank you for contributing to Smart Internship Match! Together, we can make internship matching more intelligent and equitable for all students.

---

**Happy Coding! 🚀**
