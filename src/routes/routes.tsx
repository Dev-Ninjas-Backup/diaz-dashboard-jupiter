import AboutUs from '@/pages/AboutUs';
import BoatsInventory from '@/pages/BoatsInventory';
import DispatchReport from '@/pages/DispatchReport';
import CategoryManagement from '@/pages/CategoryManagement';
import ContactUs from '@/pages/ContactUs';
import CreateNewArticle from '@/pages/CreateNewArticle';
import FAQ from '@/pages/FAQ';
import FeaturedBrands from '@/pages/FeaturedBrands';
import Footer from '@/pages/Footer';
import OurTeam from '@/pages/OurTeam';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import UpdateBlogPost from '@/pages/UpdateBlogPost';
import WhyUs from '@/pages/WhyUs';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import AnalyticsAndReports from '../pages/AnalyticsAndReports';
import ContentManagement from '../pages/ContentManagement';
import AllLeads from '../pages/DailyLeads';
import FeaturedAndHomeManagement from '../pages/Featured&HomeManagement';
import Overview from '../pages/Overview';
import Settings from '../pages/Settings';
import UsersAndPermission from '../pages/UsersAndPermission';
import LoginPage from '../pages/login/Login';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/admin-login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <Overview /> },
          { path: 'overview', element: <Overview /> },

          { path: 'yacht-leads', element: <AllLeads /> },
          { path: 'featured', element: <FeaturedAndHomeManagement /> },
          { path: 'content', element: <ContentManagement /> },
          { path: 'content/new-article', element: <CreateNewArticle /> },
          { path: 'content/edit/:id', element: <UpdateBlogPost /> },
          { path: 'content/about-us', element: <AboutUs /> },
          { path: 'content/contact', element: <ContactUs /> },
          { path: 'content/privacy-policy', element: <PrivacyPolicy /> },
          { path: 'content/terms-of-service', element: <TermsOfService /> },
          { path: 'content/footer', element: <Footer /> },
          { path: 'content/faq', element: <FAQ /> },
          { path: 'content/why-us', element: <WhyUs /> },
          { path: 'content/our-team', element: <OurTeam /> },
          { path: 'content/featured-brands', element: <FeaturedBrands /> },
          { path: 'content/category', element: <CategoryManagement /> },
          { path: 'boats', element: <BoatsInventory /> },
          { path: 'dispatch-report', element: <DispatchReport /> },
          { path: 'users', element: <UsersAndPermission /> },
          { path: 'analytics', element: <AnalyticsAndReports /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
]);

export default router;
