# Form Flow Prototype

A responsive form flow prototype for user testing, built with HTML, CSS, and JavaScript.

## Overview

This prototype demonstrates a multi-step form flow with the following features:

- Progressive disclosure of form fields
- Form validation with real-time feedback
- Responsive design for all device sizes
- Email and phone verification simulation
- Password strength indicator
- Session storage to maintain form state

## Form Flow Structure

The prototype consists of the following pages:

1. **Start Page**: Introduction and instructions
2. **Identity Confirmation**: First name, last name, middle name (optional), and date of birth
3. **Address Information**: Address search with dropdown selection
4. **Email Verification**: Email verification with code input
5. **Phone Verification**: Phone verification with code input (on same page as email)
6. **Account Creation**: Username and password creation with validation
7. **Confirmation**: Success page with next steps

## Technical Implementation

- **HTML5** for structure
- **CSS3** for styling with:
  - CSS variables for theming
  - Flexbox/Grid for layout
  - Media queries for responsiveness
- **JavaScript** for:
  - Form validation
  - Navigation between pages
  - Storing form data (using sessionStorage)
  - Simulating verification processes

## Deployment to GitHub Pages

This project is set up to be deployed to GitHub Pages. Follow these steps to deploy:

1. Make sure all your changes are committed to the repository
2. Go to your GitHub repository settings
3. Scroll down to the "GitHub Pages" section
4. Select the branch you want to deploy (usually `main` or `master`)
5. Select the root folder as the source
6. Click "Save"

Your site will be published at `https://[username].github.io/[repository-name]/`

## Local Development

To run this prototype locally:

1. Clone the repository
2. Open the project folder
3. Open `index.html` in your browser

No build steps or server setup is required as this is a static HTML/CSS/JS project.

## Browser Compatibility

This prototype is designed to work in modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## User Testing Considerations

When conducting user testing with this prototype:

- Observe how users navigate between form steps
- Note any confusion points in the form flow
- Pay attention to form validation feedback and how users respond
- Test on different device sizes to ensure responsive design works well
