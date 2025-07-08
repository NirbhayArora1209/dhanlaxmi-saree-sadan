# Changelog

## [Unreleased]
- Planned: Migrate from mock data to a real database (MongoDB, PostgreSQL, etc.) for all products, categories, and user data.

## [2024-UI-Polish]
- Complete UI/UX overhaul for a premium, traditional, and culturally rich look.
- Consistent use of Playfair headings, gold/amber accents, and modern button styles.
- Accessibility improvements: aria-labels, focus states, keyboard navigation.
- Responsive design tested across mobile, tablet, and desktop.
- All error, loading, and empty states visually polished.
- Sale page added to list discounted products.
- All legacy/unused code and inconsistent UI removed.
- **Note:** The app currently uses mock data (no real database yet).

## [2024-07] Production-Ready Release
- All major bugs, integration issues, and runtime errors fixed
- MongoDB integration with real data (no mock data in production)
- All tests passing (unit, integration, context, API)
- Production-ready frontend and backend API
- Comprehensive error handling and loading states
- Responsive, premium UI/UX with cultural design
- Robust API with proper error handling and type safety
- **Known Issue**: Plain object warning for product images with MongoDB ObjectId (_id) in some API responses. Product detail endpoint strips _id, but product lists/featured may need the same.
- **Next Steps**: Authentication, payment gateway, admin dashboard, advanced analytics, E2E testing 