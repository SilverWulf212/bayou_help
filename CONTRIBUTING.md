# Contributing to Bayou Help

Thank you for your interest in contributing to Bayou Help! This project aims to help people experiencing homelessness in Acadiana, and we welcome contributions that support this mission.

## 🌟 Ways to Contribute

- **Code**: Bug fixes, features, tests, and documentation
- **Resources**: Help us gather and verify local resource information
- **Design**: Improve UI/UX, especially for accessibility
- **Testing**: Test the app on different devices and report issues
- **Translation**: Help make the app available in multiple languages
- **Documentation**: Improve guides, add examples, fix typos

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/bayou_help.git
   cd bayou_help
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style

- **JavaScript/React**: Follow the existing ESLint configuration
- **Run linting**: `npm run lint` before committing
- **File names**: Use kebab-case for files (e.g., `resource-card.js`, `resource-card.jsx`)
- **File extensions**: Use `.jsx` for files containing JSX, `.js` for plain JavaScript
- **Component names**: Use PascalCase for React components

### Commit Messages

Write clear, concise commit messages:
```
feat: Add shelter filtering by parish
fix: Correct phone number formatting
docs: Update installation instructions
style: Format code with ESLint
```

Use conventional commit prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Testing

- Test your changes on mobile devices (or use browser dev tools)
- Ensure accessibility features work (screen readers, keyboard navigation)
- Test with slow/unreliable network conditions
- Verify that the reading level remains simple and clear

### Design Principles

**Remember our users:**
- May be experiencing stress or trauma
- May have limited literacy
- May be using old or damaged devices
- May have spotty internet connection

**Design accordingly:**
- Keep text short and simple (6th-grade reading level)
- Use large tap targets (≥44px)
- Minimize data usage
- Provide clear error messages
- Never store user data

## 🔍 Pull Request Process

1. **Update documentation** if needed (README, code comments)
2. **Run tests and linting**: Ensure `npm run lint` passes
3. **Write a clear PR description**:
   - What problem does this solve?
   - How does it work?
   - Any breaking changes?
4. **Link related issues** in your PR description
5. **Wait for review** - maintainers will review and provide feedback
6. **Address feedback** and push updates to your branch

## 🐛 Reporting Bugs

Found a bug? Please [open an issue](https://github.com/SilverWulf212/bayou_help/issues/new) with:

- **Clear title**: Brief description of the problem
- **Steps to reproduce**: How to trigger the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Device, browser, OS version
- **Screenshots**: If applicable

## 💡 Suggesting Features

Have an idea? [Open an issue](https://github.com/SilverWulf212/bayou_help/issues/new) with:

- **Clear title**: Brief feature description
- **Problem**: What user need does this address?
- **Solution**: How would it work?
- **Alternatives**: Other approaches considered
- **Mockups**: Visual examples if applicable

## 🔒 Security Issues

**Do not** open public issues for security vulnerabilities. Instead, see [SECURITY.md](SECURITY.md) for how to report them privately.

## 📋 Resource Contributions

Want to add or update local resource information?

1. Verify the information is accurate and current
2. Include all required fields:
   - Name
   - Category (shelter, food, health, etc.)
   - Parish/city
   - Contact information
   - Hours of operation
   - Eligibility requirements
   - "What to do next" instructions
3. Submit via the admin panel or create a PR with data updates

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Age, race, ethnicity, or nationality
- Gender identity and expression
- Sexual orientation
- Disability
- Physical appearance
- Religion or lack thereof
- Previous experience level

### Our Standards

**Expected behavior:**
- Be respectful and considerate
- Welcome newcomers warmly
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy toward others

**Unacceptable behavior:**
- Harassment, discrimination, or hate speech
- Trolling or inflammatory comments
- Personal attacks or insults
- Sharing others' private information
- Other unprofessional conduct

### Enforcement

Violations may result in:
- Warning
- Temporary ban from contributing
- Permanent ban from the project

Report issues to the maintainers through GitHub.

## 📞 Questions?

- **General questions**: Open a GitHub issue with the "question" label
- **Real-time discussion**: Join our discussions on GitHub
- **Project maintainers**: See the repository contributors list

## 🙏 Thank You

Every contribution, no matter how small, helps make Bayou Help better for people who need it most. Thank you for being part of this community!

---

By contributing, you agree that your contributions will be licensed under the MIT License.
